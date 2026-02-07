"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMsg("Login successful! Redirecting...");
        setTimeout(() => router.push("/"), 1500);
      } else {
        setMsg(data.error || "Login failed");
      }
    } catch {
      setMsg("Login failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="py-16">
      <div className="container-max">
        <div className="card p-8 max-w-md mx-auto">
          <h1 className="text-2xl font-semibold">Login</h1>
          <p className="mt-2 text-sm text-mutedInk">Access your Miller Nexus account</p>
          
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="label">Email</label>
              <input 
                className="input" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input 
                className="input" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            
            {msg && <p className="text-sm text-gold">{msg}</p>}
            
            <button type="submit" className="btn-primary w-full" disabled={busy}>
              {busy ? "Logging in..." : "Login"}
            </button>
          </form>
          
          <p className="mt-4 text-sm text-center text-mutedInk">
            Don't have an account? <Link href="/register" className="text-gold hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
