import { Section } from "@/components/Section";

export default function AboutPage() {
  return (
    <>
      <section className="py-16 sm:py-24">
        <div className="container-max">
          <div className="max-w-4xl">
            <p className="text-xs uppercase tracking-wider text-mutedInk">About Miller Nexus</p>
            <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight">
              Core Positioning
            </h1>
            <div className="mt-8 space-y-6 text-mutedInk">
              <p>
                Miller Nexus is a multidisciplinary advisory and development consultancy operating at the intersection of Wellness, Tourism, Resource Mobilization, and Interior Design. The firm is structured to support complex, capital intensive, and institutionally governed projects from concept through financing, design coordination, and strategic delivery.
              </p>
              <p className="text-lg font-medium text-ink">
                Miller Nexus functions as a strategic interface between vision, capital, and implementation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Section title="Digital Platform and Secure Data Exchange" subtitle="Institutional Function">
        <div className="card p-6">
          <p className="text-sm text-mutedInk mb-4">
            The website functions as a secure engagement platform, not a marketing site.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Key Features</h3>
              <ul className="text-sm text-mutedInk space-y-1">
                <li>• Encrypted document exchange with role-based access</li>
                <li>• Private, password-protected project links</li>
                <li>• Audit logging and document traceability</li>
                <li>• Scalable architecture for future client dashboards and investor portals</li>
              </ul>
            </div>
            <div className="card p-4 bg-gray-50">
              <h3 className="font-semibold mb-2">Positioning Statement</h3>
              <p className="text-sm text-mutedInk">
                Miller Nexus delivers a future-proof, institution-ready platform designed for complex engagements in wellness, tourism, and capital mobilization. The firm operates where strategy, funding, design, and delivery intersect. The outcome is not visibility. The outcome is trust, bankability, and execution confidence.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
