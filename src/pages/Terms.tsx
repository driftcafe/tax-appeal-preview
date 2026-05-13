import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const Terms = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SEO title="Terms of Service — TaxAppeal.app" description="TaxAppeal.app Terms of Service, fees and refunds policy, and Limitation of Liability." path="/terms" />
    <SiteHeader />
    <main className="container mx-auto max-w-3xl px-6 pt-16 pb-20">
      <p className="text-sm font-semibold uppercase tracking-wider text-accent">Legal</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-primary sm:text-5xl">Terms of Service</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Last updated: May 13, 2026 · Version <span className="font-mono">v2-2026-05-13-non-refundable</span>
      </p>

      <section className="mt-10 space-y-4 text-base leading-relaxed text-foreground/90">
        <h2 className="text-2xl font-bold text-primary">Overview</h2>
        <p>
          TaxAppeal.app provides online property tax appeal valuation advisory services and document
          preparation for Illinois homeowners filing pro se. TaxAppeal.app is not a law firm and does
          not provide legal advice or representation. The customer files the appeal themselves with
          the relevant county assessor's office.
        </p>
      </section>

      <section id="fees-and-refunds" className="mt-10 space-y-4 text-base leading-relaxed text-foreground/90">
        <h2 className="text-2xl font-bold text-primary">Fees and Refunds</h2>
        <p>
          $149 flat. Non-refundable, earned upon receipt — the packet is a complete digital
          deliverable produced when you purchase.
        </p>
        <p>
          The fee is fixed and is <strong>not contingent</strong> on any reduction obtained from the
          county. The customer files the appeal with the county themselves. The outcome is determined
          by the county and is not guaranteed.
        </p>
        <p>
          The sole exception to non-refundability is when the packet has not yet been delivered
          <em> and</em> parcel ownership has changed prior to delivery. Outside that narrow case,
          the fee is non-refundable.
        </p>
      </section>

      <section id="limitation-of-liability" className="mt-10 space-y-4 text-base leading-relaxed text-foreground/90">
        <h2 className="text-2xl font-bold text-primary">Limitation of Liability</h2>
        <p className="rounded-md border border-border bg-secondary/40 p-5 font-medium uppercase tracking-wide">
          TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, THE TOTAL AGGREGATE LIABILITY OF
          TAXAPPEAL.APP, ITS FOUNDERS, OFFICERS, AND AFFILIATES TO THE CUSTOMER FOR ANY AND ALL
          CLAIMS, LOSSES, ERRORS, OR DAMAGES ARISING OUT OF THE ONLINE TAX APPEAL VALUATION
          ADVISORY SERVICES SHALL BE STRICTLY LIMITED TO THE EXACT FLAT FEE ACTUALLY PAID BY THE
          CUSTOMER, WHICH IS FIXED AT ONE HUNDRED FORTY-NINE DOLLARS ($149.00 USD).
        </p>
      </section>
    </main>
    <SiteFooter />
  </div>
);

export default Terms;