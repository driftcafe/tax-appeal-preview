import { Link } from "react-router-dom";

export const SiteHeader = ({ minimal = false }: { minimal?: boolean }) => (
  <header className="border-b border-border/60 bg-background">
    <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
      <Link to="/" className="font-serif text-lg font-semibold text-primary">
        Property Tax Appeal<span className="text-accent"> AI</span>
      </Link>
      {!minimal && (
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground sm:flex">
          <Link to="/how-it-works" className="hover:text-primary">How it works</Link>
          <Link to="/pricing" className="hover:text-primary">Pricing</Link>
          <Link to="/methodology" className="hover:text-primary">Methodology</Link>
          <Link to="/counties" className="hover:text-primary">Counties</Link>
          <Link to="/faq" className="hover:text-primary">FAQ</Link>
          <Link to="/signin" className="text-primary hover:underline">Sign in</Link>
        </nav>
      )}
    </div>
  </header>
);