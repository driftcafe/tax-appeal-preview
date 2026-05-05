import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { loadLookup } from "@/lib/lookupCache";
import { api, ApiError } from "@/lib/api";
import type { ComparablesResponse } from "@/lib/api";

const schema = z.object({
  customer_name: z.string().trim().min(1, "Required").max(200),
  customer_email: z.string().trim().email("Enter a valid email").max(255),
  tos_accepted: z.literal(true, { errorMap: () => ({ message: "You must accept to continue" }) }),
});

const Signup = () => {
  const { lookupId = "" } = useParams<{ lookupId: string }>();
  const navigate = useNavigate();
  const [lookup, setLookup] = useState<ComparablesResponse | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tos, setTos] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    const cached = loadLookup(lookupId);
    if (!cached) navigate("/", { replace: true });
    else setLookup(cached);
  }, [lookupId, navigate]);

  const fee = useMemo(() => (lookup ? (lookup.price_cents / 100).toFixed(0) : "149"), [lookup]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const parsed = schema.safeParse({ customer_name: name, customer_email: email, tos_accepted: tos });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { fieldErrors[i.path[0] as string] = i.message; });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const consent = await api.consent({
        lookup_id: lookupId,
        customer_name: name.trim(),
        customer_email: email.trim(),
      });
      const origin = window.location.origin;
      const checkout = await api.checkout({
        consent_id: consent.consent_id,
        success_url: `${origin}/success?consent_id=${consent.consent_id}`,
        cancel_url: `${origin}/checkout-cancelled`,
      });
      if (checkout.mode === "scaffold") {
        navigate(`/success?consent_id=${consent.consent_id}&simulated=true`);
      } else {
        window.location.href = checkout.checkout_url;
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 410) {
          setServerError("Your search expired — please look up your PIN again.");
          setTimeout(() => navigate("/"), 1500);
        } else if (err.status === 409) {
          setServerError("You've already started an appeal for this property. Check your email for next steps.");
        } else {
          setServerError(err.message || "Something went wrong. Please try again.");
        }
      } else {
        setServerError("Network error. Please try again.");
      }
      setSubmitting(false);
    }
  };

  if (!lookup) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Sign up — Property Tax Appeal AI" description="Confirm ownership and accept the Terms of Service to continue." path="/signup" noindex />
      <SiteHeader />
      <main className="container mx-auto max-w-2xl px-6 pt-12 pb-20">
        <h1 className="font-serif text-3xl text-primary sm:text-4xl">Get your appeal packet</h1>
        <p className="mt-3 text-base text-muted-foreground">
          {lookup.subject.address} · PIN {lookup.subject.pin_formatted}
        </p>

        <div className="mt-8 rounded-lg border border-border bg-secondary/40 p-5 text-sm leading-relaxed text-foreground/90">
          By signing up, you confirm that you are the property owner. Property Tax Appeal AI LLC is{" "}
          <strong>not a law firm and does not provide legal advice</strong>. We are a scrivener — we
          prepare your appeal documents. <strong>You file the appeal yourself</strong> with the Cook
          County Assessor's Office.
          <br /><br />
          The outcome of your appeal is determined by the Assessor's Office and is not guaranteed.
          You have a <strong>3-business-day right to cancel</strong> for any reason, no charge.
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-primary" htmlFor="name">Full name</label>
            <input
              id="name"
              type="text"
              value={name}
              maxLength={200}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 h-11 w-full rounded-md border border-input bg-card px-3 text-base text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
            {errors.customer_name && <p className="mt-1 text-sm text-destructive">{errors.customer_name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-primary" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              maxLength={255}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 h-11 w-full rounded-md border border-input bg-card px-3 text-base text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
            {errors.customer_email && <p className="mt-1 text-sm text-destructive">{errors.customer_email}</p>}
          </div>
          <div>
            <label className="flex items-start gap-3 text-sm text-foreground">
              <input
                type="checkbox"
                checked={tos}
                onChange={(e) => setTos(e.target.checked)}
                className="mt-0.5 h-4 w-4"
              />
              <span>I agree to the Terms of Service and Privacy Policy.</span>
            </label>
            {errors.tos_accepted && <p className="mt-1 text-sm text-destructive">{errors.tos_accepted}</p>}
          </div>

          {serverError && (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-12 w-full items-center justify-center rounded-md bg-accent px-6 text-base font-medium text-accent-foreground hover:bg-accent-hover disabled:opacity-60"
          >
            {submitting ? "Working…" : `Continue to checkout — $${fee}`}
          </button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Signup;
