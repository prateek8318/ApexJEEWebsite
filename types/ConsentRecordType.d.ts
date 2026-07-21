type ConsentRecordType = {
  id: string;
  consentId: string;
  purpose: string;
  notice: string; // URL
  platform: string;
  status: "ACTIVE" | "REVOKED" | "EXPIRED";
  date: string;
};
