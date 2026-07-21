import { Users, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export const areaData = [
    { name: "Jan", accepted: 4200, declined: 600 },
    { name: "Feb", accepted: 4800, declined: 700 },
    { name: "Mar", accepted: 5200, declined: 650 },
    { name: "Apr", accepted: 5800, declined: 720 },
    { name: "May", accepted: 6300, declined: 780 },
    { name: "Jun", accepted: 6900, declined: 810 },
    { name: "Jul", accepted: 7500, declined: 840 },
];

export const barData = [
    { name: "Web Portal", value: 62 },
    { name: "Android App", value: 81 },
    { name: "iOS App", value: 74 },
    { name: "Public API", value: 68 },
    { name: "Partner SDK", value: 55 },
];

export const notifications = [
    {
        title: "Retention Policy Review Due",
        description: "KYC consent retention window for FY 2024 cohorts is due for re-validation.",
        time: "3 hours ago",
    },
    {
        title: "Webhook Failure Spike",
        description: "Revocation webhook to CRM crossed 2% error threshold in the last 6 hours.",
        time: "9 hours ago",
    },
    {
        title: "New Notice Version Published",
        description: "Marketing communication notice v3.0 is now active for all mobile channels.",
        time: "1 day ago",
    },
];

export const complianceItems = [
    { label: "Notice Clarity", score: "9.2" },
    { label: "Response Time", score: "8.7" },
    { label: "Data Accuracy", score: "9.0" }
];

export const recentActivityData = [
    {
        userId: "CNS-01",
        type: "Email Marketing",
        channel: "Web",
        time: "1 hours ago",
        status: "Accepted" as const,
    },
    {
        userId: "CNS-02",
        type: "Data Sharing",
        channel: "Mobile App",
        time: "2 hours ago",
        status: "Accepted" as const,
    },
    {
        userId: "CNS-03",
        type: "Cookies Policy",
        channel: "Web",
        time: "3 hours ago",
        status: "Declined" as const,
    },
    {
        userId: "CNS-04",
        type: "Marketing SMS",
        channel: "Mobile App",
        time: "5 hours ago",
        status: "Accepted" as const,
    },
    {
        userId: "CNS-05",
        type: "Third Party Tracking",
        channel: "Web",
        time: "8 hours ago",
        status: "Declined" as const,
    },
    {
        userId: "CNS-06",
        type: "Personalization",
        channel: "API",
        time: "12 hours ago",
        status: "Accepted" as const,
    },
];
export const statsData = [
    {
        label: "Total Users",
        value: "65,340",
        change: "12.5%",
        trend: "up" as const,
        color: "blue",
    },
    {
        label: "Consents Accepted",
        value: "74%",
        change: "12.5%",
        trend: "up" as const,
        color: "green",
    },
    {
        label: "Consents Declined",
        value: "12%",
        change: "12.5%",
        trend: "down" as const,
        color: "red",
    },
    {
        label: "Expired",
        value: "6,290",
        change: "12.5%",
        trend: "down" as const,
        color: "rose",
    },
];

export const iconMap = {
    "Total Users": Users,
    "Consents Accepted": CheckCircle,
    "Consents Declined": XCircle,
    "Expired": AlertCircle,
};