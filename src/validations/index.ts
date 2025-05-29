import { z } from "zod";
import {
  emailSchema,
  maxLengthError,
  minLengthError,
  numberValidation,
  passwordSchema,
  stringValidation,
} from "./commonSchema";
import { ACCOUNT_STATUS, GENDER, PRODUCT_TYPE } from "../config/Constants";

const sizeSchema = z.object({
  size: stringValidation("Size"),
  stock: numberValidation("Stock"),
  image: stringValidation("Image"),
});

const variantSchema = z.object({
  colorName: stringValidation("Color name"),
  colorCode: stringValidation("Color code"),
  sizes: z.array(sizeSchema).min(1, "At least one size must be provided"),
});

export const categorySchema = z.object({
  title: stringValidation("Category title")
    .min(1, minLengthError("Title", 1))
    .max(25, maxLengthError("Title", 25)),
});

export const categoryParams = z.object({
  categoryId: numberValidation("categoryId"),
});

const variantsSchemaFromString = z
  .string({
    required_error: "Variants are required",
    invalid_type_error: "Variants must be a JSON string",
  })
  .transform((val, ctx) => {
    // 1️⃣ Parse JSON safely
    try {
      return JSON.parse(val);
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Variants must be valid JSON",
      });
      return z.NEVER; // abort further transforms
    }
  })
  // 2️⃣ Pipe into an array of variantSchema so Zod can validate every field
  .pipe(
    z
      .array(variantSchema, {
        invalid_type_error: "Variants must be an array of objects",
      })
      .min(1, "At least one variant is required")
  );

export const postProductSchema = z.object({
  productName: stringValidation("Product name")
    .min(3, minLengthError("Product name", 3))
    .max(250, maxLengthError("Product name", 250)),
  categoryId: numberValidation("categoryId"),
  price: numberValidation("Price"),
  productType: z.enum(
    [
      PRODUCT_TYPE.male,
      PRODUCT_TYPE.female,
      PRODUCT_TYPE.universal,
      PRODUCT_TYPE.children,
    ] as [string, ...string[]],
    {
      required_error: "Product type is required",
      invalid_type_error: "Invalid product type",
    }
  ),
  status: z.enum(["SHOW", "HIDE"], {
    required_error: "Status is required",
    invalid_type_error: "Status must be SHOW or HIDE",
  }),
  variants: variantsSchemaFromString,
});

export const productParams = z.object({
  productId: numberValidation("productId"),
});

export const refreshSessionSchema = z.object({
  refreshToken: stringValidation("Refresh token").min(
    10,
    minLengthError("Refresh token", 10)
  ),
});

const accountStatusValues = Object.values(ACCOUNT_STATUS) as [
  string,
  ...string[]
];

const genderValues = Object.values(GENDER) as [string, ...string[]];

export const updateUserStatus = z.object({
  status: z.enum(accountStatusValues, {
    errorMap: (issue, ctx) => {
      if (issue.code === "invalid_type" && issue.received === "undefined") {
        // If status is missing (undefined)
        return { message: "Status is required." };
      }
      if (issue.code === "invalid_enum_value") {
        // If status value is invalid
        return {
          message: `Only ${accountStatusValues.join(" or ")} are accepted.`,
        };
      }
      return { message: ctx.defaultError };
    },
  }),
});

export const registerUserSchema = z.object({
  fullName: stringValidation("Full name")
    .min(3, minLengthError("Full name", 3))
    .max(50, maxLengthError("Full name", 50)),
  email: emailSchema,
  password: passwordSchema,
  phoneNumber: z
    .string()
    .regex(/^\+\d+$/, "Phone number must start with + and contain only digits")
    .refine((val) => val.length > 6 && val.length < 16, {
      message:
        "Phone number length must be greater than 6 and less than 16 characters",
    }),
  gender: z.enum(genderValues, {
    errorMap: (issue, ctx) => {
      console.log("Issue ==>", issue);
      return { message: `Gender must be one of ${genderValues.join(" or ")}` };
    },
  }),
});
