import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const CheckoutCancelled = () => (
  <div className="flex min-h-screen flex-col bg-background text-foreground">
    <SEO title="Checkout cancelled" description="Your checkout was cancelled." path="/checkout-cancelled" noindex />
    <SiteHeader />
    <main className="flex-1 container mx-auto max-w-2xl px-6 pt-16 pb-20 text-center">
      <h1 className="font-serif text-3xl text-primary sm:text-4xl">Checkout cancelled</h1>
      <p className="mt-4 text-base text-muted-foreground">No charge was made. You can return to your comparison and try again.</p>
      <Link to="/" className="mt-8 inline-block text-sm font-medium text-primary hover:underline">← Back home</Link>
    </main>
    <SiteFooter />
  </div>
);

export default CheckoutCancelled;
