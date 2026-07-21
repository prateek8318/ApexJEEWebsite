
export const processingPurposesData: ProcessingPurpose[] = [
  {
    id: "1",
    name: "Identity Verification",
    description: "Validates customer identity for account activation and fraud prevention.",
    activities: ["PAN Validation", "OTP Confirmation", "Document Cross-Check"],
    expiryPeriod: "24 Months",
  },
  {
    id: "2",
    name: "Service Delivery Operations",
    description: "Uses profile and transaction data to deliver core platform services.",
    activities: ["Order Processing", "Notification Dispatch", "Support Follow-Up"],
    expiryPeriod: "18 Months",
  },
  {
    id: "3",
    name: "Consent Ledger Maintenance",
    description: "Maintains verifiable audit trail of granted and withdrawn consents.",
    activities: ["Consent Versioning", "Timestamp Logging", "Revocation Recording"],
    expiryPeriod: "36 Months",
  },
  {
    id: "4",
    name: "Security Monitoring",
    description: "Detects suspicious access patterns and protects user accounts.",
    activities: ["Anomaly Detection", "Session Monitoring", "Risk Alerting"],
    expiryPeriod: "12 Months",
  },
  {
    id: "5",
    name: "Engagement and Campaign Management",
    description: "Runs targeted communication campaigns for opted-in users only.",
    activities: ["Audience Segmentation", "Campaign Orchestration", "Opt-Out Sync"],
    expiryPeriod: "6 Months",
  },
  {
    id: "6",
    name: "Regulatory Compliance Reporting",
    description: "Generates mandatory reports and supports audit queries under DPDP controls.",
    activities: ["Audit Trail Export", "Policy Mapping", "Data Request Reconciliation"],
    expiryPeriod: "60 Months",
  },
];