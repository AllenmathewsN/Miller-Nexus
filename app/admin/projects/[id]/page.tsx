"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function FolderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [folder, setFolder] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    fetchFolder();
  }, []);

  async function fetchFolder() {
    const res = await fetch(`/api/edms/folders/${params.id}`);
    const data = await res.json();
    setFolder(data.folder);
    setDocuments(data.folder?.documents || []);
    setLoading(false);
  }

  async function generateMagicLink(documentId: string) {
    const email = prompt("Enter collaborator email:");
    if (!email) return;

    const res = await fetch("/api/edms/magic-link", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, documentId, expiryDays: 7 }),
    });

    const data = await res.json();
    if (res.ok) {
      alert(`Magic link generated!\n\nSend this to ${email}:\n${data.linkUrl}\n\nExpires in 7 days.`);
    }
  }

  if (loading) return <div className="py-8 container-max">Loading...</div>;
  if (!folder) return <div className="py-8 container-max">Folder not found</div>;

  return (
    <div className="py-8">
      <div className="container-max">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/projects" className="text-mutedInk hover:text-gold">← Back</Link>
        </div>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold">{folder.name}</h1>
            {folder.description && <p className="text-mutedInk mt-2">{folder.description}</p>}
            {folder.category && <span className="inline-block mt-2 text-xs px-3 py-1 bg-gold/20 text-gold rounded">{folder.category.name}</span>}
          </div>
          <button onClick={() => setShowUpload(true)} className="btn-primary">+ Upload Document</button>
        </div>

        {documents.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-mutedInk">No documents yet. Upload your first document!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="card p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold">{doc.name}</h3>
                    <p className="text-sm text-mutedInk">
                      v{doc.currentVersion} • {doc.documentType?.name || "No type"} • {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                    {doc.tags && <p className="text-xs text-gold mt-1">{doc.tags}</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => window.open(`/api/edms/download?versionId=${doc.versions[0]?.id}`, '_blank')} className="btn-ghost text-sm">Download</button>
                  <button onClick={() => generateMagicLink(doc.id)} className="btn-ghost text-sm text-gold">Share</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showUpload && (
          <UploadModal
            folderId={folder.id}
            onClose={() => setShowUpload(false)}
            onSuccess={() => {
              setShowUpload(false);
              fetchFolder();
            }}
          />
        )}
      </div>
    </div>
  );
}

function UploadModal({ folderId, onClose, onSuccess }: any) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setBusy(true);
    
    // Create document record
    const docRes = await fetch("/api/edms/documents", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, description, tags, folderId }),
    });
    
    const { document } = await docRes.json();
    
    // Upload file
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentId", document.id);
    
    await fetch("/api/edms/upload", {
      method: "POST",
      body: formData,
    });
    
    setBusy(false);
    onSuccess();
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="card p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold">Upload Document</h2>
        <form onSubmit={handleUpload} className="mt-6 space-y-4">
          <div>
            <label className="label">Document Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <label className="label">Tags (comma separated)</label>
            <input className="input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="contract, legal, 2024" />
          </div>
          <div>
            <label className="label">File</label>
            <input 
              type="file" 
              className="input" 
              onChange={(e) => setFile(e.target.files?.[0] || null)} 
              required 
            />
            {file && <p className="text-xs text-mutedInk mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>}
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1" disabled={busy || !file}>
              {busy ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
