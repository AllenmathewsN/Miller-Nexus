import Link from "next/link";
import Image from "next/image";

export function PillarCard({ title, desc, href, tag, bgImage }: { title: string; desc: string; href: string; tag: string; bgImage?: string }) {
  return (
    <div className="card overflow-hidden">
      <div className="h-36 relative">
        {bgImage ? (
          <Image 
            src={bgImage} 
            alt={title} 
            fill 
            className="object-cover"
          />
        ) : (
          <div className="h-full bg-gradient-to-br from-gold/15 to-black/0" />
        )}
      </div>
      <div className="p-6">
        <div className="text-xs uppercase tracking-wider text-mutedInk">{tag}</div>
        <h3 className="mt-2 text-lg font-semibold tracking-tight">{title}</h3>
        <p className="mt-2 text-sm text-mutedInk">{desc}</p>
        <Link href={href} className="mt-5 inline-flex text-sm font-medium text-gold hover:opacity-80">
          Learn more →
        </Link>
      </div>
    </div>
  );
}
