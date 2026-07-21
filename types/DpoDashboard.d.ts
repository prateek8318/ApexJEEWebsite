type DpoStatMetricSubTone = "success" | "warning";

type DpoStatMetricColor = "blue" | "green" | "orange";

type DpoStatMetric = {
    label: string;
    value: string;
    subLabel: string;
    subTone: DpoStatMetricSubTone;
    color: DpoStatMetricColor;
};

type DpoGrievanceTrendPoint = {
    month: string;
    count: number;
};

type DpoComplianceTrendPoint = {
    month: string;
    score: number;
};

type DpoConsentLogStatus = "granted" | "denied" | "withdrawn";

type DpoConsentLogRow = {
    id: string;
    userName: string;
    email: string;
    purpose: string;
    status: DpoConsentLogStatus;
    date: string;
};

type DpoGrievancePriority = "high" | "medium" | "low";

type DpoGrievanceRow = {
    id: string;
    priority: DpoGrievancePriority;
    description: string;
    userName: string;
    date: string;
};

type DpoConsentBreakdown = {
    total: number;
    granted: number;
    denied: number;
    withdrawn: number;
};

type DpoComplaintsBreakdown = {
    total: number;
    resolved: number;
    inProgress: number;
    pending: number;
};
