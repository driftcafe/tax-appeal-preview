import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const launchCounties = [
  { name: "Cook County", note: "Assessor's Office and Board of Review forms supported.", url: "https://www.cookcountyassessoril.gov/" },
  { name: "DuPage County", note: "Board of Review template supported.", url: "https://propertylookup.dupagecounty.gov/forms/htmlframe.aspx?mode=content/home.htm" },
  { name: "Lake County", note: "Board of Review template supported.", url: "https://tax.lakecountyil.gov/search/commonsearch.aspx?mode=realprop" },
  { name: "Will County", note: "Board of Review template supported.", url: "https://willcountysoa.com/" },
  { name: "Kane County", note: "Board of Review template supported.", url: "https://treasurer.kanecountyil.gov/" },
  { name: "McHenry County", note: "Board of Review template supported.", url: "https://mchenryil.devnetwedge.com/" },
];

const Counties = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SEO
      title="Counties we serve"
      description="Property Tax Appeal AI launches in Cook County and the Illinois collar counties — DuPage, Lake, Will, Kane, and McHenry — in June 2026, with Midwest expansion to follow."
      path="/counties"
    />
    <SiteHeader />
    <main>
      <section className="container mx-auto max-w-3xl px-6 pt-16 pb-6 sm:pt-24">
        <p className="text-sm uppercase tracking-wider text-muted-foreground">Counties</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-primary sm:text-5xl">
          Launching in Illinois — June 2026.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          We're starting with Cook County and the five collar counties. Midwest
          expansion follows after the first appeal cycle. If your county isn't
          listed yet, you can join the waitlist on the home page.
        </p>
      </section>

      <section className="container mx-auto max-w-3xl px-6 py-10">
        <ul className="divide-y divide-border rounded-lg border border-border">
          {launchCounties.map((c) => (
            <li key={c.name} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif text-xl text-primary hover:underline"
              >
                {c.name} →
              </a>
              <span className="text-sm text-muted-foreground">{c.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="container mx-auto max-w-3xl px-6 py-10">
        <h2 className="font-serif text-2xl text-primary sm:text-3xl">What "supported" means</h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          For each launch county, the Data Report uses that county's public
          assessor data, and the editable appeal template maps to that county's
          official complaint form. You review, edit, sign, and file the
          completed template with the appropriate office before the county's
          deadline.
        </p>
      </section>
    </main>
    <SiteFooter />
  </div>
);

export default Counties;