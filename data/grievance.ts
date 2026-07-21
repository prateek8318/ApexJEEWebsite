import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

export const grievanceStatMetrics: readonly GrievanceStatMetric[] = [
    {
        key: "total",
        label: "Total Grievances",
        value: 48,
        tone: "primary",
    },
    {
        key: "pending",
        label: "Pending",
        value: 12,
        tone: "warning",
    },
    {
        key: "resolved",
        label: "Resolved",
        value: 28,
        tone: "success",
    },
] as const;

export const grievanceStatIconMap = {
    total: AlertCircle,
    pending: Clock,
    resolved: CheckCircle2,
} as const;

export const getGrievanceStatIcon = (key: GrievanceStatMetric["key"]) => {
    if (key === "in_progress") {
        return grievanceStatIconMap.pending;
    }
    return grievanceStatIconMap[key];
};

export const grievanceTickets: readonly GrievanceTicket[] = [
    {
        id: "1",
        ticketNo: "TKT-2024-001",
        complainant: "John Doe",
        email: "john.doe@example.com",
        subject: "Data Access Request - Personal Info",
        status: "pending",
    },
    {
        id: "2",
        ticketNo: "TKT-2024-002",
        complainant: "Jane Smith",
        email: "jane.smith@example.com",
        subject: "Right to Erasure Request",
        status: "pending",
    },
    {
        id: "3",
        ticketNo: "TKT-2024-003",
        complainant: "Robert Brown",
        email: "robert.brown@example.com",
        subject: "Incorrect Data Processing Complaint",
        status: "resolved",
    },
] satisfies readonly GrievanceTicket[];

export const orgAdminGrievanceTickets: readonly GrievanceTicket[] = [
    {
        id: "101",
        ticketNo: "ORG-ADM-2024-001",
        complainant: "Executive Review Team",
        email: "ert@enterprise.com",
        subject: "Quarterly Compliance Audit - High Priority",
        status: "pending",
    },
    {
        id: "102",
        ticketNo: "ORG-ADM-2024-002",
        complainant: "Legal Counsel",
        email: "legal@partner.com",
        subject: "Data Privacy Agreement Violation Alert",
        status: "pending",
    },
    {
        id: "103",
        ticketNo: "ORG-ADM-2024-003",
        complainant: "Security Officer",
        email: "security@customer.com",
        subject: "Unauthorised Data Access Incident",
        status: "resolved",
    },
] satisfies readonly GrievanceTicket[];

export const getDpoStatMetrics = (): readonly GrievanceStatMetric[] => [
    {
        key: "total",
        label: "Total Grievances",
        value: grievanceTickets.length,
        tone: "primary",
    },
    {
        key: "pending",
        label: "Pending",
        value: grievanceTickets.filter((ticket) => ticket.status === "pending").length,
        tone: "warning",
    },
    {
        key: "resolved",
        label: "Resolved",
        value: grievanceTickets.filter((ticket) => ticket.status === "resolved").length,
        tone: "success",
    },
];

export const getOrgAdminStatMetrics = (): readonly GrievanceStatMetric[] => [
    {
        key: "total",
        label: "Total Grievances",
        value: orgAdminGrievanceTickets.length,
        tone: "primary",
    },
    {
        key: "pending",
        label: "Pending",
        value: orgAdminGrievanceTickets.filter((ticket) => ticket.status === "pending")
            .length,
        tone: "warning",
    },
    {
        key: "resolved",
        label: "Resolved",
        value: orgAdminGrievanceTickets.filter((ticket) => ticket.status === "resolved")
            .length,
        tone: "success",
    },
];
export const orgAdminAssignRoleOptions = [
    { value: "ROLE_DP_OFFICER", label: "DPO" },
    { value: "ROLE_ORG_ADMIN", label: "Org Admin" },
    { value: "ROLE_SUPER_ADMIN", label: "Super Admin" },
    { value: "ROLE_SUPPORT_STAFF", label: "Support Staff" },
    { value: "ROLE_MAINTAINER", label: "Maintainer" },
    { value: "ROLE_END_USER", label: "End User" },
    { value: "ROLE_DEVELOPER", label: "Developer" }
] as const;

