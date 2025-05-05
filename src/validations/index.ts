import { z } from "zod";
import {
  maxLengthError,
  minLengthError,
  numberValidation,
  stringValidation,
} from "./commonSchema";
import { PRODUCT_TYPE } from "../config/Constants";

export const categorySchema = z.object({
  title: stringValidation("Category title")
    .min(1, minLengthError("Title", 1))
    .max(25, maxLengthError("Title", 25)),
});

export const categoryParams = z.object({
  categoryId: numberValidation("categoryId"),
});

export const postProductSchema = z.object({
  productName: stringValidation("Product name")
    .min(3, minLengthError("Product name", 3))
    .max(250, maxLengthError("Product name", 250)),
  categoryId: numberValidation("categoryId"),
  price: numberValidation("Price"),
  availableStock: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => val >= 0, {
      message: "Available stock cannot be negative",
    }),
  productType: z.enum(
    [
      PRODUCT_TYPE.male,
      PRODUCT_TYPE.female,
      PRODUCT_TYPE.universal,
      PRODUCT_TYPE.children,
    ],
    {
      required_error: "Product type is required",
      invalid_type_error: "Invalid product type",
    }
  ),
  status: z.enum(["SHOW", "HIDE"], {
    required_error: "Status is required",
    invalid_type_error: "Status must be SHOW or HIDE",
  }),
  colors: z.preprocess(
    (val) => {
      try {
        if (typeof val === "string") {
          return JSON.parse(val); // parse '[{"code":"#fff"}]'
        }
        return val;
      } catch {
        return undefined;
      }
    },
    z
      .array(
        z.object({
          code: z
            .string({ required_error: "Color code is required" })
            .min(1, "Color code is required"),
        })
      )
      .optional()
  ),
});

export const productParams = z.object({
  productId: numberValidation("productId"),
});
