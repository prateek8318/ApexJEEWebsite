
export const dummyDisplayData = {
  branding: "Centered Modal with Bank Branding",
  noticeType: "Layered Consent Banner",
  theme: "Neutral Contrast",
  animation: "Fade and Scale",
};

export const dummyLanguageData: {
  primary: string;
  secondary: { code: string; name: string; status: "Active" | "Pending" }[];
} = {
  primary: "English (India)",
  secondary: [
    { code: "hi", name: "Hindi", status: "Active" },
    { code: "bn", name: "Bengali", status: "Pending" },
  ],
};
