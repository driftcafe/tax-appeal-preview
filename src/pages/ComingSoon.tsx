import { Link, useLocation } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ComingSoon = () => {
  const { pathname } = useLocation();
  const isAbout = pathname === "/about";
  const title = isAbout ? "About Tax Appeal AI" : "Coming soon — new page";
  const description = isAbout
    ? "About Tax Appeal AI — a flat-fee toolkit helping Illinois homeowners file their own property tax appeals."
    : "This page is coming soon to Property Tax Appeal AI.";
  
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SEO
        title={title}
        description={description}
        path={pathname}
        noindex
      />
      <SiteHeader />
      <main className="flex-1">
        <section className="container mx-auto max-w-4xl px-8 md:px-12 lg:px-24 py-32 text-center">
          <p className="type-eyebrow-lg">Building the future of property tax</p>
          <h2 className="mt-6 type-h2 text-primary">
            {isAbout ? "Empowering homeowners." : "We're building this next."}
          </h2>
          <p className="mt-8 type-body-lg text-slate max-w-2xl mx-auto">
            {isAbout 
              ? "Property Tax Appeal AI is a mission-driven financial tool designed to level the playing field for Illinois homeowners. We combine public assessor data with authoritative logic to help you file your own appeal without the high contingency fees of law firms."
              : "We're launching in Illinois in June 2026. This page will be live before then. Check back soon for more information on our tools and methodology."}
          </p>
          <div className="mt-12">
            <Button
              asChild
              intent="secondary"
              size="large"
              variant="outline"
              leadingIcon={ArrowLeft}
            >
              <Link to="/">Back to home</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default ComingSoon;
