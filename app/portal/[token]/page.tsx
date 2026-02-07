"use client";
import { useMemo, useState } from "react";

type VerifyResp = { ok: boolean; linkId?: string; projectId?: string | null };
type UploadUrlResp = { url: string; uploadId: string };

const ALLOWED = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "image/png",
  "image/jpeg",
];
const MAX_BYTES = 200 * 1024 * 1024;

export default function PortalUploadPage({ params }: { params: { token: string } }) {
  const token = params.token;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verified, setVerified] = useState<VerifyResp | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const fileError = useMemo(() => {
    if (!file) return null;
    if (file.size > MAX_BYTES) return "File is too large (max 200MB).";
    if (!ALLOWED.includes(file.type)) return "Unsupported file type.";
    return null;
  }, [file]);

  async function verify() {
    setMsg(null); setBusy(true);
    try {
      const r = await fetch("/api/portal/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, password, uploaderName: name, uploaderEmail: email }),
      });
      const data = (await r.json()) as VerifyResp;
      if (!r.ok || !data.ok) { setVerified(null); setMsg("Access denied. Check password and try again."); return; }
      setVerified(data); setMsg("Access granted.");
    } catch { setMsg("Error verifying access. Please try again."); }
    finally { setBusy(false); }
  }

  async function upload() {
    if (!verified?.linkId || !file || fileError) return;
    setBusy(true); setMsg(null);
    try {
      const r1 = await fetch("/api/portal/upload-url", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          linkId: verified.linkId,
          filename: file.name,
          mimeType: file.type,
          size: file.size,
          uploaderName: name,
          uploaderEmail: email,
          notes: "",
        }),
      });
      if (!r1.ok) throw new Error("upload-url failed");
      const d1 = (await r1.json()) as UploadUrlResp;

      const put = await fetch(d1.url, { method: "PUT", headers: { "content-type": file.type }, body: file });
      if (!put.ok) throw new Error("s3 put failed");

      const r3 = await fetch("/api/portal/upload-complete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ uploadId: d1.uploadId }),
      });
      if (!r3.ok) throw new Error("complete failed");

      setMsg("Upload received. Thank you.");
      setFile(null);
    } catch { setMsg("Upload failed. Please try again."); }
    finally { setBusy(false); }
  }

  return (
    <div className="py-12">
      <div className="container-max">
        <div className="card p-6 md:p-10 max-w-2xl">
          <p className="text-xs uppercase tracking-wider text-mutedInk">Secure Document Portal</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Upload Documents</h1>
          <p className="mt-2 text-sm text-mutedInk">
            Enter the password provided by Miller Nexus. Name and email are required for audit and tracking.
          </p>

          <div className="mt-6 grid gap-4">
            <div><label className="label">Full name</label><input className="input" value={name} onChange={(e)=>setName(e.target.value)} required /></div>
            <div><label className="label">Email</label><input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required /></div>
            <div>
              <label className="label">Password</label>
              <input className="input" value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required />
              <p className="helper">No expiry links; access is controlled by password and can be revoked.</p>
            </div>

            <button className="btn-primary w-fit" onClick={verify} disabled={busy || !name || !email || !password}>
              {busy ? "Please wait…" : "Verify access"}
            </button>

            {msg ? <div className="text-sm text-mutedInk">{msg}</div> : null}

            <div className="mt-4 border-t border-black/10 pt-6">
              <label className="label">Select file (max 200MB)</label>
              <input className="input" type="file" onChange={(e)=>setFile(e.target.files?.[0] ?? null)} disabled={!verified?.ok} />
              <p className="helper">Allowed: PDF, Word, Excel, JPG/PNG.</p>
              {fileError ? <div className="mt-2 text-sm text-red-700">{fileError}</div> : null}
              <button className="btn-primary mt-4" onClick={upload} disabled={busy || !verified?.ok || !file || !!fileError}>
                {busy ? "Uploading…" : "Upload securely"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
