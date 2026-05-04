import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://vhlafnxhkalzwzlcbidq.supabase.co/functions/v1/paisaads-api";

async function fetchLineAds() {
  try {
    const res = await fetch(`${API_BASE}/line-ad/today`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function fetchPosterAds() {
  try {
    const res = await fetch(`${API_BASE}/poster-ad/today`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories/tree`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function Home() {
  const [lineAds, posterAds, categories] = await Promise.all([
    fetchLineAds(),
    fetchPosterAds(),
    fetchCategories(),
  ]);

  const mainCategories = categories.map((c: any) => c.name).filter(Boolean);

  return (
    <div>
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Find What You Need
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Search through thousands of classified advertisements across Real Estate, Vehicles, Electronics, Jobs and more.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/search"
              className="inline-flex items-center justify-center rounded-lg bg-white text-slate-900 px-6 py-3 text-sm font-semibold shadow-lg hover:bg-slate-100 transition-colors"
            >
              Browse Ads
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white/30 text-white px-6 py-3 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              Post an Ad
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse by Category</h2>
          <div className="flex flex-wrap gap-2">
            {mainCategories.map((name: string) => (
              <Link
                key={name}
                href={`/search?categoryId=&search=${encodeURIComponent(name)}`}
                className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
              >
                {name}
              </Link>
            ))}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Latest Advertisements</h2>

        {lineAds.length > 0 ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {lineAds.map((ad: any) => (
              <div
                key={ad.id}
                className="break-inside-avoid rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                style={{
                  backgroundColor: ad.backgroundColor || ad.background_color || "#ffffff",
                  color: ad.textColor || ad.text_color || "#000000",
                }}
              >
                <div className="p-4">
                  <div className="flex flex-wrap gap-x-2 gap-y-1 mb-3 text-xs opacity-80">
                    {[ad.mainCategory || ad.main_category, ad.categoryOne || ad.category_one, ad.categoryTwo || ad.category_two, ad.categoryThree || ad.category_three]
                      .filter(Boolean)
                      .map((cat: any, idx: number, arr: any[]) => (
                        <span key={idx}>
                          {cat?.name || cat}
                          {idx < arr.length - 1 && <span className="mx-1">|</span>}
                        </span>
                      ))}
                  </div>
                  <p className="text-sm mb-3 text-justify">{ad.content}</p>
                  <div className="space-y-1 text-xs opacity-80">
                    {(ad.postedBy || ad.posted_by) && (
                      <div className="flex items-center gap-1">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        <span>Posted by: {ad.postedBy || ad.posted_by}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <span>{ad.city}, {ad.state}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No advertisements available today.</p>
          </div>
        )}

        {posterAds.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Poster Ads</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {posterAds.map((ad: any) => (
                <div
                  key={ad.id}
                  className="rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <div className="text-center p-4">
                      <div className="text-3xl mb-2">📢</div>
                      <p className="text-sm text-gray-600 font-medium">
                        {(ad.mainCategory || ad.main_category)?.name || "Ad"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{ad.city}, {ad.state}</p>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex flex-wrap gap-1 text-xs">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600">
                        {(ad.mainCategory || ad.main_category)?.name}
                      </span>
                      {(ad.categoryOne || ad.category_one)?.name && (
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600">
                          {(ad.categoryOne || ad.category_one).name}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Posted by: {ad.postedBy || ad.posted_by}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/search" className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow text-center">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900">Search Ads</h3>
            <p className="text-sm text-gray-500 mt-1">Browse thousands of classified ads by category, city, or keyword.</p>
          </Link>
          <Link href="/register" className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow text-center">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="text-lg font-semibold text-gray-900">Post an Ad</h3>
            <p className="text-sm text-gray-500 mt-1">Create your own advertisement and reach thousands of viewers.</p>
          </Link>
          <Link href="/about-us" className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow text-center">
            <div className="text-3xl mb-3">ℹ️</div>
            <h3 className="text-lg font-semibold text-gray-900">About PaisaAds</h3>
            <p className="text-sm text-gray-500 mt-1">Learn more about India&apos;s leading classified ads platform.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
