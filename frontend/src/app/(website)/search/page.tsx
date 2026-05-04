import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://vhlafnxhkalzwzlcbidq.supabase.co/functions/v1/paisaads-api";

async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories/tree`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function fetchSlogan() {
  try {
    const res = await fetch(`${API_BASE}/configurations/search-slogan`, { next: { revalidate: 300 } });
    if (!res.ok) return { primarySlogan: "Find What You Need", secondarySlogan: "Search through thousands of classified advertisements" };
    return await res.json();
  } catch {
    return { primarySlogan: "Find What You Need", secondarySlogan: "Search through thousands of classified advertisements" };
  }
}

function flattenCategories(categories: any[]): any[] {
  let result: any[] = [];
  categories.forEach((category) => {
    result.push({ id: category.id, name: category.name });
    if (category.children && category.children.length > 0) {
      result = [...result, ...flattenCategories(category.children)];
    }
  });
  return result;
}

export default async function SearchPage() {
  const [categories, sloganData] = await Promise.all([
    fetchCategories(),
    fetchSlogan(),
  ]);

  const flatCategories = flattenCategories(categories);

  return (
    <div className="pt-20 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8">
          {sloganData.primarySlogan || "Find What You Need"}
        </h1>

        <p className="text-lg md:text-xl text-gray-600 mb-12">
          {sloganData.secondarySlogan || "Search through thousands of classified advertisements"}
        </p>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 max-w-5xl mx-auto">
          <form action="/search/results" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="categoryId"
                  className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="">All Categories</option>
                  {flatCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  placeholder="Enter state"
                  className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="Enter city"
                  className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                />
              </div>

              <button
                type="submit"
                className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {categories.map((cat: any) => (
            <Link
              key={cat.id}
              href={`/search/results?search=${encodeURIComponent(cat.name)}`}
              className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
