import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { api, ApiError, ComparablesResponse } from "@/lib/api";
import { loadLookup, saveConsentEmail } from "@/lib/lookupCache";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Signup = () => {
  const { lookupId = "" } = useParams<{ lookupId: string }>();
  const navigate = useNavigate();
  const [lookup, setLookup] = useState<ComparablesResponse | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tos, setTos] = useState(false);
  const [liabilityAck, setLiabilityAck] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const data = loadLookup(lookupId);
    if (!data) {
      navigate("/");
      return;
    }
    setLookup(data);
  }, [lookupId, navigate]);

  const fee = 149;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!name.trim() || !email.trim() || !tos || !liabilityAck) {
      const newErrors: Record<string, string> = {};
      if (!name.trim()) newErrors.customer_name = "Please enter your full name.";
      if (!email.trim()) newErrors.customer_email = "Please enter your email address.";
      if (!tos) newErrors.tos_accepted = "You must agree to the Terms of Service.";
      if (!liabilityAck) newErrors.liability_ack = "You must explicitly acknowledge the limitation of liability.";
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const consent = await api.consent({
        lookup_id: lookupId,
        customer_name: name.trim(),
        customer_email: email.trim(),
        liability_ack_confirmed: true,
      });
      saveConsentEmail(consent.consent_id, email.trim());
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
      <SEO title="Sign up — TaxAppeal.app" description="Confirm ownership and accept the Terms of Service to continue." path="/signup" noindex />
      <SiteHeader />
      <main className="container mx-auto max-w-2xl px-8 pt-16 pb-20 md:px-12">
        <h1 className="type-h2">Get your appeal toolkit</h1>
        <p className="mt-3 type-body-lg text-slate">
          {lookup.subject.address} · <span className="font-semibold text-primary">PIN {lookup.subject.pin_formatted}</span>
        </p>

        <div className="mt-10 rounded-[30px] border border-border/60 bg-white p-8 shadow-[0_0_20px_0_rgba(29,29,31,0.09)]">
          <p className="type-body-sm leading-relaxed text-slate">
            By signing up, you confirm that you are the property owner. TaxAppeal.app is{" "}
            <span className="font-bold text-primary">not a law firm and does not provide legal advice</span>. We prepare your appeal documents using public data and township-specific logic. <span className="font-bold text-primary">You file the appeal yourself</span> pro se.
          </p>
          <p className="mt-4 type-body-sm leading-relaxed text-slate">
            The outcome is determined by the Assessor's Office. You have a <span className="font-bold text-primary">3-business-day right to cancel</span> for any reason, no charge.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-10 space-y-6">
          <div className="space-y-2">
            <label className="type-utility uppercase tracking-wider text-slate" htmlFor="name">Full name</label>
            <input
              id="name"
              type="text"
              value={name}
              maxLength={200}
              onChange={(e) => setName(e.target.value)}
              className="h-14 w-full rounded-xl border border-border bg-card px-4 text-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
            {errors.customer_name && <p className="mt-1 text-sm text-destructive">{errors.customer_name}</p>}
          </div>
          <div className="space-y-2">
            <label className="type-utility uppercase tracking-wider text-slate" htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              maxLength={255}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 w-full rounded-xl border border-border bg-card px-4 text-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
            {errors.customer_email && <p className="mt-1 text-sm text-destructive">{errors.customer_email}</p>}
          </div>
          <div className="pt-2">
            <label className="flex items-start gap-4 cursor-pointer group">
              <input
                type="checkbox"
                checked={tos}
                onChange={(e) => setTos(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-border text-electric focus:ring-electric/30"
              />
              <span className="type-body-sm text-slate group-hover:text-primary transition-colors">I agree to the Terms of Service and Privacy Policy.</span>
            </label>
            {errors.tos_accepted && <p className="mt-1 text-sm text-destructive">{errors.tos_accepted}</p>}
          </div>

          <div className="rounded-[20px] border-2 border-electric/20 bg-electric/5 p-6">
            <label htmlFor="liability_ack" className="flex items-start gap-4 cursor-pointer">
              <input
                id="liability_ack"
                type="checkbox"
                checked={liabilityAck}
                onChange={(e) => setLiabilityAck(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-border text-electric focus:ring-electric/30 flex-shrink-0"
              />
              <span className="type-body-sm text-slate leading-relaxed">
                I have read, understood, and agree to the{" "}
                <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline font-bold text-primary hover:text-electric transition-colors">Terms of Service</a>
                {" "}and explicitly acknowledge the{" "}
                <a href="/terms#limitation-of-liability" target="_blank" rel="noopener noreferrer" className="underline font-bold text-primary hover:text-electric transition-colors">Limitation of Liability</a>
                {" "}section, which caps all potential damages at the $149.00 fee paid. I understand this fee is non-refundable and earned upon receipt.
              </span>
            </label>
            {errors.liability_ack && <p className="mt-2 text-sm text-destructive">{errors.liability_ack}</p>}
          </div>

          {serverError && (
            <p className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 type-body-sm text-destructive">
              {serverError}
            </p>
          )}

          <Button
            type="submit"
            disabled={submitting || !liabilityAck}
            intent="primary"
            size="large"
            variant="filled"
            trailingIcon={ArrowRight}
            className="w-full"
          >
            {submitting ? "Preparing toolkit…" : `Continue to checkout — $${fee}`}
          </Button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Signup;