export type OrgAdminAssignRoleValue =
    (typeof orgAdminAssignRoleOptions)[number]["value"];

export const orgAdminAssignPersonOptionsByRole: Record<
    OrgAdminAssignRoleValue,
    readonly { value: string; label: string }[]
> = {
    ROLE_DP_OFFICER: [
        { value: "ritik-yadav", label: "Ritik Yadav" },
        { value: "meera-sharma", label: "Meera Sharma" },
    ],
    ROLE_ORG_ADMIN: [
        { value: "karan-verma", label: "Karan Verma" },
        { value: "sneha-patel", label: "Sneha Patel" },
    ],
    ROLE_SUPER_ADMIN: [
        { value: "admin-one", label: "System Admin One" },
        { value: "admin-two", label: "System Admin Two" },
    ],
    ROLE_SUPPORT_STAFF: [
        { value: "support-a", label: "Support Agent A" },
        { value: "support-b", label: "Support Agent B" },
    ],
    ROLE_MAINTAINER: [
        { value: "maint-joe", label: "Joe Maintainer" },
        { value: "maint-sara", label: "Sara Maintainer" },
    ],
    ROLE_END_USER: [
        { value: "user-demo-1", label: "Demo User One" },
        { value: "user-demo-2", label: "Demo User Two" },
    ],
    ROLE_DEVELOPER: [
        { value: "dev-alex", label: "Alex Dev" },
        { value: "dev-priya", label: "Priya Dev" },
    ]
};


const detail = (
    base: GrievanceTicket,
    extra: Omit<GrievanceDetail, keyof GrievanceTicket>,
): GrievanceDetail => ({
    ...base,
    ...extra,
});

