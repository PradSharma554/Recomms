import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Collection from "@/models/Collection";
import CollectionArticle from "@/models/CollectionArticle";
import Article from "@/models/Article";
import Link from "next/link";

// Force dynamic since we read user session and DB
export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-zinc-50 dark:bg-black">
        <h1 className="text-2xl font-bold dark:text-white">Access Denied</h1>
        <p className="text-gray-500">Please login to view your library</p>
        <Link
          href="/login"
          className="rounded-lg bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
        >
          Login
        </Link>
      </div>
    );
  }

  await connectToDatabase();

  const collections = await Collection.find({ userId: session.user.id }).lean();

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-black sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Library
          </h1>
          <Link
            href="/"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            &larr; Back to News
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex h-48 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-transparent p-6 text-center hover:border-gray-400 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900">
            <button className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
            <span className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Create Collection
            </span>
          </div>

          {collections.map((col) => (
            <Link
              key={col._id}
              href={`/collections/${col._id}`}
              className="flex h-48 flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {col.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(col.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                View Articles &rarr;
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
