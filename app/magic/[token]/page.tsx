"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function MagicLinkPage() {
  const params = useParams();
  const [document, setDocument] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    validateAndFetch();
  }, []);

  async function validateAndFetch() {
    const res = await fetch(`/api/magic/${params.token}`);
    const data = await res.json();
    
    if (res.ok) {
      setDocument(data.document);
      if (data.customMessage) {
        alert(data.customMessage);
      }
      await fetch(`/api/magic/${params.token}/access`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ipAddress: "client-ip",
          userAgent: navigator.userAgent,
        }),
      });
    } else {
      setError(data.error || "Invalid or expired link");
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-mutedInk">Validating access...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card p-8 max-w-md text-center">
          <h1 className="text-2xl font-semibold text-red-500">Access Denied</h1>
          <p className="mt-4 text-mutedInk">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container-max max-w-4xl">
        <div className="card p-8">
          <h1 className="text-3xl font-semibold">{document.name}</h1>
          {document.description && (
            <p className="mt-3 text-mutedInk">{document.description}</p>
          )}
          
          <div className="mt-8 p-6 bg-gold/10 rounded">
            <h2 className="font-semibold mb-4">Document Details</h2>
            <div className="space-y-2 text-sm">
              <p><span className="text-mutedInk">Type:</span> {document.documentType?.name || "N/A"}</p>
              <p><span className="text-mutedInk">Version:</span> v{document.currentVersion}</p>
              <p><span className="text-mutedInk">Created:</span> {new Date(document.createdAt).toLocaleDateString()}</p>
              {document.tags && <p><span className="text-mutedInk">Tags:</span> {document.tags}</p>}
            </div>
          </div>

          {document.versions && document.versions.length > 0 && (
            <div className="mt-6">
              <button 
                onClick={() => window.open(`/api/edms/download?versionId=${document.versions[0].id}`, '_blank')}
                className="btn-primary w-full"
              >
                Download Document
              </button>
            </div>
          )}

          <p className="mt-6 text-xs text-mutedInk text-center">
            This is a secure, time-limited access link. Do not share this URL.
          </p>
        </div>
      </div>
    </div>
  );
}
