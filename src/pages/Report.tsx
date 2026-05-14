import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ReportView } from "@/components/ReportView";
import { api, ApiError } from "@/lib/api";
import type { ReportResponse } from "@/lib/api";

const Report = () => {
  const { token = "" } = useParams<{ token: string }>();
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api.reportByToken(token)
      .then((r) => { if (!cancelled) setReport(r); })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setError("Sorry, we couldn't find that report.");
        } else {
          setError("Something went wrong. Please try again.");
        }
      });
    return () => { cancelled = true; };
  }, [token]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SEO title="Your appeal packet" description="Download your appeal packet and filing instructions." path={`/r/${token}`} noindex />
      <SiteHeader />
      <main className="flex-1 container mx-auto max-w-4xl px-6 pt-12 pb-20">
        {error && <h1 className="text-center text-2xl font-semibold text-primary">{error}</h1>}
        {!error && !report && <p className="text-center text-muted-foreground">Loading your report…</p>}
        {report && <ReportView report={report} />}
      </main>
      <SiteFooter />
    </div>
  );
};

export default Report;
