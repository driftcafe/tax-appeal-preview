import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const SiteHeader = ({ minimal = false }: { minimal?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { label: "How it works", href: "/how-it-works" },
    { label: "Pricing", href: "/pricing" },
    { label: "Coverage", href: "/counties" },
    { label: "FAQ", href: "/faq" },
  ];

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-border/60 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-8 md:px-12 lg:px-24">
        <Link to="/" onClick={closeMenu} className="text-xl font-bold tracking-tight text-primary transition-opacity hover:opacity-80">
          TaxAppeal<span className="text-success">.app</span>
        </Link>

        {!minimal && (
          <>
            {/* Desktop Nav */}
            <nav className="hidden items-center gap-8 text-base font-medium text-slate sm:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
              <Button
                asChild
                intent="primary"
                size="small"
                variant="outline"
                className="px-4 type-utility"
              >
                <Link to="/?focus=true">Check my property</Link>
              </Button>
            </nav>

            {/* Mobile Toggle */}
            <button
              onClick={toggleMenu}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-slate transition-colors hover:bg-secondary sm:hidden"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && !minimal && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-b border-border bg-white sm:hidden"
          >
            <nav className="flex flex-col space-y-1 px-8 pb-8 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={closeMenu}
                  className="rounded-lg py-4 text-lg font-medium text-slate transition-colors hover:bg-secondary hover:text-primary px-2"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4">
                <Button
                  asChild
                  intent="primary"
                  size="large"
                  variant="filled"
                  className="w-full"
                  onClick={closeMenu}
                >
                  <Link to="/?focus=true">Check my property</Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
