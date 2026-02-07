import { Section } from "@/components/Section";
import Image from "next/image";

export default function WellnessPage() {
  return (
    <>
      <section className="py-16 sm:py-24">
        <div className="container-max">
          <div className="max-w-4xl">
            <p className="text-xs uppercase tracking-wider text-mutedInk">Wellness Advisory and Development</p>
            <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight">
              Scope and Purpose
            </h1>
            <div className="mt-8 space-y-6 text-mutedInk">
              <p>
                The wellness pillar addresses holistic wellness, medical wellness, recovery focused services, spa operations, and wellness led destination concepts. The approach integrates health outcomes, hospitality standards, and long term commercial sustainability.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Section title="Core Capabilities" subtitle="">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card p-6">
            <Image 
              src="/images/wellness-1.jpeg" 
              alt="Medical wellness facility" 
              width={400} 
              height={300} 
              className="w-full h-48 object-cover rounded mb-4"
            />
            <ul className="text-sm text-mutedInk space-y-2">
              <li>• Concept development for medical wellness and recovery centers</li>
              <li>• Advisory on spa, medi-spa, and wellness facility programming</li>
              <li>• Wellness tourism strategy and destination positioning</li>
              <li>• Integration of clinical, hospitality, and experiential design considerations</li>
            </ul>
          </div>
          <div className="card p-6">
            <Image 
              src="/images/wellness-2.jpeg" 
              alt="Wellness destination" 
              width={400} 
              height={300} 
              className="w-full h-48 object-cover rounded mb-4"
            />
            <div>
              <h3 className="font-semibold mb-3">Strategic Value</h3>
              <p className="text-sm text-mutedInk">
                Miller Nexus positions wellness as an economic and social infrastructure asset, not a luxury add-on. Projects are framed to attract both health-focused clients and institutional investors.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
