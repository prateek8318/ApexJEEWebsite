export const dummyPreferenceData = {
  brandLogo: [],
  headerText: "Preference Center",
  addTitle: "Manage your preferences",
  subtitle: "Choose what data you want us to process",
  button1: "Cancel",
  button2: "Save Preferences",
};

export const preferencePurposes = [
  {
    id: "1",
    purpose: "Email Marketing",
    activities: "Promotional emails and newsletters",
    category: "Marketing",
    categories: ["Email", "Marketing"],
    lifetime: 365,
    title: "Email Marketing",
    description: "Promotional emails and newsletters",
    enabled: false,
  },
  {
    id: "2",
    purpose: "SMS Notifications",
    activities: "SMS alerts and updates",
    category: "Marketing",
    categories: ["SMS", "Marketing"],
    lifetime: 365,
    title: "SMS Notifications",
    description: "SMS alerts and updates",
    enabled: true,
  },
  {
    id: "3",
    purpose: "Personalized Ads",
    activities: "Data use for personalized advertising",
    category: "Marketing",
    categories: ["Ads", "Marketing"],
    lifetime: 365,
    title: "Personalized Ads",
    description: "Data use for personalized advertising",
    enabled: true,
  },
];
