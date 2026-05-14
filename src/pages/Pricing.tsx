import { useState } from "react";
import { motion } from "framer-motion";
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

import { Button } from "@/components/ui/button";

const Pricing = () => {
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [taxWatchOpen, setTaxWatchOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SEO
        title="Pricing — TaxAppeal.app"
        description="Free Fairness Check, $149 Pro Se Toolkit, $399 AI Premium Review, and $29/year Tax Watch. No contingency fees, no percentage of savings."
        path="/pricing"
      />
      <SiteHeader />
      <main className="flex-1">
        <motion.section 
          className="container mx-auto max-w-7xl px-8 pt-16 pb-10 sm:pt-24 md:px-12 lg:px-24"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="type-eyebrow-lg">Pricing</p>
          <h2 className="mt-4 type-h2 text-primary">
            Flat fees. You keep the savings.
          </h2>
          <p className="mt-6 type-body-lg max-w-5xl">
            Most appeal firms charge 35–40% of your year-one savings. We don't.
            <br className="hidden sm:block" />
            <span className="type-body-lg-emph">Pay once, file yourself, keep 100% of any reduction.</span>
          </p>
        </motion.section>

        <motion.section 
          className="container mx-auto max-w-7xl px-8 md:px-12 lg:px-24 py-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="grid gap-8 md:grid-cols-3">
            {/* Free */}
            <Card title="Free — Fairness Check" price="$0" suffix="" body="Try it on any property in our coverage area." features={free}>
              <Button asChild intent="secondary" size="small" variant="filled" trailingIcon={ArrowRight} className="mt-6">
                <a href="/">Get my free score</a>
              </Button>
            </Card>

            {/* Pro Se — popular */}
            <Card title="Pro Se Toolkit" price="$149" suffix="one-time" body="Everything you need to file your own appeal." features={proSe} popular>
              <Button asChild intent="primary" size="large" variant="filled" trailingIcon={ArrowRight} className="mt-6">
                <a href="/">Start my appeal</a>
              </Button>
            </Card>

            {/* Premium */}
            <Card title="AI Premium Review" price="$399" suffix="one-time" body="Adds AI-driven analysis and a polished branded report." features={premium}>
              <Button onClick={() => setPremiumOpen(true)} intent="primary" size="small" variant="outline" leadingIcon={Sparkles} className="mt-6">
                Join the waitlist
              </Button>
            </Card>
          </div>

          {/* Tax Watch */}
          <div className="mt-12 rounded-[30px] border border-border/60 bg-white p-8 shadow-[0_0_20px_0_rgba(29,29,31,0.08)] sm:flex sm:items-center sm:justify-between sm:gap-8">
            <div className="flex items-start gap-5">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[18px] bg-electric/10 text-electric shadow-sm">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="type-body-lg-emph text-primary">Tax Watch — $29/year</p>
                <p className="mt-2 type-body-lg max-w-2xl">
                  Keeps an eye on your assessment so you never miss a deadline or a chance to appeal again. re-runs your Fairness Score automatically.
                </p>
                <ul className="mt-4 grid gap-x-6 gap-y-2 type-body-sm text-foreground/90 sm:grid-cols-2">
                  {taxWatch.map((t) => (
                    <li key={t} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" /> {t}</li>
                  ))}
                </ul>
              </div>
            </div>
            <Button onClick={() => setTaxWatchOpen(true)} intent="primary" size="small" variant="outline" leadingIcon={Zap} className="mt-6 sm:mt-0 sm:flex-shrink-0">
              Add Tax Watch
            </Button>
          </div>
        </motion.section>

        <motion.section 
          className="border-t border-border/60 bg-[#F7F9FB]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="container mx-auto max-w-7xl px-8 md:px-12 lg:px-24 py-24">
            <h2 className="type-h2">What you'll never see on your bill</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {[
                "No percentage of your tax savings",
                "No contingency fee",
                "No success fee",
                "No subscription required for the core packet",
                "No charge if your data doesn't suggest an issue",
                "No upsell to legal services",
              ].map((line) => (
                <div key={line} className="flex items-center gap-3 type-body-lg">
                  <span className="text-success font-bold">/</span> {line}
                </div>
              ))}
            </div>
          </div>
        </motion.section>
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
  <div className={`relative flex flex-col rounded-[30px] bg-white p-8 transition-all duration-300 shadow-[0_0_20px_0_rgba(29,29,31,0.08)] border ${popular ? "border-electric/40 ring-1 ring-electric/5 md:scale-[1.05] z-10" : "border-border/60"}`}>
    {popular && (
      <span className="absolute -top-3 left-8 rounded-full bg-electric px-4 py-1 type-utility font-bold uppercase tracking-widest !text-white shadow-sm">
        Most popular
      </span>
    )}
    <p className="type-body-lg-emph text-primary">{title}</p>
    <p className="mt-4">
      <span className="type-h3">{price}</span>
      {suffix && <span className="ml-2 type-utility text-slate">{suffix}</span>}
    </p>
    <p className="mt-4 type-body-lg text-slate">{body}</p>
    <ul className="mt-6 flex-1 space-y-3 type-body-sm text-foreground/90">
      {features.map((f) => (
        <li key={f} className="flex gap-3"><Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" /> {f}</li>
      ))}
    </ul>
    {children}
  </div>
);

export default Pricing;
