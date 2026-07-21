type OrganizationStatus = "ACTIVE" | "INACTIVE";

type OrganizationSubscriptionPlan = "FREE" | "BASIC" | "PREMIUM" | "ENTERPRISE" | string;

type Organization = {
	id: number;
	uuid: string;
	organizationName: string;
	legalEntityName: string;
	domain: string;
	additionalDomains?: string[];
	organizationType?: string;
	country: string;
	industry: string;
	contactEmail: string;
	contactPhone: string;
	apiKey: string;
	callbackUrl?: string;
	webhookUrl?: string;
	status: OrganizationStatus;
	subscriptionPlan: OrganizationSubscriptionPlan;
};

