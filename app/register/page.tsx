"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMsg("Registration successful! Redirecting to login...");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setMsg(data.error || "Registration failed");
      }
    } catch {
      setMsg("Registration failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="py-16">
      <div className="container-max">
        <div className="card p-8 max-w-md mx-auto">
          <h1 className="text-2xl font-semibold">Register</h1>
          <p className="mt-2 text-sm text-mutedInk">Create your Miller Nexus account</p>
          
          <form onSubmit={handleRegister} className="mt-6 space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input 
                className="input" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
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
              {busy ? "Registering..." : "Register"}
            </button>
          </form>
          
          <p className="mt-4 text-sm text-center text-mutedInk">
            Already have an account? <Link href="/login" className="text-gold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
