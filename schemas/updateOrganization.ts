import { z } from "zod";
import { isAlphanumeric, isEmail, isMobilePhone } from "validator";

export const OrganizationUpdateSchema = z.object({
	organizationName: z
		.string()
		.min(3, "Should contain min of 3 characters!")
		.max(30, "Should contain max of 30 characters!")
		.refine(data => isAlphanumeric(data, "en-US", { ignore: " '" }), "Invalid characters found!"),
	legalEntityName: z
		.string()
		.min(3, "Should contain min of 3 characters!")
		.max(30, "Should contain max of 30 characters!")
		.refine(data => isAlphanumeric(data, "en-US", { ignore: " '" }), "Invalid characters found!"),
	domain: z.string().min(2, "Domain is required"),
	additionalDomains: z.string().optional(),
	organizationType: z.string().min(2, "Organization type is required"),
	country: z.string().min(2, "Country is required"),
	industry: z.string().min(2, "Industry is required"),
	contactEmail: z
		.string()
		.min(1, "This field is required!")
		.refine(data => isEmail(data), "Invalid email!"),
	contactPhone: z
		.string()
		.min(1, "This field is required!")
		.refine(data => isMobilePhone(data, "any", { strictMode: true }), "Invalid contact no.!"),
});
