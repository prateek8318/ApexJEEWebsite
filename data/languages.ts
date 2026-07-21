import { Option } from "@components/ui/combobox";

export const languageOptions: Option[] = [
  { uuid: "1", label: "Marathi", value: "mr" },
  { uuid: "2", label: "Hindi", value: "hi" },
  { uuid: "3", label: "English", value: "en" },
  { uuid: "4", label: "Gujarati", value: "gu" },
  { uuid: "5", label: "French", value: "fr" },
  { uuid: "6", label: "Spanish", value: "es" },
  { uuid: "7", label: "German", value: "de" },
];

export const dummyLanguageData = {
  templateName: "Retail Banking Consent Template",
  language: "en",
  categories: {
    treatment: "Required",
    marketing: "Optional",
    support: "Legitimate Interest",
  },
};
