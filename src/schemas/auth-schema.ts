import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  username: z.string()
    .min(2, "Username must be at least 2 characters")
    .max(20, "Username must be at most 20 characters"),
  tag: z.string()
    .min(1, "Tag is required")
    .max(10, "Tag must be at most 10 characters") // Assuming reasonable length for a tag
    .regex(/^#?[a-zA-Z0-9]+$/, "Tag can only contain alphanumeric characters"),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;
