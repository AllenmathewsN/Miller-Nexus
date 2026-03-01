-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "folderId" TEXT NOT NULL,
    "documentTypeId" TEXT,
    "ownerId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "tags" TEXT,
    "currentVersion" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Document_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "CaseFolder" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Document_documentTypeId_fkey" FOREIGN KEY ("documentTypeId") REFERENCES "DocumentType" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Document_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Document" ("createdAt", "currentVersion", "description", "documentTypeId", "folderId", "id", "name", "ownerId", "status", "tags", "updatedAt") SELECT "createdAt", "currentVersion", "description", "documentTypeId", "folderId", "id", "name", "ownerId", "status", "tags", "updatedAt" FROM "Document";
DROP TABLE "Document";
ALTER TABLE "new_Document" RENAME TO "Document";
CREATE TABLE "new_DocumentVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "storageKey" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    CONSTRAINT "DocumentVersion_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DocumentVersion" ("documentId", "fileName", "id", "mimeType", "notes", "size", "storageKey", "uploadedAt", "uploadedBy", "version") SELECT "documentId", "fileName", "id", "mimeType", "notes", "size", "storageKey", "uploadedAt", "uploadedBy", "version" FROM "DocumentVersion";
DROP TABLE "DocumentVersion";
ALTER TABLE "new_DocumentVersion" RENAME TO "DocumentVersion";
CREATE TABLE "new_FieldValue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FieldValue_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FieldValue_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FieldValue" ("createdAt", "documentId", "fieldId", "id", "value") SELECT "createdAt", "documentId", "fieldId", "id", "value" FROM "FieldValue";
DROP TABLE "FieldValue";
ALTER TABLE "new_FieldValue" RENAME TO "FieldValue";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
