export const sampleOpportunity = {
  token: "demo-token-abc123",
  ownerFirstName: "Patricia",
  siteAddress: "1832 Oak Grove Dr, Bourbonnais, IL 60914",
  pin: "17-15-04-203-018",
  township: "Bourbonnais",
  assessmentYear: 2025,
  currentAssessedValue: 52400,
  fairAssessedValueEstimate: 44500,
  assessedValueGap: 7900,
  estimatedYearOneTaxSavings: 553,
  confidence: "Moderate" as "Strong" | "Moderate" | "Preliminary",
  comparables: [
    { siteAddress: "1820 Oak Grove Dr, Bourbonnais, IL 60914", assessedValue: 43900, distanceMiles: 0.03, lotSizeAcres: 0.22 },
    { siteAddress: "1856 Oak Grove Dr, Bourbonnais, IL 60914", assessedValue: 44200, distanceMiles: 0.08, lotSizeAcres: 0.23 },
    { siteAddress: "1844 Maple Lane, Bourbonnais, IL 60914", assessedValue: 45100, distanceMiles: 0.30, lotSizeAcres: 0.21 },
  ],
};

export type Opportunity = typeof sampleOpportunity;