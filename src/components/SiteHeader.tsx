import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const SiteHeader = ({ minimal = false }: { minimal?: boolean }) => (
  <header className="border-b border-border/60 bg-background">
    <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-8 md:px-12 lg:px-24">
      <Link to="/" className="text-xl font-bold tracking-tight text-primary">
        TaxAppeal<span className="text-success">.app</span>
      </Link>
      {!minimal && (
        <nav className="hidden items-center gap-8 text-base font-medium text-slate sm:flex">
          <Link to="/how-it-works" className="hover:text-primary transition-colors">How it works</Link>
          <Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
          <Link to="/counties" className="hover:text-primary transition-colors">Coverage</Link>
          <Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link>
          <Button
            asChild
            intent="primary"
            size="small"
            variant="outline"
            className="px-4 type-utility"
          >
            <Link to="/">Check my property</Link>
          </Button>
        </nav>
      )}
    </div>
  </header>
);
