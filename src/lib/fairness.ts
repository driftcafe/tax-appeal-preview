// Pure helpers for the client-side Fairness Score and overpayment estimate.
// Inputs come from the existing /api/comparables response.
// All numbers are documented as preliminary estimates; the official analysis
// is delivered in the $149 packet.

import type { Cohort, Comparable, Subject } from "./api";

// Effective property-tax rate used for overpayment estimates.
// Cook County effective residential rates cluster around 2.1–2.7%; we use 2.5%.
export const EFFECTIVE_TAX_RATE = 0.025;

// Reference baseline shown next to the user's Fairness Score.
export const NEIGHBORHOOD_BASELINE = 78;

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/**
 * Fairness Score — 0 to 100.
 * 50 = subject is exactly at the comp median.
 * 100 = subject is 50%+ below the median (very fair).
 * 0 = subject is 50%+ above the median (very unfair).
 */
export function computeFairnessScore(subject: Subject, cohort: Cohort): number {
  const median = cohort.median_av_per_sqft || subject.av_per_sqft;
  if (!median) return 50;
  const ratio = (median - subject.av_per_sqft) / median;
  return Math.round(clamp(50 + 100 * ratio, 0, 100));
}

export function estimateAnnualOverpayment(
  subject: Subject,
  cohort: Cohort,
  rate = EFFECTIVE_TAX_RATE,
): number {
  const fairAvPerSqft = cohort.median_av_per_sqft;
  if (!fairAvPerSqft || !subject.sqft) return 0;
  const fairAv = fairAvPerSqft * subject.sqft;
  const overAv = Math.max(0, subject.assessed_value - fairAv);
  return Math.round(overAv * rate);
}

export function countCompsBelow(subject: Subject, comps: Comparable[]): number {
  return comps.filter((c) => c.av_gap_dollars > 0).length;
}

export function scoreBand(score: number): "poor" | "mid" | "good" {
  if (score < 50) return "poor";
  if (score < 75) return "mid";
  return "good";
}

export function scoreBandLabel(score: number): string {
  const b = scoreBand(score);
  if (b === "poor") return "Likely unfair";
  if (b === "mid") return "Borderline";
  return "Looks fair";
}
