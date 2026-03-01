-- ============================================================
-- FULL RBAC + EDMS Schema (PostgreSQL)
-- Includes: Super Admin + Org roles + invited (not logged in) users
-- Multi-tenant + Role/Permission RBAC + Resource ACL + Audit
-- ============================================================

-- Extensions (recommended)
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

-- ---------- ENUMS ----------
DO $$ BEGIN
  CREATE TYPE user_status AS ENUM (
    'invited',
    'pending_verification',
    'active',
    'suspended',
    'disabled',
    'archived'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE resource_type AS ENUM ('organization', 'project', 'folder', 'document');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE document_state AS ENUM ('draft', 'in_review', 'approved', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------- TENANCY ----------
CREATE TABLE IF NOT EXISTS organizations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  code            TEXT,
  description     TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, name)
);

-- ---------- USERS ----------
CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           CITEXT NOT NULL UNIQUE,
  full_name       TEXT,
  status          user_status NOT NULL DEFAULT 'invited',
  last_login_at   TIMESTAMPTZ,
  invited_at      TIMESTAMPTZ DEFAULT now(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Users can belong to many orgs (recommended)
CREATE TABLE IF NOT EXISTS organization_memberships (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_primary      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, user_id)
);

-- ---------- INVITES (NOT LOGGED IN YET) ----------
CREATE TABLE IF NOT EXISTS user_invites (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email           CITEXT NOT NULL,
  role_id         UUID,
  token_hash      TEXT NOT NULL,
  expires_at      TIMESTAMPTZ NOT NULL,
  accepted_at     TIMESTAMPTZ,
  invited_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, email)
);

CREATE INDEX IF NOT EXISTS idx_user_invites_expires ON user_invites(expires_at);

-- ---------- ROLES & PERMISSIONS (RBAC) ----------
CREATE TABLE IF NOT EXISTS roles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  scope           TEXT NOT NULL CHECK (scope IN ('global', 'organization')),
  description     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (name, scope)
);

CREATE TABLE IF NOT EXISTS permissions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key         TEXT NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id       UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id         UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, role_id, organization_id)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_org  ON user_roles(organization_id);

CREATE OR REPLACE FUNCTION enforce_role_scope() RETURNS trigger AS $$
DECLARE rscope TEXT;
BEGIN
  SELECT scope INTO rscope FROM roles WHERE id = NEW.role_id;
  IF rscope = 'global' AND NEW.organization_id IS NOT NULL THEN
    RAISE EXCEPTION 'Global role must not have organization_id';
  END IF;
  IF rscope = 'organization' AND NEW.organization_id IS NULL THEN
    RAISE EXCEPTION 'Organization role must have organization_id';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_enforce_role_scope ON user_roles;
CREATE TRIGGER trg_enforce_role_scope
BEFORE INSERT OR UPDATE ON user_roles
FOR EACH ROW EXECUTE FUNCTION enforce_role_scope();

-- ---------- EDMS STRUCTURE ----------
CREATE TABLE IF NOT EXISTS folders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id      UUID REFERENCES projects(id) ON DELETE CASCADE,
  parent_id       UUID REFERENCES folders(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  path            TEXT,
  created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, project_id, parent_id, name)
);

CREATE INDEX IF NOT EXISTS idx_folders_project ON folders(project_id);
CREATE INDEX IF NOT EXISTS idx_folders_parent  ON folders(parent_id);

CREATE TABLE IF NOT EXISTS documents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id      UUID REFERENCES projects(id) ON DELETE CASCADE,
  folder_id       UUID REFERENCES folders(id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  doc_number      TEXT,
  state           document_state NOT NULL DEFAULT 'draft',
  current_version INTEGER NOT NULL DEFAULT 1,
  created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_docs_folder  ON documents(folder_id);
CREATE INDEX IF NOT EXISTS idx_docs_project ON documents(project_id);

CREATE TABLE IF NOT EXISTS document_versions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id     UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  version         INTEGER NOT NULL,
  file_url        TEXT NOT NULL,
  file_hash       TEXT,
  mime_type       TEXT,
  size_bytes      BIGINT,
  created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (document_id, version)
);

