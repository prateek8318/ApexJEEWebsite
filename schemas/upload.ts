import { z } from "zod";

export const ChangeProfilePictureSchema = z.object({
  picture: z
    .array(z.instanceof(File))
    .min(1, "Should contain min of 1 file!")
    .max(1, "Should contain max of 1 file!"),
});

export const ChangeOrganizationLogoSchema = z.object({
  logo: z
    .array(z.instanceof(File))
    .min(1, "Should contain min of 1 file!")
    .max(1, "Should contain max of 1 file!"),
});
