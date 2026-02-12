"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function Nav() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => setUser(data.user))
      .finally(() => setLoading(false));
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-black/80 backdrop-blur">
      <div className="container-max flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="font-semibold tracking-tight text-gold">Miller Nexus</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-mutedInk md:flex">
          <Link href="/services" className="hover:text-gold">Services</Link>
          <Link href="/insights" className="hover:text-gold">Insights</Link>
          <Link href="/case-studies" className="hover:text-gold">Case Studies</Link>
          <Link href="/contact" className="hover:text-gold">Contact</Link>
          <Link href="/about" className="hover:text-gold">About Us</Link>
        </nav>
        <div className="flex items-center gap-3">
          {loading ? null : user ? (
            <>
              <span className="text-sm text-mutedInk">{user.name}</span>
              <button onClick={handleLogout} className="btn-ghost">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost">Login</Link>
              <Link href="/register" className="btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
