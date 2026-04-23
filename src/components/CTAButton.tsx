import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type Props = {
  to?: string;
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  onClick?: () => void;
};

const base =
  "inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const variants = {
  primary: "bg-accent text-accent-foreground hover:bg-accent-hover shadow-sm",
  secondary:
    "border border-border bg-background text-primary hover:bg-secondary",
};

export const CTAButton = ({
  to,
  href,
  children,
  variant = "primary",
  className,
  onClick,
}: Props) => {
  const cls = cn(base, variants[variant], className);
  if (to) return <Link to={to} className={cls}>{children}</Link>;
  if (href) return <a href={href} className={cls} onClick={onClick}>{children}</a>;
  return <button onClick={onClick} className={cls}>{children}</button>;
};