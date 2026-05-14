import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const Terms = () => (
  <div className="flex min-h-screen flex-col bg-background text-foreground">
    <SEO title="Terms of Service — TaxAppeal.app" description="TaxAppeal.app Terms of Service, fees and refunds policy, and Limitation of Liability." path="/terms" />
    <SiteHeader minimal />
    <main className="flex-1 container mx-auto max-w-3xl px-8 pt-16 pb-20">
      <p className="type-eyebrow-sm text-electric uppercase">Legal</p>
      <h1 className="mt-4 type-h2 text-primary sm:text-5xl">Terms of Service</h1>
      <p className="mt-3 type-utility text-slate">
        Last updated: May 13, 2026 · Version <span className="font-mono">v2-2026-05-13-non-refundable</span>
      </p>

      <section className="mt-12 space-y-6 type-body-lg text-slate">
        <h2 className="type-h3 text-primary">Overview</h2>
        <p>
          TaxAppeal.app provides online property tax appeal valuation advisory services and document
          preparation for Illinois homeowners filing pro se. TaxAppeal.app is not a law firm and does
          not provide legal advice or representation. The customer files the appeal themselves with
          the relevant county assessor's office.
        </p>
      </section>

      <section id="fees-and-refunds" className="mt-12 space-y-6 type-body-lg text-slate">
        <h2 className="type-h3 text-primary">Fees and Refunds</h2>
        <p>
          $149 flat. Non-refundable, earned upon receipt — the packet is a complete digital
          deliverable produced when you purchase.
        </p>
        <p>
          The fee is fixed and is <span className="font-bold text-primary italic">not contingent</span> on any reduction obtained from the
          county. The customer files the appeal with the county themselves. The outcome is determined
          by the county and is not guaranteed.
        </p>
        <p>
          The sole exception to non-refundability is when the packet has not yet been delivered
          <em> and</em> parcel ownership has changed prior to delivery. Outside that narrow case,
          the fee is non-refundable.
        </p>
      </section>

      <section id="limitation-of-liability" className="mt-12 space-y-6 type-body-lg text-slate">
        <h2 className="type-h3 text-primary">Limitation of Liability</h2>
        <div className="rounded-2xl border border-border bg-secondary/30 p-6 font-semibold uppercase tracking-tight text-primary leading-relaxed shadow-sm">
          TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, THE TOTAL AGGREGATE LIABILITY OF
          TAXAPPEAL.APP, ITS FOUNDERS, OFFICERS, AND AFFILIATES TO THE CUSTOMER FOR ANY AND ALL
          CLAIMS, LOSSES, ERRORS, OR DAMAGES ARISING OUT OF THE ONLINE TAX APPEAL VALUATION
          ADVISORY SERVICES SHALL BE STRICTLY LIMITED TO THE EXACT FLAT FEE ACTUALLY PAID BY THE
          CUSTOMER, WHICH IS FIXED AT ONE HUNDRED FORTY-NINE DOLLARS ($149.00 USD).
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>
);

export default Terms;