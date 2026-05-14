import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ReportView } from "@/components/ReportView";
import { api, ApiError, type ReportByConsentResponse } from "@/lib/api";
import { loadConsentEmail } from "@/lib/lookupCache";
import { CheckCircle2, Loader2, AlertTriangle } from "lucide-react";

const POLL_MS = 1500;
const MAX_ATTEMPTS = 60;

const Success = () => {
  const [params] = useSearchParams();
  const consentId = params.get("consent_id") ?? "";
  const simulated = params.get("simulated") === "true";
  const [state, setState] = useState<ReportByConsentResponse | { status: "loading" } | { status: "not_found" } | { status: "timeout" } | { status: "error" }>({ status: "loading" });
  const [retrying, setRetrying] = useState(false);
  const stoppedRef = useRef(false);
  const customerEmail = consentId ? loadConsentEmail(consentId) : null;

  useEffect(() => {
    if (!consentId) return;
    stoppedRef.current = false;
    const ctrl = new AbortController();
    let attempts = 0;

    const tick = async () => {
      if (stoppedRef.current) return;
      try {
        const res = await api.reportByConsent(consentId, ctrl.signal);
        if (stoppedRef.current) return;
        setState(res);
        if (res.status === "ready" || res.status === "payment_failed") {
          stoppedRef.current = true;
          return;
        }
      } catch (err) {
        if ((err as any)?.name === "AbortError") return;
        if (err instanceof ApiError && err.status === 404) {
          stoppedRef.current = true;
          setState({ status: "not_found" });
          return;
        }
        // transient — keep polling
      }
      attempts += 1;
      if (attempts >= MAX_ATTEMPTS) {
        stoppedRef.current = true;
        setState({ status: "timeout" });
        return;
      }
      setTimeout(tick, POLL_MS);
    };

    tick();
    return () => {
      stoppedRef.current = true;
      ctrl.abort();
    };
  }, [consentId]);

  const retryCheckout = async () => {
    if (!consentId) return;
    setRetrying(true);
    try {
      const origin = window.location.origin;
      const checkout = await api.checkout({
        consent_id: consentId,
        success_url: `${origin}/success?consent_id=${consentId}`,
        cancel_url: `${origin}/checkout-cancelled`,
      });
      if (checkout.mode === "scaffold") {
        window.location.href = `${origin}/success?consent_id=${consentId}&simulated=true`;
      } else {
        window.location.href = checkout.checkout_url;
      }
    } catch {
      setRetrying(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SEO title="Your appeal packet" description="Your appeal packet is ready." path="/success" noindex />
      <SiteHeader />
      <main className="flex-1 container mx-auto max-w-4xl px-6 pt-12 pb-20">
        {!consentId && (
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-primary">We couldn't find that order</h1>
            <p className="mt-3 text-muted-foreground">Please look up your PIN again.</p>
            <Link to="/" className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-accent px-5 font-semibold text-accent-foreground hover:bg-accent-hover">
              Back to home
            </Link>
          </div>
        )}

        {consentId && simulated && (
          <p className="mb-6 rounded-md border border-border bg-secondary/40 p-3 text-sm text-muted-foreground">
            Stripe is not yet provisioned in this environment, so no real charge was made.
          </p>
        )}

        {consentId && (state.status === "loading" || state.status === "awaiting_payment" || state.status === "generating") && (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-accent" />
            <h1 className="mt-4 text-2xl font-semibold text-primary">Payment received</h1>
            <p className="mt-3 text-base text-muted-foreground">
              Preparing your appeal packet — usually under a minute.
            </p>
            <Loader2 className="mx-auto mt-6 h-6 w-6 animate-spin text-accent" />
          </div>
        )}

        {consentId && state.status === "payment_failed" && (
          <div className="rounded-2xl border border-destructive/40 bg-card p-10 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
            <h1 className="mt-4 text-2xl font-semibold text-primary">Payment didn't go through</h1>
            <p className="mt-3 text-base text-muted-foreground">
              Reason: <span className="font-medium">{(state as { reason?: string }).reason ?? "unknown"}</span>
            </p>
            <button
              onClick={retryCheckout}
              disabled={retrying}
              className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-accent px-5 font-semibold text-accent-foreground hover:bg-accent-hover disabled:opacity-60"
            >
              {retrying ? "Working…" : "Try checkout again"}
            </button>
          </div>
        )}

        {consentId && state.status === "not_found" && (
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-primary">We couldn't find that order</h1>
            <p className="mt-3 text-muted-foreground">Please look up your PIN again.</p>
            <Link to="/" className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-accent px-5 font-semibold text-accent-foreground hover:bg-accent-hover">
              Back to home
            </Link>
          </div>
        )}

        {consentId && state.status === "timeout" && (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <h1 className="text-2xl font-semibold text-primary">This is taking longer than expected</h1>
            <p className="mt-3 text-base text-muted-foreground">
              We'll email your packet to <span className="font-medium text-primary">{customerEmail ?? "your inbox"}</span> as soon as it's ready.
              You can also refresh this page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-accent px-5 font-semibold text-accent-foreground hover:bg-accent-hover"
            >
              Refresh
            </button>
          </div>
        )}

        {consentId && state.status === "ready" && (
          <ReportView report={(state as Extract<ReportByConsentResponse, { status: "ready" }>).report} customerEmail={customerEmail} />
        )}
      </main>
      <SiteFooter />
    </div>
  );
};

export default Success;
