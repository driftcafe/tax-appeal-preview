import { Link } from "react-router-dom";

export const SiteHeader = ({ minimal = false }: { minimal?: boolean }) => (
  <header className="border-b border-border/60 bg-background">
    <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
      <Link to="/" className="text-lg font-bold tracking-tight text-primary">
        TaxAppeal<span className="text-accent">.app</span>
      </Link>
      {!minimal && (
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground sm:flex">
          <Link to="/how-it-works" className="hover:text-primary">How it works</Link>
          <Link to="/pricing" className="hover:text-primary">Pricing</Link>
          <Link to="/counties" className="hover:text-primary">Coverage</Link>
          <Link to="/faq" className="hover:text-primary">FAQ</Link>
          <Link
            to="/"
            className="rounded-md bg-accent px-3.5 py-2 font-medium text-accent-foreground hover:bg-accent-hover"
          >
            Check my property
          </Link>
        </nav>
      )}
    </div>
  </header>
);
