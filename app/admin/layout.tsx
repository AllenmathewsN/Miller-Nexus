"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (!data.user) router.push("/login");
        else setUser(data.user);
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  if (loading) return <div className="py-10 text-center">Loading...</div>;
  if (!user) return null;

  return (
    <div className="py-10">
      <div className="container-max">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold tracking-tight">Admin</h1>
          <nav className="flex gap-4 text-sm text-mutedInk">
            <Link className="hover:text-ink" href="/admin">Dashboard</Link>
            <Link className="hover:text-ink" href="/admin/projects">Projects</Link>
            <Link className="hover:text-ink" href="/admin/links">Links</Link>
            <Link className="hover:text-ink" href="/admin/uploads">Uploads</Link>
            <Link className="hover:text-ink" href="/admin/audit-logs">Audit Logs</Link>
            <button onClick={handleLogout} className="hover:text-gold">Logout</button>
          </nav>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
