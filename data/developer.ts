import { Activity, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

export const developerStats = [
  {
    title: "API Uptime",
    value: "65,340",
    change: "12.5%",
    period: "last month",
    icon: Activity,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
  },
  {
    title: "Avg Response Time",
    value: "74%",
    change: "12.5%",
    period: "last month",
    icon: CheckCircle2,
    iconColor: "text-success",
    iconBg: "bg-success/10",
  },
  {
    title: "API Errors",
    value: "12%",
    change: "12.5%",
    period: "last month",
    icon: XCircle,
    iconColor: "text-destructive",
    iconBg: "bg-destructive/10",
  },
  {
    title: "Active Consent",
    value: "6,290",
    change: "12.5%",
    period: "last month",
    icon: AlertTriangle,
    iconColor: "text-warning",
    iconBg: "bg-warning/10",
  },
];
export const tabs = [
  { value: "overview", label: "Overview" },
  { value: "apikey", label: "API Key" },
  { value: "webhook", label: "Webhook" }
];

export const apiRequestData = [
  { name: "20 Feb", successful: 4000, failed: 100 },
  { name: "", successful: 3000, failed: 50 },
  { name: "", successful: 2000, failed: 50 },
  { name: "", successful: 2780, failed: 100 },
  { name: "24 Feb", successful: 1890, failed: 200 },
  { name: "", successful: 2390, failed: 50 },
  { name: "", successful: 3490, failed: 400 },
  { name: "", successful: 2000, failed: 50 },
  { name: "", successful: 3000, failed: 100 },
  { name: "28 Feb", successful: 2000, failed: 50 },
  { name: "", successful: 2780, failed: 300 },
  { name: "", successful: 1890, failed: 50 },
  { name: "", successful: 2390, failed: 50 },
  { name: "02 Mar", successful: 3490, failed: 50 },
  { name: "", successful: 2000, failed: 100 },
  { name: "", successful: 3000, failed: 50 },
  { name: "", successful: 2000, failed: 50 },
  { name: "", successful: 2780, failed: 100 },
  { name: "Today", successful: 1890, failed: 50 },
];

export const apiErrorDistributions = [
  { method: "GET", count: 47, color: "text-primary", bg: "bg-primary/5" },
  { method: "POST", count: 82, color: "text-destructive", bg: "bg-destructive/5" },
  { method: "DELETE", count: 14, color: "text-warning", bg: "bg-warning/5" },
];
export const webhooks = [
  { url: "api.baseel.in/webhook/consent", events: "consent_granted - consent_withdrawn", status: "live" },
  { url: "staging.baseel.in/hook", events: "All events", status: "test" },
];

export const recentEvents = [
  {
    tag: "consent.granted",
    title: "User consent recorded",
    id: "evt_8LH0KNEZP...",
    time: "2m ago",
    color: "text-primary bg-primary/10",
  },
  {
    tag: "consent.withdrawn",
    title: "Consent revoked by user",
    id: "evt_QSHMKIZ...",
    time: "14m ago",
    color: "text-destructive bg-destructive/10",
  },
  {
    tag: "consent.updated",
    title: "Preferences updated",
    id: "evt_93MKIZ4X...",
    time: "1h ago",
    color: "text-warning bg-warning/10",
  },
  {
    tag: "identity.verified",
    title: "DigiLocker verification successful",
    id: "evt_OSHNKIZ...",
    time: "3h ago",
    color: "text-success bg-success/10",
  },
  {
    tag: "consent.granted",
    title: "Data principal consent recorded",
    id: "evt_73MKIZ4X...",
    time: "7h ago",
    color: "text-primary bg-primary/10",
  },
];
export const recentErrors = [
  { code: 400, type: "Bad Request", message: "Missing required field: purpose_id", detail: "Today 14:32 • POST", path: "/v1/consent" },
  { code: 401, type: "Unauthorized", message: "Invalid or expired API key", detail: "Today 11:07 • GET", path: "/v1/records" },
  { code: 429, type: "Too Many Requests", message: "Rate limit exceeded on endpoint", detail: "Yesterday 18:55 • POST", path: "/v1/consent" },
];

export const integrationSteps = [
  { title: "Create your API key", done: true },
  { title: "Configure webhook endpoint", done: true },
  { title: "Accept a live consent record", done: false, active: true },
  { title: "Enable DPDP compliance audit", done: false },
];

export const apiKeys = [
  {
    name: "Publishable key",
    token: "pk_live_cms_web_7fA21JxQk9LmP0R3uT4V",
    restriction: "Domain: app.consentgrid.in",
    lastUsed: "24-Mar-2026",
    created: "12-Jan-2026",
  },
  {
    name: "Server key",
    token: "sk_live_srv_2Hu8QnR4xY6bM1Kp9TaC",
    restriction: "IP: 103.122.18.44/32",
    lastUsed: "26-Mar-2026",
    created: "25-Feb-2026",
  },
  {
    name: "Partner sandbox key",
    token: "pk_test_partner_8nQ2mV5cK0tL7bR1yU3e",
    restriction: "Environment: Sandbox",
    lastUsed: "21-Mar-2026",
    created: "06-Mar-2026",
  },
  {
    name: "Mobile app key",
    token: "pk_live_mobile_1Jm4Vq8wN6zR2cD5pS9x",
    restriction: "Bundle: in.consentgrid.app",
    lastUsed: "25-Mar-2026",
    created: "19-Feb-2026",
  },
  {
    name: "Webhook signing key",
    token: "whsec_live_9bM3rX7pT2vL5nQ1kD6c",
    restriction: "Use: Webhook verification only",
    lastUsed: "26-Mar-2026",
    created: "10-Feb-2026",
  },
  {
    name: "Legacy integration key",
    token: "sk_live_legacy_4Rt8Yp2mC6vQ1xN9bK3d",
    restriction: "Read-only endpoints",
    lastUsed: "09-Mar-2026",
    created: "18-Nov-2025",
  },
];

export const webhookEndpoints = [
  {
    url: "https://api.consentgrid.in/webhooks/consent-events",
    type: "Consent Events",
    last7Days: "486",
    errorRate: "0.8%",
    status: "Active",
  },
  {
    url: "https://partner.alphaone.in/cmp/consent-callback",
    type: "Partner Sync",
    last7Days: "172",
    errorRate: "1.7%",
    status: "Active",
  },
  {
    url: "https://staging.consentgrid.in/hooks/audit-export",
    type: "Audit Export",
    last7Days: "41",
    errorRate: "0%",
    status: "Test",
  },
  {
    url: "https://crm.connectplus.in/integrations/cmp",
    type: "CRM Update",
    last7Days: "293",
    errorRate: "0.3%",
    status: "Active",
  },
  {
    url: "https://qa.consentgrid.in/webhooks/revocation",
    type: "Revocation Alerts",
    last7Days: "57",
    errorRate: "3.5%",
    status: "Test",
  },
  {
    url: "https://datalake.consentgrid.in/events/ingest",
    type: "Data Lake Ingest",
    last7Days: "912",
    errorRate: "0.1%",
    status: "Active",
  },
  {
    url: "https://secure.paylink.in/cmp/transaction-consent",
    type: "Payment Consent",
    last7Days: "128",
    errorRate: "0.6%",
    status: "Active",
  },
  {
    url: "https://legacy-gateway.consentgrid.in/v1/callback",
    type: "Legacy Gateway",
    last7Days: "63",
    errorRate: "2.2%",
    status: "Paused",
  },
];

