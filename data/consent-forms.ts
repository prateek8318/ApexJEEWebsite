import type { ConsentFormType, ConsentPurposeType } from "@schemas/consentForm";
export type { ConsentFormType, ConsentPurposeType };




export const initialConsentForms: ConsentFormType[] = [
  {
    id: "1",
    uuid: "form-001",
    title: "General Privacy Notice",
    category: "Privacy",
    version: "v1.2",
    status: "ACTIVE",
    createdDate: "2026-01-15",
  },
  {
    id: "2",
    uuid: "form-002",
    title: "Marketing Communication Consent",
    category: "Marketing",
    version: "v2.0",
    status: "ACTIVE",
    createdDate: "2026-02-02",
  },
  {
    id: "3",
    uuid: "form-003",
    title: "KYC Data Processing Consent",
    category: "Compliance",
    version: "v1.0",
    status: "ACTIVE",
    createdDate: "2026-02-21",
  },
  {
    id: "4",
    uuid: "form-004",
    title: "Legal Hold Acknowledgement",
    category: "Legal",
    version: "v1.1",
    status: "ACTIVE",
    createdDate: "2026-03-01",
  },
  {
    id: "5",
    uuid: "form-005",
    title: "Preference Center Consent",
    category: "Privacy",
    version: "v3.0",
    status: "ACTIVE",
    createdDate: "2026-03-10",
  },
];

export const editFormInitialPurposes: ConsentPurposeType[] = [
  {
    id: "1",
    purpose: "Account Opening",
    categories: ["Identity Data", "Contact Data"],
  },
  {
    id: "2",
    purpose: "Marketing Communication",
    categories: ["Preference Data", "Behavioral Data"],
  },
  {
    id: "3",
    purpose: "Compliance Audit",
    categories: ["Regulatory Data", "Transactional Data"],
  },
];


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
  headerText: "DPDP Consent Preferences",
  bodyText:
    "Select the purposes you allow us to process your personal data for. Your choices remain auditable.",
  noticeLink: "https://consentgrid.in/privacy/dpdp-notice",
  footerText: "Need help? Reach out to dpo@consentgrid.in.",
  brandLogo: [],
  banner: [],
  ctaColor: "#2563eb",
  consentTime: "12 months",
};
