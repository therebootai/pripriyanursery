"use client";

import { createResourceContext } from "./createResourceContext";
import { CategoryUI, fetchCategories } from "@/library/category";

const { Provider: CategoryProvider, useResource: useCategoryBase } =
  createResourceContext<CategoryUI[]>(fetchCategories);

export const useCategories = () => {
  const ctx = useCategoryBase();

  return {
    categories: ctx.data,
    loading: ctx.loading,
    refreshCategories: ctx.refresh,
  };
};

export { CategoryProvider };
