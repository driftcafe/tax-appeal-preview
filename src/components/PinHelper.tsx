import { useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";

const countyLinks = [
  { name: "Cook", url: "https://www.cookcountyassessor.com/pin" },
  { name: "DuPage", url: "https://www.dupagecounty.gov/treasurer/property_tax_lookup/" },
  { name: "Lake", url: "https://assessor.lakecountyil.gov/" },
  { name: "Will", url: "https://willcountysoa.com/PropertySearch" },
  { name: "Kane", url: "https://www.kaneassessor.org/PropertySearch.aspx" },
  { name: "McHenry", url: "https://www.mchenrycountyil.gov/county-government/departments-a-i/assessments" },
];

export const PinHelper = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-4 text-sm">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 text-primary hover:underline"
        aria-expanded={open}
      >
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
        Don't know your PIN?
      </button>

      {open && (
        <div className="mt-3 rounded-md border border-border bg-card p-4">
          <p className="text-muted-foreground">
            Your Property Index Number (PIN) is on your most recent property tax
            bill or assessment notice. You can also look it up on your county's
            official site:
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {countyLinks.map((c) => (
              <a
                key={c.name}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-sm text-primary hover:border-primary"
              >
                {c.name} County
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Links open the official county assessor or treasurer site in a new tab.
          </p>
        </div>
      )}
    </div>
  );
};
