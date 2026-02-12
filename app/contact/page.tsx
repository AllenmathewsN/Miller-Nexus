import { Section } from "@/components/Section";

export default function ContactPage() {
  return (
    <Section title="Contact" subtitle="Institutional inquiries routed for fast response.">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <h3 className="font-semibold">Direct Contact</h3>
          <div className="mt-4 space-y-3">
            <div>
              <label className="label">Email</label>
              <p className="text-gold font-medium">laura.miller@millernexus.net</p>
              <p className="text-mutedInk mt-1">0790 502270</p>
            </div>
            <div>
              <label className="label">For institutional inquiries and project discussions</label>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold">Client Access</h3>
          <p className="mt-2 text-sm text-mutedInk">
            For secure document management and project tracking, please contact us for account setup.
          </p>
        </div>
      </div>
    </Section>
  );
}
