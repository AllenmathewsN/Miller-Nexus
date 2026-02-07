import { Section } from "@/components/Section";
import Image from "next/image";

export default function InteriorDesignPage() {
  return (
    <>
      <section className="py-16 sm:py-24">
        <div className="container-max">
          <div className="max-w-4xl">
            <p className="text-xs uppercase tracking-wider text-mutedInk">Interior Design Consultancy</p>
            <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight">
              Scope and Purpose
            </h1>
            <div className="mt-8 space-y-6 text-mutedInk">
              <p>
                The interior design function supports hospitality, wellness, and institutional projects that require coherence between brand, function, and user experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Section title="Core Capabilities" subtitle="">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card p-6">
            <Image 
              src="/images/Interior design-1.jpeg" 
              alt="Interior design project" 
              width={400} 
              height={300} 
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h3 className="font-semibold mb-3">Design Services</h3>
            <ul className="text-sm text-mutedInk space-y-2">
              <li>• Interior design advisory for wellness, hospitality, and mixed-use developments</li>
              <li>• Coordination with architects, operators, and clinical advisors</li>
              <li>• Design governance to ensure regulatory, operational, and brand alignment</li>
            </ul>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold mb-3">Strategic Value</h3>
            <p className="text-sm text-mutedInk">
              Design is treated as a strategic tool, not decoration. The focus is on environments that support outcomes, longevity, and operational efficiency.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
