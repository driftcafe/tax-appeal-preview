import { useState } from "react";
import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { WaitlistModal } from "@/components/WaitlistModal";
import { Check, ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";

const free = [
  "Address / PIN lookup",
  "Fairness Score",
  "Estimated annual overpayment",
  "Top-line comp summary (blurred until upgrade)",
];
const proSe = [
  "Full comparable property data",
  "Pre-filled, editable appeal forms",
  "County-specific filing instructions",
  "Downloadable PDF packet ready for submission",
  "Email support",
];
const premium = [
  "Everything in Pro Se Toolkit",
  "Comp quality scoring (Excellent / Strong / Moderate / Weak)",
  "Appeal Strength Score with explained factors",
  "Risk flag analysis (what could weaken your appeal)",
  "AI-generated assessment summary narrative",
  "Polished, branded Assessment Intelligence Report PDF (20–40 pages)",
  "Priority support",
];
const taxWatch = [
  "Annual reassessment monitoring",
  "Township-specific deadline reminders",
  "Re-runs your Fairness Score automatically",
  "Alerts when comparable homes are reassessed lower",
];

const Pricing = () => {
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [taxWatchOpen, setTaxWatchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Pricing — TaxAppeal.app"
        description="Free Fairness Check, $149 Pro Se Toolkit, $399 AI Premium Review, and $29/year Tax Watch. No contingency fees, no percentage of savings."
        path="/pricing"
      />
      <SiteHeader />
      <main>
        <section className="container mx-auto max-w-4xl px-6 pt-16 pb-10 sm:pt-24">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Pricing</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Flat fees. You keep the savings.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Most appeal firms charge 35–40% of your year-one savings. We don't.
            Pay once, file yourself, keep 100% of any reduction.
          </p>
        </section>

        <section className="container mx-auto max-w-6xl px-6 py-10">
          <div className="grid gap-5 md:grid-cols-3">
            {/* Free */}
            <Card title="Free — Fairness Check" price="$0" suffix="" body="Try it on any property in our coverage area." features={free}>
              <a href="/" className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90">
                Get my free score <ArrowRight className="h-4 w-4" />
              </a>
            </Card>

            {/* Pro Se — popular */}
            <Card title="Pro Se Toolkit" price="$149" suffix="one-time" body="Everything you need to file your own appeal." features={proSe} popular>
              <a href="/" className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-accent px-5 text-sm font-semibold text-accent-foreground hover:bg-accent-hover">
                Start my appeal <ArrowRight className="h-4 w-4" />
              </a>
            </Card>

            {/* Premium */}
            <Card title="AI Premium Review" price="$399" suffix="one-time" body="Adds AI-driven analysis and a polished branded report." features={premium}>
              <button onClick={() => setPremiumOpen(true)} className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md border border-primary bg-background px-5 text-sm font-medium text-primary hover:bg-secondary/60">
                <Sparkles className="h-4 w-4" /> Join the waitlist
              </button>
            </Card>
          </div>

          {/* Tax Watch */}
          <div className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">Tax Watch — $29/year</p>
                  <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    Sold standalone or as a checkout upsell. Keeps an eye on your assessment so you never miss a deadline or a chance to appeal again.
                  </p>
                  <ul className="mt-4 grid gap-2 text-sm text-foreground/90 sm:grid-cols-2">
                    {taxWatch.map((t) => (
                      <li key={t} className="flex gap-2"><Check className="mt-1 h-4 w-4 flex-shrink-0 text-accent" /> {t}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <button onClick={() => setTaxWatchOpen(true)} className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-primary bg-background px-5 text-sm font-medium text-primary hover:bg-secondary/60">
                <Zap className="h-4 w-4" /> Add Tax Watch
              </button>
            </div>
          </div>
        </section>

        <section className="border-t border-border/60 bg-secondary/30">
          <div className="container mx-auto max-w-4xl px-6 py-16">
            <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">What you'll never see on your bill</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                "No percentage of your tax savings",
                "No contingency fee",
                "No success fee",
                "No subscription required for the core packet",
                "No charge if your data doesn't suggest an issue",
                "No upsell to legal services",
              ].map((line) => (
                <p key={line} className="text-sm text-foreground/80">— {line}</p>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />

      <WaitlistModal open={premiumOpen} onOpenChange={setPremiumOpen} tier="premium" />
      <WaitlistModal open={taxWatchOpen} onOpenChange={setTaxWatchOpen} tier="tax_watch" />
    </div>
  );
};

const Card = ({
  title, price, suffix, body, features, children, popular,
}: {
  title: string; price: string; suffix: string; body: string; features: string[]; children: React.ReactNode; popular?: boolean;
}) => (
  <div className={`relative flex flex-col rounded-2xl border bg-card p-6 ${popular ? "border-2 border-accent shadow-lg md:scale-[1.02]" : "border-border"}`}>
    {popular && (
      <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
        Most popular
      </span>
    )}
    <p className="text-sm font-semibold text-primary">{title}</p>
    <p className="mt-3"><span className="text-4xl font-bold tracking-tight text-primary">{price}</span>{suffix && <span className="ml-2 text-sm text-muted-foreground">{suffix}</span>}</p>
    <p className="mt-3 text-sm text-muted-foreground">{body}</p>
    <ul className="mt-5 flex-1 space-y-2.5 text-sm text-foreground/90">
      {features.map((f) => (
        <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" /> {f}</li>
      ))}
    </ul>
    {children}
  </div>
);

export default Pricing;
