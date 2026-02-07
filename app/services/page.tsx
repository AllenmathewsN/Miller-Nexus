import { Section } from "@/components/Section";
import { PillarCard } from "@/components/PillarCard";

export default function ServicesPage() {
  return (
    <Section title="Services" subtitle="Four integrated pillars designed for institutional-level engagements.">
      <div className="grid gap-5 md:grid-cols-2">
        <PillarCard tag="Pillar 01" title="Wellness Advisory" desc="Strategy, medical wellness, recovery, and destination concepts." href="/services/wellness" />
        <PillarCard tag="Pillar 02" title="Tourism Development" desc="Destination planning, eco-tourism, wellness tourism, investment advisory." href="/services/tourism" />
        <PillarCard tag="Pillar 03" title="Resource Mobilization Consultancy" desc="Fundraising advisory, PPP structuring, donor engagement, project financing." href="/services/resource-mobilization" />
        <PillarCard tag="Pillar 04" title="Interior Design Consultants" desc="Wellness-led interiors, hospitality and institutional design." href="/services/interior-design" />
      </div>
    </Section>
  );
}
