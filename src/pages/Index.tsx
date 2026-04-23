import { CTAButton } from "@/components/CTAButton";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const steps = [
  {
    n: "1",
    label: "We find the gap",
    body: "We compare your parcel's assessed value to similar homes in your township. Same use code, same lot size band, same township.",
  },
  {
    n: "2",
    label: "We file the appeal",
    body: "If the comparison shows you appear over-assessed, we prepare the PTAX-230 appeal packet and submit it to the county Board of Review on your behalf, with your signed authorization.",
  },
  {
    n: "3",
    label: "You only pay if we win",
    body: "Our fee is 40% of year-one tax savings. If the Board doesn't reduce your assessment, our fee is $0.",
  },
];

const trust = [
  "Non-attorney representation — permitted at the county Board of Review for residential assessments",
  "Signed authorization required before we submit anything on your behalf",
  "Licensed in Illinois / Kankakee County only",
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Hero */}
      <section className="container mx-auto max-w-4xl px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
        <h1 className="font-serif text-4xl leading-[1.1] text-primary sm:text-5xl md:text-6xl">
          Your Kankakee County assessment may be too high.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          We compare your property to similar homes in your township. If we find
          you're over-assessed, we handle the appeal — and we only get paid if
          you win.
        </p>
        <div className="mt-10 flex flex-col items-start gap-3">
          <CTAButton to="/lookup">Look up your property</CTAButton>
          <p className="text-sm text-muted-foreground">
            Kankakee County residential properties only.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border/60 bg-secondary/40">
        <div className="container mx-auto max-w-5xl px-6 py-20">
          <h2 className="font-serif text-3xl text-primary sm:text-4xl">How it works</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n}>
                <div className="font-serif text-3xl text-accent">{s.n}</div>
                <h3 className="mt-3 font-serif text-xl text-primary">{s.label}</h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why this works in Kankakee */}
      <section className="container mx-auto max-w-3xl px-6 py-20">
        <h2 className="font-serif text-3xl text-primary sm:text-4xl">
          Why this works in Kankakee
        </h2>
        <p className="mt-6 text-base leading-relaxed text-foreground/90">
          The county's standard allows challenges based on clear and convincing
          evidence that a property is assessed inconsistently with comparable
          properties. When neighbors with the same use code and lot size carry
          a meaningfully lower assessment, that's the kind of evidence the
          Board of Review considers.
        </p>
        <p className="mt-4 text-base leading-relaxed text-foreground/90">
          The appeal window is 30 days after assessment notices are published
          each year. If you miss it, you wait until next year — so timing
          matters.
        </p>
      </section>

      {/* Trust indicators */}
      <section className="border-t border-border/60 bg-secondary/40">
        <div className="container mx-auto max-w-5xl px-6 py-16">
          <div className="grid gap-6 md:grid-cols-3">
            {trust.map((t) => (
              <div
                key={t}
                className="rounded-md border border-border bg-card p-6 text-sm leading-relaxed text-foreground/90"
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Secondary CTA */}
      <section className="container mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="font-serif text-3xl text-primary sm:text-4xl">
          See if your home qualifies.
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          It takes about a minute and costs nothing to check.
        </p>
        <div className="mt-8 flex justify-center">
          <CTAButton to="/lookup">Look up your property</CTAButton>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default Index;
