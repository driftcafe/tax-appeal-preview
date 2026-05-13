import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-30 active:scale-[0.98]",
  {
    variants: {
      intent: {
        primary: "",
        secondary: "",
      },
      variant: {
        filled: "",
        outline: "border",
        ghost: "bg-transparent",
      },
      size: {
        large: "h-14 px-8 type-body-lg",
        small: "h-11 px-6 type-body-sm",
      },
    },
    compoundVariants: [
      // Primary Filled
      {
        intent: "primary",
        variant: "filled",
        className: "bg-electric !text-white hover:bg-electric-hover",
      },
      // Primary Outline
      {
        intent: "primary",
        variant: "outline",
        className: "border-electric/30 !text-electric hover:bg-electric/5",
      },
      // Primary Ghost
      {
        intent: "primary",
        variant: "ghost",
        className: "!text-electric hover:bg-electric/10",
      },
      // Secondary Filled
      {
        intent: "secondary",
        variant: "filled",
        className: "bg-primary !text-white hover:bg-primary/90",
      },
      // Secondary Outline
      {
        intent: "secondary",
        variant: "outline",
        className: "border-primary/20 !text-primary hover:bg-primary/5",
      },
      // Secondary Ghost
      {
        intent: "secondary",
        variant: "ghost",
        className: "!text-primary hover:bg-primary/10",
      },
    ],
    defaultVariants: {
      intent: "primary",
      variant: "filled",
      size: "small",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  leadingIcon?: LucideIcon;
  trailingIcon?: LucideIcon;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, intent, variant, size, asChild = false, leadingIcon: LeadingIcon, trailingIcon: TrailingIcon, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const iconSize = size === "large" ? 20 : 18;

    if (asChild) {
      const child = React.Children.only(children) as React.ReactElement;
      return (
        <Comp
          className={cn(buttonVariants({ intent, variant, size, className }))}
          ref={ref}
          {...props}
        >
          {React.cloneElement(child, {
            children: [
              LeadingIcon && <LeadingIcon key="leading" size={iconSize} className="shrink-0" />,
              child.props.children,
              TrailingIcon && <TrailingIcon key="trailing" size={iconSize} className="shrink-0" />,
            ].filter(Boolean),
          })}
        </Comp>
      );
    }

    return (
      <Comp
        className={cn(buttonVariants({ intent, variant, size, className }))}
        ref={ref}
        {...props}
      >
        {LeadingIcon && <LeadingIcon size={iconSize} className="shrink-0" />}
        {children}
        {TrailingIcon && <TrailingIcon size={iconSize} className="shrink-0" />}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
