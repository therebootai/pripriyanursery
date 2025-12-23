export type CategoryUI = {
  id: string
  name: string
  image: string
  slug: string
}

export async function fetchCategories(): Promise<CategoryUI[]> {
  const res = await fetch("http://localhost:8000/api/category", {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch categories")
  }

  const json = await res.json()

  // 🔥 VERY IMPORTANT FIX
  const categories = Array.isArray(json)
    ? json
    : json.data || json.categories || []

  return categories.map((cat: any) => ({
    id: cat._id,
    name: cat.name,
    image: cat.image?.url || "/assets/home/category/plants.png",
    slug: cat.categoryId,
  }))
}
