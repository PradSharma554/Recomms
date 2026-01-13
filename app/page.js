import { fetchNewsByCategory } from "@/lib/newsApi";
import { auth } from "@/lib/auth"; // Import auth
import CategoryTabs from "@/components/CategoryTabs";
import NewsList from "@/components/NewsList";
import Link from "next/link";

// Force dynamic rendering since we are fetching external data and using auth
export const dynamic = "force-dynamic";

export default async function Home(props) {
  const searchParams = await props.searchParams;
  const category = searchParams?.category || "nutrition";
  const news = await fetchNewsByCategory(category);
  const session = await auth();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-black/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Recomms
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link
                  href="/library"
                  className="text-sm font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
                >
                  My Library
                </Link>
                <div className="h-8 w-8 overflow-hidden rounded-full border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      session.user.image ||
                      `https://ui-avatars.com/api/?name=${session.user.name}`
                    }
                    alt={session.user.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <Link
                  href="/api/auth/signout"
                  className="text-sm font-medium text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  Logout
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                Login
              </Link>
            )}
          </div>
        </div>
        <CategoryTabs />
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold capitalize text-gray-900 dark:text-white">
            {category} News
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Latest updates and top headlines in {category}.
          </p>
        </div>

        <NewsList news={news} />
      </main>
    </div>
  );
}
