export const previewPurposes = [
  {
    id: "1",
    purpose: "Account Opening",
    categories: ["Identity Data", "Contact Data", "KYC Documents"],
  },
  {
    id: "2",
    purpose: "Marketing",
    categories: ["Communication Preferences"],
  },
];

export const dummyConsentData = {
  language: "English (India)",
  headerText: "Customer Data Processing Consent",
  bodyText:
    "Review and manage your consent choices for onboarding, service delivery, and communications.",
  noticeLink: "https://consentgrid.in/privacy/customer-onboarding",
  footerText: "You can withdraw or update your consent anytime from Preference Center.",
  consentTime: "12 months",
  purposes: [
    { purpose: "Account Opening", dataCategories: "Name, Email Id, Mobile No." },
    { purpose: "Marketing", dataCategories: "Mobile Number" },
  ],
  brandLogo: [],
  banner: [],
  ctaColor: "#2563eb",
};
