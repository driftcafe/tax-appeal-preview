import { Link } from "react-router-dom";

export const SiteHeader = ({ minimal = false }: { minimal?: boolean }) => (
  <header className="border-b border-border/60 bg-background">
    <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
      <Link to="/" className="font-serif text-lg font-semibold text-primary">
        Kankakee Appeals
      </Link>
      {!minimal && (
        <nav className="hidden gap-8 text-sm text-muted-foreground sm:flex">
          <Link to="/lookup" className="hover:text-primary">Look up my property</Link>
          <a href="mailto:hello@kankakeeappeals.com" className="hover:text-primary">Contact</a>
        </nav>
      )}
    </div>
  </header>
);