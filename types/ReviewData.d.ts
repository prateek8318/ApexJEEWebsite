type ReviewData ={
  display: {
    branding: string;
    noticeType: string;
    theme: string;
    animation: string;
  };
  languages: {
    primary: string;
    secondary: { code: string; name: string; status: "Active" | "Pending" }[];
  };
}
