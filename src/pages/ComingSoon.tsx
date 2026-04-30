import { Link, useLocation } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const ComingSoon = () => {
  const { pathname } = useLocation();
  return (
  <div className="min-h-screen bg-background text-foreground">
    <SEO
      title="Coming Soon"
      description="This page is coming soon to TaxAppeal AI."
      path={pathname}
      noindex
    />
    <SiteHeader />
    <main>
    <section className="container mx-auto max-w-2xl px-6 py-32 text-center">
      <p className="text-sm uppercase tracking-wider text-muted-foreground">Coming soon</p>
      <h1 className="mt-3 font-serif text-4xl text-primary sm:text-5xl">
        We're building this next.
      </h1>
      <p className="mt-6 text-lg text-muted-foreground">
        Sign-in, the customer dashboard, and a few other pages live in our app
        at <span className="text-foreground">app.taxappeal.ai</span> and aren't
        wired up here yet.
      </p>
      <Link
        to="/"
        className="mt-10 inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-base font-medium text-accent-foreground hover:bg-accent-hover"
      >
        ← Back to home
      </Link>
    </section>
    </main>
    <SiteFooter />
  </div>
  );
};

export default ComingSoon;
