import { Link } from "react-router-dom";

export const SiteFooter = ({ extraDisclaimer }: { extraDisclaimer?: string }) => (
  <footer className="mt-24 border-t border-border/60 bg-background">
    <div className="container mx-auto max-w-6xl px-6 py-12 text-sm text-muted-foreground">
      <div className="grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-serif text-lg font-semibold text-primary">
            TaxAppeal<span className="text-accent">.</span>AI
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed">
            AI-powered property tax appeals for Cook County and the Illinois collar counties.
          </p>
        </div>
        <div>
          <p className="font-medium text-primary">Product</p>
          <ul className="mt-3 space-y-2">
            <li><Link to="/how-it-works" className="hover:text-primary">How it works</Link></li>
            <li><Link to="/pricing" className="hover:text-primary">Pricing</Link></li>
            <li><Link to="/methodology" className="hover:text-primary">Methodology</Link></li>
            <li><Link to="/counties" className="hover:text-primary">Counties</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-medium text-primary">Company</p>
          <ul className="mt-3 space-y-2">
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/faq" className="hover:text-primary">FAQ</Link></li>
            <li><a href="mailto:hello@taxappeal.ai" className="hover:text-primary">Contact</a></li>
            <li><Link to="/coming-soon" className="hover:text-primary">Privacy</Link></li>
            <li><Link to="/coming-soon" className="hover:text-primary">Terms</Link></li>
          </ul>
        </div>
      </div>
      <p className="mt-10 max-w-4xl text-xs leading-relaxed">
        © {new Date().getFullYear()} TaxAppeal AI. We are not a law firm and do not
        provide legal advice. We provide appeal preparation and filing services for
        residential property tax assessments in participating Illinois counties.
        PTAB-stage representation is provided through our partner attorneys.
        {extraDisclaimer ? ` ${extraDisclaimer}` : ""}
      </p>
    </div>
  </footer>
);