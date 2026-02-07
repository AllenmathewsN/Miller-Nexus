import Link from "next/link";
import { Section } from "@/components/Section";
import { PillarCard } from "@/components/PillarCard";

export default function HomePage() {
  return (
    <>
      <section className="py-16 sm:py-24">
        <div className="container-max">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-wider text-mutedInk">Institutional Advisory Platform</p>
            <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight">
              Strategic Advisory at the Intersection of Wellness, Tourism, and Capital Mobilization
            </h1>
            <p className="mt-5 text-mutedInk">
              Miller Nexus supports governments, investors, development partners, and high-value clients
              through evidence-led strategy, structured financing, and discreet execution.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">Engage With Us</Link>
            </div>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2">
            <PillarCard tag="Pillar 01" title="Wellness Advisory"
              desc="Holistic wellness strategy, medical wellness & recovery, and wellness-led destination concepts."
              href="/services/wellness" bgImage="/images/wellness-3.jpeg" />
            <PillarCard tag="Pillar 02" title="Tourism Development"
              desc="Destination planning, eco-tourism, wellness tourism, and investment advisory."
              href="/services/tourism" bgImage="/images/tourism-1.jpeg" />
            <PillarCard tag="Pillar 03" title="Resource Mobilization Consultancy"
              desc="Fundraising advisory, PPP structuring, donor engagement, and project financing."
              href="/services/resource-mobilization" bgImage="/images/Resource mobilization-1.jpeg" />
            <PillarCard tag="Pillar 04" title="Interior Design Consultants"
              desc="Wellness-focused interiors, hospitality design, and institutional environments."
              href="/services/interior-design" bgImage="/images/Interior design-1.jpeg" />
          </div>
        </div>
      </section>

      <Section title="A platform designed for institutional engagement"
        subtitle="Not a brochure site — a strategic workspace that supports confidentiality, documentation, and governance-grade execution.">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { t: "Evidence-led methodology", d: "Frameworks, structured deliverables, and decision-ready artifacts." },
            { t: "Secure document exchange", d: "Password-gated private links, encrypted storage, and audit trails." },
            { t: "Future-ready expansion", d: "Client dashboards, data rooms, project trackers, and partner workspaces." },
          ].map((x) => (
            <div key={x.t} className="card p-6">
              <h3 className="font-semibold">{x.t}</h3>
              <p className="mt-2 text-sm text-mutedInk">{x.d}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
