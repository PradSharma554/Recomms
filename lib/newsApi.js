const NEWS_API_KEY = process.env.NEWS_API_KEY;
const BASE_URL = "https://newsapi.org/v2";

export const CATEGORIES = [
  "nutrition",
  "technology",
  "sports",
  "politics",
  "general", // 'geopolitics' isn't a standard NewsAPI category, mapping to general or we can search query
  "science", // 'archeology' isn't standard, mapping to science or query
];

// Mapping user friendly categories to API params
const CATEGORY_MAP = {
  nutrition: { category: "health", q: "nutrition" },
  technology: { category: "technology" },
  sports: { category: "sports" },
  politics: { category: "general", q: "politics" },
  geopolitics: { category: "general", q: "geopolitics" },
  archeology: { category: "science", q: "archeology" },
};

export async function fetchNewsByCategory(category) {
  if (!NEWS_API_KEY) {
    console.warn("NEWS_API_KEY is not defined");
    return [];
  }

  const config = CATEGORY_MAP[category] || { category: "general" };

  let url = `${BASE_URL}/top-headlines?country=us&apiKey=${NEWS_API_KEY}`;

  // If we have a specific query 'q', use 'everything' or stick to top-headlines with q?
  // top-headlines supports 'category'. 'everything' does NOT support 'category' param same way (it filters by source).
  // But top-headlines with 'q' is allowed.

  if (config.category) {
    url += `&category=${config.category}`;
  }

  if (config.q) {
    url += `&q=${config.q}`;
  }

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour

    if (!res.ok) {
      throw new Error(`Failed to fetch news: ${res.statusText}`);
    }

    const data = await res.json();
    return data.articles || [];
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}
