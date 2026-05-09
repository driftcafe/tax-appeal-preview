import { useEffect, useRef, useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api, ApiError, type ParcelSearchResult } from "@/lib/api";
import { saveLookup } from "@/lib/lookupCache";

const PIN_RE = /^\d{2}-?\d{2}-?\d{3}-?\d{3}-?\d{4}$/;

export const PropertySearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ParcelSearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searching, setSearching] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const trimmed = query.trim();
  const isPin = PIN_RE.test(trimmed.replace(/\s+/g, ""));

  // Debounced typeahead
  useEffect(() => {
    if (isPin) {
      abortRef.current?.abort();
      setResults([]);
      setOpen(false);
      setSearching(false);
      return;
    }
    if (trimmed.length < 3) {
      abortRef.current?.abort();
      setResults([]);
      setOpen(false);
      setSearching(false);
      return;
    }
    const handle = setTimeout(async () => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setSearching(true);
      try {
        const data = await api.parcelSearch(trimmed, 8, ctrl.signal);
        setResults(data.results);
        setOpen(true);
        setSearching(false);
      } catch (err) {
        if ((err as any)?.name === "AbortError") return;
        if (err instanceof ApiError && err.status === 400) {
          setResults([]);
          setOpen(true);
        } else {
          setResults([]);
          setOpen(false);
        }
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(handle);
  }, [trimmed, isPin]);

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const proceedWithPin = async (pin: string) => {
    setError(null);
    setSubmitting(true);
    try {
      const data = await api.comparables(pin);
      saveLookup(data);
      navigate(`/comparables/${data.lookup_id}`);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 404) setError("We couldn't find that PIN. Double-check and try again.");
        else if (err.status === 422) setError(err.body?.hint ?? "No structural characteristics on file for this PIN.");
        else if (err.status === 400) setError("Please enter a valid PIN.");
        else setError("Couldn't reach our servers — please try again.");
      } else {
        setError("Couldn't reach our servers — please try again.");
      }
      setSubmitting(false);
    }
  };

  const pickResult = (r: ParcelSearchResult) => {
    if (!r.serviceable) return;
    setQuery(r.site_address);
    setOpen(false);
    proceedWithPin(r.pin);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmed) return;
    setError(null);

    if (isPin) {
      proceedWithPin(trimmed.replace(/\s+/g, ""));
      return;
    }

    setSubmitting(true);
    try {
      abortRef.current?.abort();
      const data = await api.parcelSearch(trimmed, 1);
      if (data.count === 0) {
        setError("We couldn't find a match. Try the full street address or your PIN.");
        setSubmitting(false);
        return;
      }
      if (data.count > 1) {
        // Refetch with broader limit to populate dropdown
        setSubmitting(false);
        const broad = await api.parcelSearch(trimmed, 8);
        setResults(broad.results);
        setOpen(true);
        return;
      }
      const only = data.results[0];
      if (!only.serviceable) {
        setError(`We have your property on file but don't yet file appeals in ${only.display_name} County.`);
        setSubmitting(false);
        return;
      }
      setSubmitting(false);
      proceedWithPin(only.pin);
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        setError("We couldn't find a match. Try the full street address or your PIN.");
      } else {
        setError("Couldn't reach our servers — please try again.");
      }
      setSubmitting(false);
    }
  };

  return (
    <div ref={wrapRef} className="relative">
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/70" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder="Property address or PIN — e.g. 619 Roger Ave, Kenilworth or 16-19-213-035-0000"
            aria-label="Property address or PIN"
            autoComplete="off"
            className="h-14 w-full rounded-lg border border-input bg-card pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30 sm:text-lg"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-accent px-7 text-base font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:text-lg"
        >
          {submitting ? "Checking…" : "Check my property"}
          <ArrowRight className="h-5 w-5" />
        </button>
      </form>

      {open && !isPin && trimmed.length >= 3 && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-lg border border-border bg-card shadow-lg sm:w-[calc(100%-12rem)]">
          {searching && results.length === 0 && (
            <div className="px-4 py-3 text-sm text-muted-foreground">Searching…</div>
          )}
          {!searching && results.length === 0 && (
            <div className="px-4 py-3 text-sm text-muted-foreground">No matches found.</div>
          )}
          <ul className="max-h-80 overflow-auto">
            {results.map((r) => {
              const disabled = !r.serviceable;
              const meta = `${r.display_name} County · PIN ${r.pin_formatted}${
                r.assessed_value != null ? ` · AV $${r.assessed_value.toLocaleString()}` : ""
              }`;
              return (
                <li key={r.pin}>
                  <button
                    type="button"
                    onClick={() => pickResult(r)}
                    disabled={disabled}
                    title={disabled ? "We don't yet file appeals in this county." : undefined}
                    className={`flex w-full flex-col items-start gap-0.5 border-b border-border px-4 py-2.5 text-left last:border-b-0 ${
                      disabled
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-secondary/60"
                    }`}
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-primary">{r.site_address}</span>
                      {disabled && (
                        <span className="rounded-full border border-border bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          Not yet serviced
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{meta}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
    </div>
  );
};