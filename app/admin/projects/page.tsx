"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CaseFoldersPage() {
  const [folders, setFolders] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetchFolders();
    fetchCategories();
  }, []);

  async function fetchFolders() {
    const res = await fetch("/api/edms/folders");
    const data = await res.json();
    setFolders(data.folders || []);
    setLoading(false);
  }

  async function fetchCategories() {
    const res = await fetch("/api/edms/categories");
    const data = await res.json();
    setCategories(data.categories || []);
  }

  async function deleteFolder(id: string) {
    if (!confirm("Delete this folder and all its documents?")) return;
    await fetch(`/api/edms/folders/${id}`, { method: "DELETE" });
    fetchFolders();
  }

  return (
    <div className="py-8">
      <div className="container-max">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold">Case Folders</h1>
            <p className="text-mutedInk mt-1">Manage your document case folders</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="btn-primary">
            + New Case Folder
          </button>
        </div>

        {loading ? (
          <p className="text-mutedInk">Loading folders...</p>
        ) : folders.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-mutedInk">No case folders yet. Create your first one!</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-4">
            {folders.map((folder) => (
              <Link key={folder.id} href={`/admin/projects/${folder.id}`}>
                <div className="card p-6 hover:border-gold transition cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{folder.name}</h3>
                      {folder.category && (
                        <span className="text-xs text-gold">{folder.category.name}</span>
                      )}
                    </div>
                    <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-mutedInk mt-2 line-clamp-2">{folder.description || "No description"}</p>
                  <div className="mt-4 pt-4 border-t border-gold/20">
                    <p className="text-sm text-mutedInk">
                      {folder._count?.documents || 0} files
                    </p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="btn-ghost flex-1">Open Case Folder</button>
                    <button onClick={(e) => { e.preventDefault(); deleteFolder(folder.id); }} className="btn-ghost text-red-500">Delete</button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {showCreate && (
          <CreateFolderModal
            categories={categories}
            onClose={() => setShowCreate(false)}
            onSuccess={() => {
              setShowCreate(false);
              fetchFolders();
            }}
          />
        )}
      </div>
    </div>
  );
}

function CreateFolderModal({ categories, onClose, onSuccess }: any) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/edms/folders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, description, categoryId: categoryId || null }),
    });
    setBusy(false);
    if (res.ok) onSuccess();
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="card p-8 max-w-lg w-full mx-4">
        <h2 className="text-2xl font-semibold">Create Case Folder</h2>
        <form onSubmit={handleCreate} className="mt-6 space-y-4">
          <div>
            <label className="label">Folder Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <label className="label">Category (Optional)</label>
            <select className="input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">-- Select Category --</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1" disabled={busy}>
              {busy ? "Creating..." : "Create Folder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
