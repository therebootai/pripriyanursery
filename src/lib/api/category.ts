export type CategoryUI = {
  id: string;
  name: string;
  image: {
    public_id: string;
    url: string;
  };
  categoryId: string;
};

export async function fetchCategories(): Promise<CategoryUI[]> {
  const res = await fetch("http://localhost:8000/api/category", {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch categories")
  }

  const json = await res.json()

  const categories = Array.isArray(json)
    ? json
    : json.categories || []

  return categories.map((cat: CategoryUI) => ({
    id: cat.id,
    name: cat.name,
    image: cat.image?.url || "/assets/home/category/plants.png",
    categoryId: cat.categoryId,
  }));
}
