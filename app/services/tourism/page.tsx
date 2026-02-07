import { Section } from "@/components/Section";
import Image from "next/image";

export default function TourismPage() {
  return (
    <>
      <section className="py-16 sm:py-24">
        <div className="container-max">
          <div className="max-w-4xl">
            <p className="text-xs uppercase tracking-wider text-mutedInk">Tourism Development and Advisory</p>
            <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight">
              Scope and Purpose
            </h1>
            <div className="mt-8 space-y-6 text-mutedInk">
              <p>
                This pillar focuses on tourism as a development tool, investment asset, and destination branding mechanism. The emphasis is on sustainable, eco-conscious, and wellness-aligned tourism models.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Section title="Core Capabilities" subtitle="">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card p-6">
            <Image 
              src="/images/tourism-2.jpeg" 
              alt="Tourism destination" 
              width={400} 
              height={300} 
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h3 className="font-semibold mb-3">Tourism Development</h3>
            <ul className="text-sm text-mutedInk space-y-2">
              <li>• Tourism master planning and destination development</li>
              <li>• Eco-tourism and conservation-linked tourism frameworks</li>
              <li>• Wellness tourism strategy</li>
              <li>• Tourism investment advisory and feasibility analysis</li>
            </ul>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold mb-3">Strategic Value</h3>
            <p className="text-sm text-mutedInk">
              The firm bridges policy objectives and investor requirements, ensuring tourism projects are both market viable and development aligned.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