export const grievanceDetailById: Record<string, GrievanceDetail> = {
    "1": detail(grievanceTickets[0], {
        ticketRef: "TKT-2024-001",
        category: "Data access rights",
        description:
            "I raised a formal request to access and obtain a copy of my personal data held by your organisation, as permitted under the DPDP Act. It has been more than thirty days since your team acknowledged receipt, but I have not received a complete response or a structured export. I am asking for a full copy of my data, a clear explanation for the delay, and a revised timeline for resolution.",
        attachments: [
            { name: "portal_request_screenshot.png" },
            { name: "acknowledgement_email.pdf" },
        ],
        complainantDetail: {
            fullName: "John Doe",
            userId: "USR-4521",
            email: "john.doe@example.com",
            phone: "+91 9876543210",
        },
        priority: "high",
        regulatoryRisk: "high",
        slaCompliant: true,
    }),
    "2": detail(grievanceTickets[1], {
        ticketRef: "TKT-2024-002",
        category: "Erasure",
        description:
            "Follow-up to a prior erasure request: Data Principal seeks written confirmation that personal data has been deleted or anonymised across consent records, analytics backups, and partner integrations, except where retention is required by law. Internal review is pending for two downstream vendors; SLA clock is at risk until those confirmations are on file.",
        attachments: [{ name: "original_erasure_request.pdf" }],
        complainantDetail: {
            fullName: "Jane Smith",
            userId: "USR-5504",
            email: "jane.smith@example.com",
            phone: "+91 9876500005",
        },
        priority: "high",
        regulatoryRisk: "medium",
        slaCompliant: false,
    }),
    "3": detail(grievanceTickets[2], {
        ticketRef: "TKT-2024-003",
        category: "Data portability",
        description:
            "Data Principal requested a machine-readable export of personal data processed by the organisation, citing the right to data portability under the Digital Personal Data Protection Act, 2023. The Data Fiduciary acknowledged the request, verified identity, and provided the export bundle within the communicated timeline. Complainant confirmed receipt; case closed to satisfaction.",
        attachments: [
            { name: "dpdp_portability_request.pdf" },
            { name: "identity_verification_summary.pdf" },
        ],
        complainantDetail: {
            fullName: "Robert Brown",
            userId: "USR-2201",
            email: "robert.brown@example.com",
            phone: "+91 9876500001",
        },
        priority: "medium",
        regulatoryRisk: "low",
        slaCompliant: true,
    }),
    "4": detail(grievanceTickets[3], {
        ticketRef: "TKT-2024-002",
        category: "Erasure",
        description:
            "Follow-up to a prior erasure request: Data Principal seeks written confirmation that personal data has been deleted or anonymised across consent records, analytics backups, and partner integrations, except where retention is required by law. Internal review is pending for two downstream vendors; SLA clock is at risk until those confirmations are on file.",
        attachments: [{ name: "original_erasure_request.pdf" }],
        complainantDetail: {
            fullName: "Jane Smith",
            userId: "USR-5504",
            email: "jane.smith@example.com",
            phone: "+91 9876500005",
        },
        priority: "high",
        regulatoryRisk: "medium",
        slaCompliant: false,
    }),
    "101": detail(orgAdminGrievanceTickets[0], {
        ticketRef: "ORG-ADM-2024-001",
        category: "Compliance audit",
        description:
            "Executive-level review requested for quarterly compliance audit observations impacting consent capture, retention, and revocation handling. Please review the findings, assign owners, and track remediation timelines.",
        attachments: [{ name: "q1_audit_summary.pdf" }],
        complainantDetail: {
            fullName: "Executive Review Team",
            userId: "TEAM-ERT",
            email: "ert@enterprise.com",
            phone: "+91 9000000001",
        },
        priority: "high",
        regulatoryRisk: "high",
        slaCompliant: false,
    }),
    "102": detail(orgAdminGrievanceTickets[1], {
        ticketRef: "ORG-ADM-2024-002",
        category: "Data privacy agreement",
        description:
            "Alert raised regarding potential violation of data privacy agreement obligations with a partner integration. Legal counsel has requested an incident assessment, affected data scope, and corrective actions.",
        attachments: [{ name: "partner_dpa_alert.pdf" }],
        complainantDetail: {
            fullName: "Legal Counsel",
            userId: "LEGAL-01",
            email: "legal@partner.com",
            phone: "+91 9000000002",
        },
        priority: "high",
        regulatoryRisk: "high",
        slaCompliant: true,
    }),
    "103": detail(orgAdminGrievanceTickets[2], {
        ticketRef: "ORG-ADM-2024-003",
        category: "Security incident",
        description:
            "Security team reported an unauthorised data access incident requiring investigation, containment, and regulatory reporting assessment. Please document impact analysis and resolution steps.",
        attachments: [{ name: "incident_initial_report.pdf" }],
        complainantDetail: {
            fullName: "Security Officer",
            userId: "SEC-01",
            email: "security@customer.com",
            phone: "+91 9000000003",
        },
        priority: "high",
        regulatoryRisk: "high",
        slaCompliant: true,
    }),
};

export const getGrievanceDetail = (id: string): GrievanceDetail | undefined =>
    grievanceDetailById[id];

export const grievancePageContainer =
    "container mx-auto w-full max-w-7xl bg-background px-4 py-6 text-foreground sm:px-6 sm:py-8 md:py-10 lg:px-8 xl:max-w-screen-2xl";

export const grievanceDetailSectionCard =
    "rounded-2xl border border-border bg-background shadow-sm";

export const grievanceStatCard =
    "group cursor-pointer rounded-2xl border border-border bg-background shadow-sm transition-all duration-100 hover:shadow-md";

export const grievanceTableCard =
    "overflow-hidden rounded-3xl border border-border bg-background shadow-sm";

export const grievanceSortableHeaderBtnClass =
    "h-auto p-0 font-semibold text-primary hover:bg-transparent";

export const grievanceStaticHeaderClass = "font-semibold text-primary";

export const grievanceStatusTitleBadge: Record<
    GrievanceTicketStatus,
    { label: string; variant: "warning" | "default" | "success" }
> = {
    pending: { label: "pending", variant: "warning" },
    in_progress: { label: "in progress", variant: "default" },
    resolved: { label: "resolved", variant: "success" },
};

export const grievanceStatusBadgeClassName =
    "capitalize rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-none";

export const grievancePriorityBadgeVariant = (
    p: GrievancePriority,
): "destructive" | "warning" | "secondary" => {
    if (p === "high") return "destructive";
    if (p === "medium") return "warning";
    return "secondary";
};

export const grievancePriorityBadgeClassName =
    "rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize";
