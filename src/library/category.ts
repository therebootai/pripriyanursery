import { CategoryType } from "@/types/types";

export type CategoryUI = {
  parent: {
    id: string;
    name: string;
    image: string;
  };
  subCategories: {
    id?: string;
    name: string;
    image: string;
  }[];
};

export async function fetchCategories(): Promise<CategoryUI[]> {
  const res = await fetch("http://localhost:8000/api/category?limit=10&page=1", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const json = await res.json();
  // console.log(json);
  const categories: CategoryType[] = json.categories || [];
  // console.log("fetched categories:", categories);

  const grouped: CategoryUI[] = [];

  for (const parent of categories) {
    const subCategories = (parent.children || [])
      .filter(
        (child) =>
          child.type?.toLowerCase() === "sub" &&
          child.name &&
          child.status !== false
      )
      .map((child) => ({
        id: child.id,
        name: child.name!,
        image:
          child.image?.url ||
          parent.image?.url ||
          "/assets/home/category/plants.png",
      }));

      grouped.push({
        parent: {
          id: parent.categoryId,
          name: parent.name,
          image: parent.image?.url || "/assets/home/category/plants.png",
        },
        subCategories,
      });
  }

  // console.log("grouped categories:", grouped);

  return grouped;
}


