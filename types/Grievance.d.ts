type GrievanceTicketStatus = "pending" | "in_progress" | "resolved";

type GrievancePriority = "high" | "medium" | "low";

type GrievanceTicket = {
    id: string;
    ticketNo: string;
    complainant: string;
    email: string;
    subject: string;
    status: GrievanceTicketStatus;
};

type GrievanceAttachment = {
    name: string;
};

type GrievanceComplainantDetail = {
    fullName: string;
    userId: string;
    email: string;
    phone: string;
};

type GrievanceDetail = GrievanceTicket & {
    ticketRef: string;
    category: string;
    description: string;
    attachments: readonly GrievanceAttachment[];
    complainantDetail: GrievanceComplainantDetail;
    priority: GrievancePriority;
    regulatoryRisk: GrievancePriority;
    slaCompliant: boolean;
};

type GrievanceStatMetric = {
    key: "total" | "pending" | "in_progress" | "resolved";
    label: string;
    value: number;
    tone: "primary" | "warning" | "accent" | "success";
};
