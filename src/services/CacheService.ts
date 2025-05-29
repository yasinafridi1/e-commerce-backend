import NodeCache from "node-cache";
import { CACHE_KEYS } from "../config/Constants";
import { CategoryData } from "../types";
const cache = new NodeCache({ stdTTL: 0 });

export function setCategoryCache(data: CategoryData[] | []) {
  const structuredData = data.map((item: CategoryData) => {
    return {
      categoryId: item.categoryId,
      title: item.title,
    };
  });

  cache.set(CACHE_KEYS.allCategories, structuredData);
}

export function removeCache(key: string) {
  cache.del(key);
}

export function getFromCache(key: string) {
  return cache.get(key);
}
