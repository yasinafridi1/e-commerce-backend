import { z } from "zod";
import { stringValidation } from "./commonSchema";

export const categorySchema = z.object({
  title: stringValidation("Category title")
    .min(1, "Title must be atleast 1 character")
    .max(25, "Title must not exceed 25 character"),
});

export const categoryParams = z.object({
  categoryId: z
    .number({ required_error: "Category id is required" })
    .min(1, "Category id must be greater than 0"),
});
