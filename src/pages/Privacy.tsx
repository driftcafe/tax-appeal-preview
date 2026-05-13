import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const Privacy = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SEO title="Privacy Policy — TaxAppeal.app" description="How TaxAppeal.app collects, secures, and retains customer data." path="/privacy" />
    <SiteHeader />
    <main className="container mx-auto max-w-3xl px-6 pt-16 pb-20">
      <p className="text-sm font-semibold uppercase tracking-wider text-accent">Legal</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-primary sm:text-5xl">Privacy Policy</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Last updated: May 13, 2026 · Version <span className="font-mono">v1-2026-05-13-privacy</span>
      </p>

      <section className="mt-10 space-y-4 text-base leading-relaxed text-foreground/90">
        <h2 className="text-2xl font-bold text-primary">Overview</h2>
        <p>
          This Privacy Policy describes how Property Tax Appeal LLC ("TaxAppeal.app") collects,
          secures, and retains data in connection with our online property tax appeal valuation
          advisory services. Property Tax Appeal LLC operates under a strict, minimal data
          retention framework designed to protect consumer privacy.
        </p>
      </section>

      <section id="data-collection" className="mt-10 space-y-4 text-base leading-relaxed text-foreground/90">
        <h2 className="text-2xl font-bold text-primary">Scope of Collection</h2>
        <p>
          We only collect and store your email address and your physical property address. We do
          not collect, store, or transmit highly sensitive Personally Identifiable Information
          (PII) such as Social Security numbers, date of birth, or individual bank account
          numbers.
        </p>
      </section>

      <section id="payment-processing" className="mt-10 space-y-4 text-base leading-relaxed text-foreground/90">
        <h2 className="text-2xl font-bold text-primary">Third-Party Payment Processing</h2>
        <p>
          All financial transactions are processed securely off-site via a PCI-DSS compliant
          payment gateway (such as Stripe). Property Tax Appeal LLC never sees or retains your
          credit card information, CVV, or billing data.
        </p>
      </section>

      <section id="security-measures" className="mt-10 space-y-4 text-base leading-relaxed text-foreground/90">
        <h2 className="text-2xl font-bold text-primary">Security Measures</h2>
        <p>
          We implement industry-standard administrative and technological security controls.
          Access to our cloud storage environments is strictly restricted via Multi-Factor
          Authentication (MFA) and encrypted communication protocols (HTTPS/SSL). Data is used
          strictly to compile public database information for your administrative property tax
          assessment evaluation.
        </p>
      </section>
    </main>
    <SiteFooter />
  </div>
);

export default Privacy;