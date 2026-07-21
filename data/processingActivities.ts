
export const processingActivityData: ProcessingActivity[] = [
  {
    processingActivities: "Account Registration Validation",
    description:
      "Verifies mobile OTP and email token before creating a new account profile.",
    processingCategories: ["Identity Verification", "User Onboarding"],
  },
  {
    processingActivities: "Consent Capture Logging",
    description:
      "Records notice version, timestamp, IP hash, and channel when user gives consent.",
    processingCategories: ["Consent Management", "Audit Compliance"],
  },
  {
    processingActivities: "KYC Document Screening",
    description:
      "Processes PAN and address proof metadata to complete regulatory onboarding checks.",
    processingCategories: ["Regulatory Compliance", "Identity Verification"],
  },
  {
    processingActivities: "Service Usage Analytics",
    description:
      "Aggregates clickstream and feature usage events to improve product performance.",
    processingCategories: ["Analytics", "Product Improvement"],
  },
  {
    processingActivities: "Marketing Preference Sync",
    description:
      "Updates opt-in and opt-out preferences across email, SMS, and WhatsApp channels.",
    processingCategories: ["Marketing Communications", "Preference Center"],
  },
  {
    processingActivities: "Data Subject Access Request Handling",
    description:
      "Compiles user profile, consent, and transaction records for access request fulfillment.",
    processingCategories: ["Data Principal Rights", "Compliance Operations"],
  },
  {
    processingActivities: "Retention Window Enforcement",
    description:
      "Flags records beyond retention policy and triggers archival or deletion workflow.",
    processingCategories: ["Data Retention", "Security Governance"],
  },
];