import { motion } from "framer-motion";
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
  <div className="flex min-h-screen flex-col bg-background text-foreground">
    <SEO
      title="Counties We Serve — TaxAppeal.app"
      description="Property Tax Appeal AI launches in Cook County and the Illinois collar counties — DuPage, Lake, Will, Kane, and McHenry — in June 2026, with Midwest expansion to follow."
      path="/counties"
    />
    <SiteHeader />
    <main className="flex-1">
      <motion.section 
        className="container mx-auto max-w-7xl px-8 pt-16 pb-10 sm:pt-24 md:px-12 lg:px-24"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p className="type-eyebrow-lg">Coverage</p>
        <h2 className="mt-4 type-h2 text-primary">
          Launching in Illinois — June 2026.
        </h2>
        <p className="mt-6 type-body-lg text-slate max-w-5xl">
          We're starting with Cook County and the five collar counties. Midwest
          expansion follows after the first appeal cycle. If your county isn't
          listed yet, you can join the waitlist on the home page.
        </p>
      </motion.section>

      <motion.section 
        className="container mx-auto max-w-7xl px-8 py-10 md:px-12 lg:px-24"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="overflow-hidden rounded-[30px] border border-border/60 bg-white shadow-[0_0_20px_0_rgba(29,29,31,0.09)]">
          <ul className="divide-y divide-border/60">
            {launchCounties.map((c) => (
              <li key={c.name} className="flex flex-col gap-2 px-8 py-6 transition-colors hover:bg-slate/5 sm:flex-row sm:items-center sm:justify-between">
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-body-lg-emph text-electric hover:underline"
                >
                  {c.name} →
                </a>
                <span className="type-body-sm text-slate">{c.note}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.section>

      <motion.section 
        className="container mx-auto max-w-7xl px-8 py-16 md:px-12 lg:px-24"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-3xl">
          <h3 className="type-h3 text-primary">What "supported" means</h3>
          <p className="mt-4 type-body-lg text-slate leading-relaxed">
            For each launch county, the Data Report uses that county's public
            assessor data, and the editable appeal template maps to that county's
            official complaint form. You review, edit, sign, and file the
            completed template with the appropriate office before the county's
            deadline.
          </p>
        </div>
      </motion.section>
    </main>
    <SiteFooter />
  </div>
);

export default Counties;