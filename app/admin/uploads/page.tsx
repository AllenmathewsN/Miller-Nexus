"use client";
import { Section } from "@/components/Section";
import { useState } from "react";

export default function Page() {
  const [documents] = useState([
    { id: 1, name: "Contract_2024.pdf", uploadedBy: "Admin", date: "2024-02-07" },
    { id: 2, name: "Financial_Report.xlsx", uploadedBy: "Admin", date: "2024-02-06" },
  ]);
  const [selectedDoc, setSelectedDoc] = useState<number | null>(null);
  const [email, setEmail] = useState("");

  const handleShare = () => {
    alert(`Access granted to ${email} for document`);
    setSelectedDoc(null);
    setEmail("");
  };

  return (
    <Section title="Documents" subtitle="Manage and share documents">
      <div className="card p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Document</th>
              <th className="text-left p-2">Uploaded By</th>
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-b">
                <td className="p-2">{doc.name}</td>
                <td className="p-2">{doc.uploadedBy}</td>
                <td className="p-2">{doc.date}</td>
                <td className="p-2">
                  <button
                    onClick={() => setSelectedDoc(doc.id)}
                    className="text-blue-600 hover:underline"
                  >
                    Share Access
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Grant Document Access</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">User Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                placeholder="user@example.com"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleShare} className="btn-primary">
                Grant Access
              </button>
              <button onClick={() => setSelectedDoc(null)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
