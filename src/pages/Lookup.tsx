import { useState } from "react";
import { Link } from "react-router-dom";
import { CTAButton } from "@/components/CTAButton";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { sampleOpportunity } from "@/data/opportunity";

const DEMO_PIN = "17-09-17-115-017";

type Result =
  | { kind: "match" }
  | { kind: "miss" }
  | { kind: "none" };

const Lookup = () => {
  const [pin, setPin] = useState("");
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<Result>({ kind: "none" });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = pin.trim();
    if (normalized === DEMO_PIN) setResult({ kind: "match" });
    else setResult({ kind: "miss" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="container mx-auto max-w-2xl px-6 pt-16 pb-12 sm:pt-24">
        <h1 className="font-serif text-3xl text-primary sm:text-4xl">
          Check your property
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          We analyze Kankakee County residential parcels only. Kankakee PINs are
          13 or 14 digits, typically formatted like XX-XX-XX-XXX-XXX.
        </p>

        <form onSubmit={onSubmit} className="mt-10 space-y-6">
          <div>
            <label htmlFor="pin" className="block text-sm font-medium text-primary">
              Enter your Kankakee County parcel number (PIN)
            </label>
            <input
              id="pin"
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="17-09-17-115-017"
              className="mt-2 w-full rounded-md border border-input bg-card px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-primary">
              or search by address
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="1832 Oak Grove Dr, Bourbonnais, IL"
              className="mt-2 w-full rounded-md border border-input bg-card px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>

          <CTAButton onClick={() => undefined}>
            <button type="submit" className="contents">Check my property</button>
          </CTAButton>
          {/* Submit also via form Enter; the CTA wraps an inner submit button for accessibility */}
        </form>

        <div className="mt-10">
          {result.kind === "match" && (
            <div className="rounded-md border border-border bg-card p-6">
              <p className="text-sm uppercase tracking-wide text-muted-foreground">
                Match found
              </p>
              <p className="mt-2 font-serif text-xl text-primary">
                {sampleOpportunity.siteAddress}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                PIN {sampleOpportunity.pin} · {sampleOpportunity.township} Township
              </p>
              <p className="mt-4 text-base text-foreground/90">
                We believe this parcel's {sampleOpportunity.assessmentYear} assessment
                may be approximately ${sampleOpportunity.assessedValueGap.toLocaleString()} too high.
              </p>
              <div className="mt-6">
                <Link
                  to={`/o/${sampleOpportunity.token}`}
                  className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground hover:bg-accent-hover"
                >
                  See the full analysis
                </Link>
              </div>
            </div>
          )}

          {result.kind === "miss" && (
            <div className="rounded-md border border-border bg-card p-6 text-base leading-relaxed text-foreground/90">
              We don't see this property in our current dataset. If you have a
              Kankakee County residential parcel, email us at{" "}
              <a
                href="mailto:hello@kankakeeappeals.com"
                className="font-medium text-accent hover:underline"
              >
                hello@kankakeeappeals.com
              </a>{" "}
              and we'll check manually.
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default Lookup;