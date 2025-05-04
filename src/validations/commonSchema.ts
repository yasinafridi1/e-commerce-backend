import { z } from "zod";

export const emailSchema = z
  .string({
    required_error: "Email is required",
  })
  .email("Invalid email address")
  .max(130, "Email must not exceed 130 character");

export const passwordSchema = z
  .string({
    required_error: "Password is required",
  })
  .min(6, "Password must be at least 6 characters")
  .max(20, "Password must not exceed 20 characters")
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
  userId: z.number().min(1, "User id must be greater than 0"),
});
