import { FileText, ShieldCheck, UserRound } from "lucide-react";

export const dpoStatIconMap = {
    "Active DPOs": UserRound,
    "Compliance Score": ShieldCheck,
    "Open Grievances": FileText,
} as const;

export const dpoStatMetrics = [
    {
        label: "Active DPOs",
        value: "9",
        subLabel: "+2 appointed this quarter",
        subTone: "success" as const,
        color: "blue" as const,
    },
    {
        label: "Compliance Score",
        value: "95%",
        subLabel: "+3 pts vs last assessment",
        subTone: "success" as const,
        color: "green" as const,
    },
    {
        label: "Open Grievances",
        value: "12",
        subLabel: "4 SLA-critical (>48h)",
        subTone: "warning" as const,
        color: "orange" as const,
    },
] satisfies readonly DpoStatMetric[];

/** Monthly grievance intake (significant fiduciaries, FY window). */
export const dpoGrievanceTrendData = [
    { month: "Jan", count: 8 },
    { month: "Feb", count: 14 },
    { month: "Mar", count: 18 },
    { month: "Apr", count: 12 },
    { month: "May", count: 22 },
    { month: "Jun", count: 16 },
] satisfies readonly DpoGrievanceTrendPoint[];

/** Organisation-wide consent compliance index (notice clarity + log completeness). */
export const dpoComplianceTrendData = [
    { month: "Jan", score: 88 },
    { month: "Feb", score: 90 },
    { month: "Mar", score: 91 },
    { month: "Apr", score: 93 },
    { month: "May", score: 94 },
    { month: "Jun", score: 95 },
] satisfies readonly DpoComplianceTrendPoint[];

/** Recent consent artefacts — purposes mirror typical processing-inventory categories. */
export const dpoConsentLogs = [
    {
        id: "CNS-2026-1842",
        userName: "Ananya Sharma",
        email: "ananya.sharma@gmail.com",
        purpose: "Marketing & promotional communications (email/SMS)",
        status: "granted",
        date: "2026-03-27",
    },
    {
        id: "CNS-2026-1841",
        userName: "Rahul Verma",
        email: "rahul.verma@outlook.in",
        purpose: "Analytics, cookies & product improvement",
        status: "granted",
        date: "2026-03-27",
    },
    {
        id: "CNS-2026-1839",
        userName: "Priya Nair",
        email: "priya.nair@company.in",
        purpose: "Sharing with payment & logistics processors",
        status: "denied",
        date: "2026-03-26",
    },
    {
        id: "CNS-2026-1836",
        userName: "Karthik Iyer",
        email: "karthik.iyer@gmail.com",
        purpose: "Marketing & promotional communications (email/SMS)",
        status: "withdrawn",
        date: "2026-03-26",
    },
    {
        id: "CNS-2026-1834",
        userName: "Meera Patel",
        email: "meera.patel@yahoo.in",
        purpose: "Profiling & personalised offers (automated processing)",
        status: "granted",
        date: "2026-03-25",
    },
] satisfies readonly DpoConsentLogRow[];

/** Data-principal grievances under DPDP-style rights (access, correction, erasure, notice). */
export const dpoRecentGrievances = [
    {
        id: "GRV-2026-0142",
        priority: "high",
        description:
            "Request for complete copy of personal data held (access) — no response within statutory timeline.",
        userName: "Sunita Kapoor",
        date: "2026-03-28",
    },
    {
        id: "GRV-2026-0140",
        priority: "medium",
        description:
            "Consent notice for mobile onboarding does not clearly list third-party SDKs and data flows.",
        userName: "Lakshmi Menon",
        date: "2026-03-27",
    },
    {
        id: "GRV-2026-0138",
        priority: "low",
        description:
            "Acknowledgement of grievance registration received after 24h; seeks confirmation of case ID.",
        userName: "Vikram Das",
        date: "2026-03-26",
    },
    {
        id: "GRV-2026-0135",
        priority: "high",
        description:
            "Objection to cross-border transfer: purpose not reflected in published privacy notice.",
        userName: "Nikhil Reddy",
        date: "2026-03-25",
    },
] satisfies readonly DpoGrievanceRow[];

/** Aggregated consent outcomes (all channels, current reporting period). granted+denied+withdrawn = total */
export const dpoConsentBreakdown = {
    total: 1248,
    granted: 892,
    denied: 156,
    withdrawn: 200,
} satisfies DpoConsentBreakdown;

/** User complaints / grievance pipeline — resolved+inProgress+pending = total */
export const dpoComplaintsBreakdown = {
    total: 48,
    resolved: 28,
    inProgress: 8,
    pending: 12,
} satisfies DpoComplaintsBreakdown;
