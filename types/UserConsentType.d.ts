type UserConsentType = {
  uuid: string;
  consentId: string;
  purpose: string;
  status: "GRANTED" | "DENIED" | "WITHDRAWN";
  grantedDate: string;
  expires: string;
};
