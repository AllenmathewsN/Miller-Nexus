export function Section({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <section className="py-14">
      <div className="container-max">
        <div className="max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h2>
          {subtitle ? <p className="mt-3 text-mutedInk">{subtitle}</p> : null}
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
