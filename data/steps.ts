export type Steps = {
  id: string;
  title: string;
  description: string;
};

export const consentSteps: Steps[] = [
  {
    id: "basic-info",
    title: "Basic Information",
    description: "Enter consent request information",
  },
  {
    id: "purpose",
    title: "Processing Purpose",
    description: "Define purpose of data processing",
  },
  {
    id: "privacy",
    title: "Privacy Notice",
    description: "Add privacy notice information",
  },
  {
    id: "consent-form",
    title: "Consent Form",
    description: "Design for popup",
  },
  {
    id: "preference-center",
    title: "Preference Center",
    description: "Design for popup",
  },
  {
    id: "language",
    title: "Language",
    description: "Translations",
  },
  {
    id: "code-snippets",
    title: "Code Snippets",
    description: "Embed in your app",
  },
  {
    id: "review",
    title: "Review & Submit",
    description: "Review all entered data",
  },
];
