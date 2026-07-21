import { z } from "zod";
import {
    orgAdminAssignRoleOptions,
    orgAdminAssignPersonOptionsByRole,
    type OrgAdminAssignRoleValue,
} from "@data/grievance";

const orgAdminAssignRoleValues = orgAdminAssignRoleOptions.map((o) => o.value);

export const orgAdminAssignFormSchema = z
    .object({
        role: z
            .string()
            .min(1, "Please select a role")
            .refine(
                (v): v is OrgAdminAssignRoleValue =>
                    (orgAdminAssignRoleValues as readonly string[]).includes(v),
                { message: "Invalid role" },
            ),
        person: z.string().min(1, "Please select a person"),
    })
    .superRefine((data, ctx) => {
        const role = data.role as OrgAdminAssignRoleValue;
        const allowed = orgAdminAssignPersonOptionsByRole[role];
        if (
            !allowed.some(
                (p: { value: string; label: string }) => p.value === data.person,
            )
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Person does not match the selected role",
                path: ["person"],
            });
        }
    });

export type OrgAdminAssignFormValues = z.infer<typeof orgAdminAssignFormSchema>;
