import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Check } from "lucide-react";

const DesignSystem = () => {
  const intents = ["primary", "secondary"] as const;
  const variants = ["filled", "outline", "ghost"] as const;
  const sizes = ["large", "small"] as const;

  return (
    <div className="min-h-screen bg-[#F7F9FB] p-12">
      <div className="mx-auto max-w-6xl space-y-24">
        <header>
          <h1 className="type-h1 text-primary">Design System</h1>
          <p className="mt-4 type-body-lg text-slate">TaxAppeal.app Production Design Tokens</p>
        </header>

        {/* TYPOGRAPHY */}
        <section className="space-y-8">
          <h2 className="type-eyebrow-lg border-b border-border pb-4">Typography Scale (Reduced by 1 step)</h2>
          <div className="space-y-12">
            {[
              { label: "type-h1", class: "type-h1 bg-navy p-6 rounded-xl", details: "Inter Bold / 44px Mobile · 58px Desktop / White" },
              { label: "type-h2", class: "type-h2", details: "Inter Bold / 32px Mobile · 42px Desktop / Primary" },
              { label: "type-h3", class: "type-h3", details: "Inter Bold / 26px Mobile · 32px Desktop / Primary" },
              { label: "type-h4", class: "type-h4", details: "Inter Bold / 20px Mobile · 24px Desktop / Primary" },
              { label: "eyebrow-lg", class: "type-eyebrow-lg", details: "Inter Bold / 16px Mobile · 18px Desktop / Slate" },
              { label: "eyebrow-sm", class: "type-eyebrow-sm", details: "Inter Bold / 14px Mobile · 16px Desktop / Slate" },
              { label: "body-lg-emph", class: "type-body-lg-emph", details: "Inter Bold / 16px Mobile · 18px Desktop / Primary" },
              { label: "body-lg", class: "type-body-lg", details: "Inter Medium / 16px Mobile · 18px Desktop / Slate" },
              { label: "body-sm", class: "type-body-sm", details: "Inter Medium / 14px Mobile · 16px Desktop / Primary" },
              { label: "utility", class: "type-utility", details: "Inter Medium / 12px Mobile · 14px Desktop / Slate" },
              { label: "footer", class: "type-footer", details: "Inter Normal / 10px Mobile · 12px Desktop / Slate 70%" },
            ].map((t) => (
              <div key={t.label} className="grid grid-cols-[200px_1fr] items-start gap-8">
                <div>
                  <span className="type-utility text-slate uppercase font-bold block">{t.label}</span>
                  <span className="type-utility text-slate/60 block mt-1">{t.details}</span>
                </div>
                <div className={t.class}>The quick brown fox jumps over the lazy dog</div>
              </div>
            ))}
          </div>
        </section>

        {/* BUTTON MATRIX */}
        <section className="space-y-12">
          <h2 className="type-eyebrow-lg border-b border-border pb-4">Button Matrix</h2>

          {intents.map((intent) => (
            <div key={intent} className="space-y-8">
              <h3 className="type-h3 capitalize">{intent} Intent</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-left type-utility text-slate uppercase">
                      <th className="pb-6 pr-8 font-bold">Variant</th>
                      <th className="pb-6 pr-8 font-bold">Large (56px)</th>
                      <th className="pb-6 pr-8 font-bold">Small (44px)</th>
                      <th className="pb-6 pr-8 font-bold">Large Disabled</th>
                      <th className="pb-6 pr-8 font-bold">Small Disabled</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {variants.map((variant) => (
                      <tr key={variant} className="group">
                        <td className="py-8 pr-8 type-body-sm font-bold uppercase text-slate">{variant}</td>
                        {sizes.map((size) => (
                          <td key={size} className="py-8 pr-8">
                            <Button
                              intent={intent}
                              variant={variant}
                              size={size}
                              trailingIcon={size === "large" ? ArrowRight : undefined}
                              leadingIcon={size === "small" ? Zap : undefined}
                            >
                              Action
                            </Button>
                          </td>
                        ))}
                        {sizes.map((size) => (
                          <td key={`${size}-disabled`} className="py-8 pr-8">
                            <Button
                              disabled
                              intent={intent}
                              variant={variant}
                              size={size}
                            >
                              Disabled
                            </Button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </section>

        {/* INTERACTIVE STATES */}
        <section className="space-y-8">
          <h2 className="type-eyebrow-lg border-b border-border pb-4">Special States</h2>
          <div className="flex flex-wrap gap-8">
            <div className="space-y-4">
              <p className="type-utility uppercase text-slate">Loading (Filled)</p>
              <Button intent="primary" size="large" variant="filled">
                <span className="animate-pulse">Checking PIN...</span>
              </Button>
            </div>
            <div className="space-y-4">
              <p className="type-utility uppercase text-slate">Loading (Outline)</p>
              <Button intent="primary" size="large" variant="outline">
                <span className="animate-pulse">Uploading...</span>
              </Button>
            </div>
          </div>
        </section>

        {/* CARDS */}
        <section className="space-y-8">
          <h2 className="type-eyebrow-lg border-b border-border pb-4">Card Architecture</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-[30px] border border-border/60 bg-white p-10 shadow-[0_0_20px_0_rgba(29,29,31,0.09)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-electric/10 text-electric mb-8">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="type-h3">White Card Token</h3>
              <p className="mt-4 type-body-lg text-slate">
                Corner Radius: 30px<br />
                Shadow: 0 0 20px 0 rgba(29,29,31,0.09)
              </p>
              <Button intent="primary" size="large" className="mt-10 w-full" trailingIcon={ArrowRight}>
                Action Button
              </Button>
            </div>

            <div className="rounded-[30px] bg-navy p-10 text-white shadow-2xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-white/10 text-success mb-8">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="type-h3">Dark Navy Token</h3>
              <p className="mt-4 type-body-lg text-navy-muted">
                Corner Radius: 30px<br />
                Background: Navy (#0A1A2F)
              </p>
              <Button intent="primary" variant="outline" size="large" className="mt-10 w-full !text-white !border-white/20 hover:bg-white/5" trailingIcon={ArrowRight}>
                Secondary Action
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DesignSystem;
