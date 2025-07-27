import * as z from "zod";

export const RegisterFormSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, { error: "Password must be between 6 and 20 characters long" })
    .max(20, { error: "Password must be between 6 and 20 characters long" })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{6,20}$/, {
      error:
        "Password must include at least one letter and one number, and may only contain special characters: !@#$%^&*",
    }),
});

export const LoginFormSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, { error: "Password must be between 6 and 20 characters long" })
    .max(20, { error: "Password must be between 6 and 20 characters long" })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{6,20}$/, {
      error:
        "Password must include at least one letter and one number, and may only contain special characters: !@#$%^&*",
    }),
});

export const ShortenerFormSchema = z.object({
  originalUrl: z.url(
    { protocol: /^https?$/ },
    { error: "URL must start with http or https" }
  ),
  customShortCode: z
    .string()
    .min(6, {
      error: "Custom short code must be between 6 and 20 characters long",
    })
    .max(20, {
      error: "Custom short code must be between 6 and 20 characters long",
    })
    .regex(/^[A-Za-z\d]{6,20}$/, {
      error: "Custom short code may only contain letter sand numbers",
    })
    .optional(),
  password: z
    .string()
    .min(6, { error: "Password must be between 6 and 20 characters long" })
    .max(20, { error: "Password must be between 6 and 20 characters long" })
    .regex(/^[A-Za-z\d!@#$%^&*]{6,20}$/, {
      error:
        "Password may only contain letters, numbers, and may only contain the following special characters: !@#$%^&*",
    })
    .nullish(),
  description: z
    .string()
    .max(300, { error: "Please keep the description under 300 characters." })
    .nullish(),
  isActive: z.boolean(),
});

export const editFormSchema = z.object({
  originalUrl: z.url(
    { protocol: /^https?$/ },
    { error: "URL must start with http or https" }
  ),
  description: z
    .string()
    .max(300, { error: "Please keep the description under 300 characters." })
    .nullish(),
  isActive: z.boolean(),
  password: z
    .string()
    .min(6, { error: "Password must be between 6 and 20 characters long" })
    .max(20, { error: "Password must be between 6 and 20 characters long" })
    .regex(/^[A-Za-z\d!@#$%^&*]{6,20}$/, {
      error:
        "Password may only contain letters, numbers, and may only contain the following special characters: !@#$%^&*",
    })
    .nullish(),
})

