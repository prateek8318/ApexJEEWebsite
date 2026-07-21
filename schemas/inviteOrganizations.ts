import { z } from "zod";

export const OrganizationInviteSchema = z.object({
	emails: z.array(z.string().email("Invalid email")).min(1, "Add at least one email"),
});
