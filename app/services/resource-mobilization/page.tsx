import { Section } from "@/components/Section";
import Image from "next/image";

export default function ResourceMobilizationPage() {
  return (
    <>
      <section className="py-16 sm:py-24">
        <div className="container-max">
          <div className="max-w-4xl">
            <p className="text-xs uppercase tracking-wider text-mutedInk">Resource Mobilization Consultancy</p>
            <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight">
              Scope and Purpose
            </h1>
            <div className="mt-8 space-y-6 text-mutedInk">
              <p>
                Miller Nexus provides structured advisory services for mobilizing capital across public, private, and blended finance environments. The focus is on projects that require institutional confidence, governance clarity, and long term viability.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Section title="Core Capabilities" subtitle="">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card p-6">
            <Image 
              src="/images/Resource mobilization-1.jpeg" 
              alt="Resource mobilization" 
              width={400} 
              height={300} 
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h3 className="font-semibold mb-3">Capital Mobilization</h3>
            <ul className="text-sm text-mutedInk space-y-2">
              <li>• Fundraising strategy and capital sourcing across equity, debt, grants, and concessional finance</li>
              <li>• Investment structuring, including PPP frameworks and special purpose vehicles</li>
              <li>• Donor and development partner engagement</li>
              <li>• Financial modeling and project finance advisory for large scale initiatives</li>
            </ul>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold mb-3">Strategic Value</h3>
            <p className="text-sm text-mutedInk mb-4">
              The firm operates as an intermediary that translates project vision into bankable structures. Emphasis is placed on alignment between sponsors, financiers, and implementing entities.
            </p>
            <div className="bg-yellow-50 p-4 rounded">
              <h4 className="font-semibold text-sm mb-2">Evidence Gap</h4>
              <p className="text-sm text-mutedInk">
                Success depends on demonstrable transaction experience. Case studies and anonymized deal summaries should be prioritized on the platform.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
