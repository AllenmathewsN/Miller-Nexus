import { Section } from "@/components/Section";
export default function AdminHome() {
  return (
    <Section title="Dashboard" subtitle="Admin overview (scaffold). Wire to your auth and data as you deploy.">
      <div className="grid gap-5 md:grid-cols-3">
        {[
          { t: "Projects", d: "Create and manage engagements with reference codes." },
          { t: "Secure Links", d: "Generate password-gated upload links; pause/revoke as needed." },
          { t: "Uploads & Logs", d: "Review uploads, download securely, and audit activity." },
        ].map((x) => (
          <div key={x.t} className="card p-6">
            <h3 className="font-semibold">{x.t}</h3>
            <p className="mt-2 text-sm text-mutedInk">{x.d}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
