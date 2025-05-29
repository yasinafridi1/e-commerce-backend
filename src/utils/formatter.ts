import { RawProductVariant } from "../types";

export function formatProductVariant(
  data: RawProductVariant[],
  images: Express.Multer.File[]
) {
  for (let variant of data) {
    for (let size of variant.sizes) {
      const matchedFile = images.find((f) => {
        return f.originalname === size.image;
      });

      if (matchedFile) {
        size.image = matchedFile.filename;
      }
    }
  }
}
