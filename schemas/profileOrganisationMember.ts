import { z } from "zod";
import { isEmail } from "validator";

export const ProfileMemberSchema = z.object({
  name: z.string(),
  email: z.string(),
  address: z.string(),
  contact: z.string(),

});

export const ProfileProjectSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const InviteSchema = z.object({
  emails: z
    .array(z.string().refine((data) => isEmail(data), "Invalid email!"))
    .min(1, "Enter at least one email"),
  role: z.string().min(1, "Role is required"),
});

export type InviteValues = z.infer<typeof InviteSchema>;
export type MemberValue = z.infer<typeof ProfileMemberSchema>;
export type ProjectValue = z.infer<typeof ProfileProjectSchema>;
