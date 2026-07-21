
export const processingCategoryData: ProcessingCategory[] = [
  {
    id: "1",
    name: "Identity and Contact Data",
    description:
      "Core personal data used to create and maintain verified customer accounts.",
    activities: ["Account Registration Validation", "KYC Document Screening", "Profile Updates"],
  },
  {
    id: "2",
    name: "Consent and Preference Data",
    description:
      "Stores consent artifacts, notice acceptance, and communication channel preferences.",
    activities: ["Consent Capture Logging", "Marketing Preference Sync", "Consent Revocation Processing"],
  },
  {
    id: "3",
    name: "Transactional and Financial Data",
    description:
      "Processes order, payment, and refund information needed for service delivery.",
    activities: ["Payment Authorization", "Invoice Generation", "Refund Reconciliation"],
  },
  {
    id: "4",
    name: "Security and Access Logs",
    description:
      "Captures authentication events and access metadata to prevent fraud and abuse.",
    activities: ["Suspicious Login Detection", "Session Token Monitoring", "Risk Score Evaluation"],
  },
  {
    id: "5",
    name: "Analytics and Product Insights",
    description:
      "Aggregated behavioral telemetry used for performance monitoring and feature adoption.",
    activities: ["Service Usage Analytics", "Campaign Attribution", "A/B Experiment Reporting"],
  },
  {
    id: "6",
    name: "Compliance and Data Rights",
    description:
      "Supports legal obligations such as audits, retention controls, and user rights requests.",
    activities: ["DSAR Handling", "Retention Window Enforcement", "Regulatory Audit Export"],
  },
];
