export const SiteFooter = ({ extraDisclaimer }: { extraDisclaimer?: string }) => (
  <footer className="mt-24 border-t border-border/60 bg-background">
    <div className="container mx-auto max-w-5xl px-6 py-10 text-sm text-muted-foreground">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Kankakee Appeals</p>
        <nav className="flex flex-wrap gap-6">
          <a href="#faq" className="hover:text-primary">FAQ</a>
          <a href="mailto:hello@kankakeeappeals.com" className="hover:text-primary">Contact</a>
          <a href="#privacy" className="hover:text-primary">Privacy</a>
          <a href="#terms" className="hover:text-primary">Terms</a>
        </nav>
      </div>
      <p className="mt-6 max-w-3xl text-xs leading-relaxed">
        Kankakee Appeals is not a law firm and does not provide legal advice.
        Representation is limited to the Kankakee County Board of Review for
        residential property assessments.
        {extraDisclaimer ? ` ${extraDisclaimer}` : ""}
      </p>
    </div>
  </footer>
);