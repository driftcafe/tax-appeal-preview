import { Link } from "react-router-dom";

export const SiteFooter = ({ extraDisclaimer }: { extraDisclaimer?: string }) => (
  <footer className="mt-24 border-t border-border/60 bg-background">
    <div className="container mx-auto max-w-6xl px-6 py-12 text-sm text-muted-foreground">
      <div className="grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-serif text-lg font-semibold text-primary">
            Property Tax Appeal<span className="text-accent"> AI</span>
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed">
            A data analysis and document preparation service for residential
            property tax assessments. We are not a law firm.
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
            <li><a href="mailto:hello@propertytaxappealai.com" className="hover:text-primary">Contact</a></li>
            <li><Link to="/coming-soon" className="hover:text-primary">Privacy</Link></li>
            <li><Link to="/coming-soon" className="hover:text-primary">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="mt-10 max-w-4xl space-y-3 text-xs leading-relaxed">
        <p>
          Property Tax Appeal AI LLC provides data analysis and document
          preparation services only. We do not provide legal advice, legal
          representation, or tax consulting. Use of this service does not create
          an attorney-client relationship. Homeowners are solely responsible for
          reviewing, editing, and filing all appeal documents.
        </p>
        <p>
          No tax reduction is guaranteed. Past results are not indicative of
          future outcomes. All data is derived from publicly available
          government records.
          {extraDisclaimer ? ` ${extraDisclaimer}` : ""}
        </p>
        <p>© {new Date().getFullYear()} Property Tax Appeal AI LLC. All rights reserved.</p>
      </div>
    </div>
  </footer>
);