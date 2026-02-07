"use client";

import { useMemo, useState } from "react";

type LinkRow = {
  id: string;
  tokenHash: string;
  isActive: boolean;
  createdAt: string;
  revokedAt: string | null;
  projectId: string | null;
  project: { referenceCode: string; name: string } | null;
  _count: { uploads: number };
};

function fmtDate(iso: string) {
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}

export default function AdminLinksPage() {
  const [adminKey, setAdminKey] = useState("");
  const [password, setPassword] = useState("");
  const [projectId, setProjectId] = useState("");
  const [links, setLinks] = useState<LinkRow[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const portalBase = useMemo(() => {
    return (process.env.NEXT_PUBLIC_PORTAL_URL ?? "https://portal.celestine.com").replace(/\/$/, "");
  }, []);

  async function load() {
    if (!adminKey) return;
    setBusy(true); setMsg(null);
    try {
      const r = await fetch("/api/admin/links", { headers: { "x-admin-key": adminKey } });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Failed to load");
      setLinks(j.links ?? []);
    } catch {
      setMsg("Could not load links. Check your admin key.");
    } finally {
      setBusy(false);
    }
  }

  async function createLink() {
    if (!adminKey || password.length < 6) return;
    setBusy(true); setMsg(null);
    try {
      const r = await fetch("/api/admin/links", {
        method: "POST",
        headers: { "content-type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify({ password, projectId: projectId || null }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Failed");
      setPassword("");
      await load();
      if (j?.link?.url) setMsg(`Link created:\n${j.link.url}`);
      else setMsg("Link created.");
    } catch {
      setMsg("Failed to create link.");
    } finally {
      setBusy(false);
    }
  }

  async function action(id: string, act: "pause" | "resume" | "revoke") {
    if (!adminKey) return;
    setBusy(true); setMsg(null);
    try {
      const r = await fetch("/api/admin/links", {
        method: "PATCH",
        headers: { "content-type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify({ id, action: act }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Failed");
      await load();
    } catch {
      setMsg("Action failed.");
    } finally {
      setBusy(false);
    }
  }

  async function resetPassword(id: string) {
    if (!adminKey) return;
    const newPassword = window.prompt("Enter a new password (min 6 chars):") || "";
    if (newPassword.length < 6) return;

    setBusy(true); setMsg(null);
    try {
      const r = await fetch("/api/admin/links", {
        method: "PATCH",
        headers: { "content-type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify({ id, action: "reset_password", newPassword }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Failed");
      setMsg("Password updated.");
      await load();
    } catch {
      setMsg("Password reset failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-lg font-semibold tracking-tight">Secure Link Generator</h2>
        <p className="mt-2 text-sm text-mutedInk">
          Create password-gated upload links for external partners. Links do not expire; pause or revoke when needed.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Admin API Key</label>
            <input className="input" value={adminKey} onChange={(e) => setAdminKey(e.target.value)} placeholder="Paste ADMIN_API_KEY" />
            <p className="helper">Required to access admin APIs. Store securely.</p>
          </div>

          <div>
            <label className="label">Project ID (optional)</label>
            <input className="input" value={projectId} onChange={(e) => setProjectId(e.target.value)} placeholder="Optional project id" />
            <p className="helper">You can tie a link to a project later.</p>
          </div>

          <div>
            <label className="label">Link Password (min 6 chars)</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Set upload password" />
          </div>

          <div className="flex items-end gap-3">
            <button className="btn-primary" disabled={busy || !adminKey || password.length < 6} onClick={createLink}>
              {busy ? "Working…" : "Create Link"}
            </button>
            <button className="btn-ghost" disabled={busy || !adminKey} onClick={load}>
              {busy ? "Loading…" : "Refresh List"}
            </button>
          </div>
        </div>

        {msg ? <div className="mt-4 text-sm text-mutedInk whitespace-pre-wrap">{msg}</div> : null}
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold">Recent Links</h3>
          <div className="text-xs text-mutedInk">Portal base: {portalBase}</div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-mutedInk">
              <tr className="border-b border-black/10">
                <th className="py-2 text-left">Status</th>
                <th className="py-2 text-left">Created</th>
                <th className="py-2 text-left">Project</th>
                <th className="py-2 text-left">Uploads</th>
                <th className="py-2 text-left">Link</th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {links.length === 0 ? (
                <tr><td className="py-4 text-mutedInk" colSpan={6}>No links loaded yet.</td></tr>
              ) : (
                links.map((l) => {
                  const url = `${portalBase}/portal/${l.tokenHash}`;
                  const status = l.revokedAt ? "revoked" : (l.isActive ? "active" : "paused");
                  return (
                    <tr key={l.id} className="border-b border-black/5 align-top">
                      <td className="py-3"><span className="rounded-full bg-black/5 px-2 py-1 text-xs">{status}</span></td>
                      <td className="py-3">{fmtDate(l.createdAt)}</td>
                      <td className="py-3">
                        {l.project ? (
                          <div>
                            <div className="font-medium">{l.project.referenceCode}</div>
                            <div className="text-xs text-mutedInk">{l.project.name}</div>
                          </div>
                        ) : <span className="text-mutedInk">—</span>}
                      </td>
                      <td className="py-3">{l._count?.uploads ?? 0}</td>
                      <td className="py-3">
                        <div className="max-w-[360px] truncate">
                          <a className="text-evergreen hover:opacity-80" href={url} target="_blank" rel="noreferrer">{url}</a>
                        </div>
                        <button className="mt-2 text-xs text-mutedInk underline hover:text-ink"
                          onClick={() => navigator.clipboard.writeText(url)}>Copy URL</button>
                      </td>
                      <td className="py-3 text-right space-x-2">
                        {status === "active" ? (
                          <button className="btn-ghost" onClick={() => action(l.id, "pause")} disabled={busy}>Pause</button>
                        ) : status === "paused" ? (
                          <button className="btn-ghost" onClick={() => action(l.id, "resume")} disabled={busy}>Resume</button>
                        ) : null}
                        <button className="btn-ghost" onClick={() => resetPassword(l.id)} disabled={busy || status === "revoked"}>Reset Password</button>
                        <button className="btn-ghost" onClick={() => action(l.id, "revoke")} disabled={busy || status === "revoked"}>Revoke</button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 helper">
          External users must provide password + name + email to upload. All activity is logged.
        </p>
      </div>
    </div>
  );
}