-- ---------- RESOURCE ACL ----------
CREATE TABLE IF NOT EXISTS access_control_entries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  resource_kind   resource_type NOT NULL,
  resource_id     UUID NOT NULL,
  principal_kind  TEXT NOT NULL CHECK (principal_kind IN ('user', 'role')),
  principal_id    UUID NOT NULL,
  can_view        BOOLEAN NOT NULL DEFAULT FALSE,
  can_upload      BOOLEAN NOT NULL DEFAULT FALSE,
  can_edit        BOOLEAN NOT NULL DEFAULT FALSE,
  can_delete      BOOLEAN NOT NULL DEFAULT FALSE,
  can_share       BOOLEAN NOT NULL DEFAULT FALSE,
  can_review      BOOLEAN NOT NULL DEFAULT FALSE,
  can_approve     BOOLEAN NOT NULL DEFAULT FALSE,
  can_publish     BOOLEAN NOT NULL DEFAULT FALSE,
  inherited       BOOLEAN NOT NULL DEFAULT FALSE,
  created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (resource_kind, resource_id, principal_kind, principal_id)
);

CREATE INDEX IF NOT EXISTS idx_ace_resource  ON access_control_entries(resource_kind, resource_id);
CREATE INDEX IF NOT EXISTS idx_ace_principal ON access_control_entries(principal_kind, principal_id);

-- ---------- AUDIT LOG ----------
CREATE TABLE IF NOT EXISTS audit_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  actor_user_id   UUID REFERENCES users(id) ON DELETE SET NULL,
  action          TEXT NOT NULL,
  resource_kind   resource_type,
  resource_id     UUID,
  ip_address      INET,
  user_agent      TEXT,
  meta            JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_org_time ON audit_logs(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_actor    ON audit_logs(actor_user_id, created_at DESC);

-- ============================================================
-- SEED: ROLES
-- ============================================================
INSERT INTO roles (name, scope, description)
VALUES
  ('super_admin',     'global',       'Platform owner: full access across all organizations'),
  ('org_admin',       'organization',  'Organization administrator'),
  ('project_admin',   'organization',  'Project admin / manager'),
  ('records_officer', 'organization',  'Document controller / records officer'),
  ('contributor',     'organization',  'Create/upload/edit within permitted scope'),
  ('reviewer',        'organization',  'Review/annotate and request changes'),
  ('approver',        'organization',  'Approve/reject and publish (within scope)'),
  ('guest',           'organization',  'External guest with restricted access'),
  ('auditor',         'organization',  'Read-only + audit visibility (within scope)')
ON CONFLICT (name, scope) DO NOTHING;

-- ============================================================
-- SEED: PERMISSIONS
-- ============================================================
INSERT INTO permissions (key, description) VALUES
  ('platform.manage',     'Manage platform settings, tenants, global roles'),
  ('org.create',          'Create organizations'),
  ('org.manage',          'Manage organization settings'),
  ('user.create',         'Create users'),
  ('user.invite',         'Invite users'),
  ('user.manage',         'Update/disable users'),
  ('role.manage',         'Create/manage roles'),
  ('permission.manage',   'Create/manage permissions'),
  ('audit.view_global',   'View audit logs across all orgs'),
  ('project.create',      'Create projects'),
  ('project.manage',      'Manage projects'),
  ('folder.create',       'Create folders'),
  ('folder.manage',       'Rename/move/delete folders'),
  ('doc.upload',          'Upload documents'),
  ('doc.view',            'View documents'),
  ('doc.edit',            'Edit documents/metadata'),
  ('doc.delete',          'Delete documents'),
  ('doc.version',         'Create/restore document versions'),
  ('doc.checkout',        'Check-out / lock documents'),
  ('doc.submit_review',   'Submit document for review'),
  ('doc.review',          'Review/comment'),
  ('doc.approve',         'Approve/reject'),
  ('doc.publish',         'Publish controlled/final')
ON CONFLICT (key) DO NOTHING;
