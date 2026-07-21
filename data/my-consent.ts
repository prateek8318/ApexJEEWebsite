import { CheckCircle, Clock, XCircle, ClipboardList } from "lucide-react";

export type PiiTag = {
  label: string;
  required?: boolean;
};

export type ConsentPreference = {
  id: string;
  title: string;
  description: string;
  pii: PiiTag[];
};

export const consentPreferences: ConsentPreference[] = [
  {
    id: "pref-1",
    title: "Employee Onboarding & Verification",
    description:
      "We collect your personal information during the onboarding process to verify your identity, validate employment eligibility, and complete necessary compliance checks.",
    pii: [
      { label: "Email Id", required: true },
      { label: "Phone Number" },
      { label: "Name" },
    ],
  },
  {
    id: "pref-2",
    title: "Marketing Communications",
    description:
      "We use your contact details to send you promotional offers, product updates, and newsletters relevant to our services. You may opt out at any time.",
    pii: [
      { label: "Email Id", required: true },
      { label: "Phone Number" },
      { label: "Name" },
    ],
  },
  {
    id: "pref-3",
    title: "Analytics & Usage Tracking",
    description:
      "We collect usage data and behavioural analytics to improve our platform experience, personalise content, and measure the effectiveness of our features.",
    pii: [
      { label: "Email Id", required: true },
      { label: "Phone Number" },
      { label: "Name" },
    ],
  },
];

export const myConsentRecords: UserConsentType[] = [
  {
    uuid: "1",
    consentId: "#123455",
    purpose: "Marketing Communications",
    status: "GRANTED",
    grantedDate: "20/02/2025",
    expires: "20/02/2026",
  },
  {
    uuid: "2",
    consentId: "#123456",
    purpose: "Marketing Communications",
    status: "GRANTED",
    grantedDate: "20/02/2025",
    expires: "20/02/2026",
  },
  {
    uuid: "3",
    consentId: "#123457",
    purpose: "Analytics and Usage Tracking",
    status: "GRANTED",
    grantedDate: "20/02/2025",
    expires: "20/02/2026",
  },
  {
    uuid: "4",
    consentId: "#123458",
    purpose: "Personalized Advertising",
    status: "GRANTED",
    grantedDate: "20/02/2025",
    expires: "20/02/2026",
  },
  {
    uuid: "5",
    consentId: "#123459",
    purpose: "Third-Party Data Sharing",
    status: "DENIED",
    grantedDate: "15/01/2025",
    expires: "15/01/2026",
  },
  {
    uuid: "6",
    consentId: "#123460",
    purpose: "Location Data Collection",
    status: "DENIED",
    grantedDate: "10/03/2025",
    expires: "10/03/2026",
  },
  {
    uuid: "7",
    consentId: "#123461",
    purpose: "SMS Promotional Alerts",
    status: "WITHDRAWN",
    grantedDate: "05/06/2024",
    expires: "05/06/2025",
  },
];

export const myConsentStats = [
  {
    label: "Total Consents",
    value: 7,
    icon: ClipboardList,
    valueClass: "text-foreground",
    iconClass: "bg-muted text-muted-foreground",
  },
  {
    label: "Granted",
    value: 4,
    icon: CheckCircle,
    valueClass: "text-success",
    iconClass: "bg-success/10 text-success",
  },
  {
    label: "Denied",
    value: 2,
    icon: XCircle,
    valueClass: "text-destructive",
    iconClass: "bg-destructive/10 text-destructive",
  },
  {
    label: "Withdrawn",
    value: 1,
    icon: Clock,
    valueClass: "text-warning",
    iconClass: "bg-warning/10 text-warning",
  },
];
