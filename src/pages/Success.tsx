import { useSearchParams } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CheckCircle2 } from "lucide-react";

const Success = () => {
  const [params] = useSearchParams();
  const simulated = params.get("simulated") === "true";
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Payment received — Property Tax Appeal AI" description="Your appeal packet is being prepared." path="/success" noindex />
      <SiteHeader />
      <main className="container mx-auto max-w-2xl px-6 pt-16 pb-20 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-accent" />
        <h1 className="mt-4 font-serif text-3xl text-primary sm:text-4xl">
          {simulated ? "Simulated checkout complete" : "Payment received"}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          We're preparing your appeal packet now. This usually takes under a minute.
          You'll get an email as soon as it's ready, and you can also refresh this page.
        </p>
        {simulated && (
          <p className="mx-auto mt-6 max-w-md rounded-md border border-border bg-secondary/40 p-3 text-sm text-muted-foreground">
            Stripe is not yet provisioned in this environment, so no real charge was made.
          </p>
        )}
        <p className="mt-10 text-xs text-muted-foreground">
          Property Tax Appeal AI LLC is not a law firm and does not provide legal advice.
          You file the appeal yourself with the Cook County Assessor's Office.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Success;
