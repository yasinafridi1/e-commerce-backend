import { z } from "zod";

export const stringValidation = (fieldName: string) =>
  z.string({
    required_error: `${fieldName} is required`,
  });

export const numberValidation = (fieldName: string) =>
  z
    .union([z.string(), z.number()], {
      invalid_type_error: `${fieldName} is required`,
      required_error: `${fieldName} is required`,
    })
    .transform((val) => (typeof val === "string" ? Number(val) : val))
    .refine((val) => !isNaN(val), {
      message: `${fieldName} must be a valid number`,
    })
    .refine((val) => val >= 1, {
      message: `${fieldName} must be greater than 0`,
    });

export const minLengthError = (fieldName: string, length: number) => {
  return `${fieldName} must be at least ${length} characters`;
};

export const maxLengthError = (fieldName: string, length: number) => {
  return `${fieldName} must not exceed ${length} characters`;
};

export const emailSchema = stringValidation("Email")
  .email("Invalid email address")
  .max(130, maxLengthError("Email", 130));

export const passwordSchema = stringValidation("Password")
  .min(6, minLengthError("Password", 6))
  .max(20, maxLengthError("Password", 20))
  .regex(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,20}$/,
    "Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
  );

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fcmToken: z
    .string({
      required_error: "FCM token is required",
    })
    .min(4, "fcm token must be at least 4 characters"),
});

export const idParamsSchema = z.object({
  userId: numberValidation("userId"),
});
