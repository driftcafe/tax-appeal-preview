import { useState, useEffect, useRef } from "react";
import { Search, ArrowRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { api, ApiError, ParcelSearchResult } from "@/lib/api";
import { saveLookup } from "@/lib/lookupCache";
import { Button } from "./ui/button";
import { WaitlistModal } from "./WaitlistModal";

const PIN_RE = /^(\d{2}-?){4}\d{4}$/;

interface PropertySearchProps {
  variant?: "hero" | "default";
}

export const PropertySearch = ({ variant = "default" }: PropertySearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ParcelSearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searching, setSearching] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const [isComplex, setIsComplex] = useState(false);
  const [lastPin, setLastPin] = useState<string | null>(null);
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
      if (trimmed.length === 0) {
        setError(null);
        setIsComplex(false);
      }
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
    setIsComplex(false);
    setLastPin(pin);
    setSubmitting(true);
    try {
      const data = await api.comparables(pin);
      saveLookup(data);
      navigate(`/comparables/${data.lookup_id}`);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 404) setError("We couldn't find that property. Double-check the address and try again.");
        else if (err.status === 422) {
          setError("Commercial, multifamily, or unusually complex properties require specialized legal representation.");
          setIsComplex(true);
        }
        else if (err.status === 400) setError("Please enter a valid address.");
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
        setError("We couldn't find a match. Try the full street address.");
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
        setError("We couldn't find a match. Try the full street address.");
      } else {
        setError("Couldn't reach our servers — please try again.");
      }
      setSubmitting(false);
    }
  };

  const inputRef = useRef<HTMLInputElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("focus") === "true" && inputRef.current) {
      inputRef.current.focus();
      // Scroll to the input if it's not in view
      inputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [location]);

  const isHero = variant === "hero";

  return (
    <div ref={wrapRef} className="relative">
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            id="property-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder="Enter your property address — e.g. 233 S Wacker Dr, Chicago, IL"
            aria-label="Property address"
            autoComplete="off"
            className={`h-14 w-full rounded-lg border pl-6 pr-4 text-base placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 sm:text-lg ${isHero
                ? "border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/20 backdrop-blur-sm"
                : "border-input bg-card text-foreground focus:border-primary focus:ring-ring/30"
              }`}
          />
        </div>
        <Button
          type="submit"
          disabled={submitting}
          intent="primary"
          size="large"
          variant="filled"
          trailingIcon={ArrowRight}
          className="px-7"
        >
          {submitting ? "Checking\u2026" : "Check my property"}
        </Button>
      </form>

      {open && !isPin && trimmed.length >= 3 && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card shadow-[0_0_20px_0_rgba(29,29,31,0.09)] sm:w-[calc(100%-12rem)]">
          {searching && results.length === 0 && (
            <div className="px-4 py-3 text-sm text-muted-foreground">Searching…</div>
          )}
          {!searching && results.length === 0 && (
            <div className="px-4 py-3 text-sm text-muted-foreground">No matches found.</div>
          )}
          <ul className="max-h-80 overflow-auto">
            {results.map((r) => {
              const disabled = !r.serviceable;
              const meta = `${r.display_name} County · PIN ${r.pin_formatted}${r.assessed_value != null ? ` · AV $${r.assessed_value.toLocaleString()}` : ""
                }`;
              return (
                <li key={r.pin}>
                  <button
                    type="button"
                    onClick={() => pickResult(r)}
                    disabled={disabled}
                    title={disabled ? "We don't yet file appeals in this county." : undefined}
                    className={`flex w-full flex-col items-start gap-0.5 border-b border-border px-4 py-2.5 text-left last:border-b-0 ${disabled
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

      {error && (
        <div className="mt-3 text-sm text-destructive flex flex-wrap items-center gap-1">
          <span>{error}</span>
          {isComplex && (
            <button
              type="button"
              onClick={() => setShowReferral(true)}
              className="font-bold text-white underline decoration-white/30 underline-offset-2 hover:decoration-white/100 transition-colors ml-0.5"
            >
              Connect me
            </button>
          )}
        </div>
      )}

      <WaitlistModal
        open={showReferral}
        onOpenChange={setShowReferral}
        tier="referral"
        pin={lastPin || undefined}
      />
    </div>
  );
};