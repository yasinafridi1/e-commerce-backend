import { z } from "zod";
import {
  maxLengthError,
  minLengthError,
  numberValidation,
  stringValidation,
} from "./commonSchema";
import { PRODUCT_TYPE } from "../config/Constants";

const sizeEnum = z.enum(["xsm", "sm", "medium", "lg", "xl"]);

const sizeSchema = z.object({
  size: sizeEnum,
  stock: z.number().min(0, "Stock must be 0 or more"),
  // image: z.string().min(1, "Image is required for each size"),
});

const variantSchema = z.object({
  color: z.string().min(1, "Color is required"),
  hex: z.string().min(1, "Hex value is required"),
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

export const postProductSchema = z.object({
  productName: stringValidation("Product name")
    .min(3, minLengthError("Product name", 3))
    .max(250, maxLengthError("Product name", 250)),
  categoryId: numberValidation("categoryId"),
  price: numberValidation("Price"),

  variants: z
    .string() // Ensure variants is treated as a string
    .transform((val) => {
      try {
        // Parse the string into a JavaScript object (array of variants)
        const parsedVariants = JSON.parse(val);
        console.log("Values ===>", parsedVariants);

        // Ensure the parsed value is an array
        if (!Array.isArray(parsedVariants)) {
          throw new Error("Variants must be an array of objects");
        }

        // Validate each variant object
        parsedVariants.forEach((variant: any) => {
          try {
            variantSchema.parse(variant);
          } catch (variantError) {
            throw new Error("Invalid variant structure");
          }
        });

        return parsedVariants;
      } catch (error) {
        throw new Error("Invalid JSON format for variants: ");
      }
    })
    .refine((val) => val.length > 0, {
      message: "At least one variant is required",
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
});

export const productParams = z.object({
  productId: numberValidation("productId"),
});
