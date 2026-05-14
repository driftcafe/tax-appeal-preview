import { Link } from "react-router-dom";

export const SiteFooter = ({ extraDisclaimer }: { extraDisclaimer?: string }) => (
  <footer className="mt-24 border-t border-border/60 bg-[#F7F9FB]">
    <div className="container mx-auto max-w-7xl px-8 md:px-12 lg:px-24 py-10 text-muted-foreground">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-base font-bold tracking-tight text-primary">
          TaxAppeal<span className="text-success">.app</span>
        </p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Link to="/about" className="hover:text-primary">About</Link>
          <Link to="/pricing" className="hover:text-primary">Pricing</Link>
          <Link to="/counties" className="hover:text-primary">Coverage</Link>
          <Link to="/faq" className="hover:text-primary">FAQ</Link>
          <Link to="/coming-soon" className="hover:text-primary">Terms</Link>
          <Link to="/coming-soon" className="hover:text-primary">Privacy</Link>
          <a href="mailto:hello@taxappeal.app" className="hover:text-primary">Contact</a>
        </nav>
      </div>
      <p className="mt-6 max-w-3xl type-footer opacity-80">
        TaxAppeal.app is not a law firm and does not provide legal advice or representation.
        Information shown is for data analysis and document preparation purposes only.
        Property tax rules and filing windows vary by jurisdiction. No tax reduction is guaranteed.
        {extraDisclaimer ? ` ${extraDisclaimer}` : ""}
      </p>
      <p className="mt-3 type-footer opacity-80">© {new Date().getFullYear()} TaxAppeal.app. All rights reserved.</p>
    </div>
  </footer>
);
