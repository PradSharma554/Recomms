import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Collection from "@/models/Collection";
import CollectionArticle from "@/models/CollectionArticle";
import Article from "@/models/Article"; // Ensure Article model is registered
import Link from "next/link";
import NewsList from "@/components/NewsList";

export const dynamic = "force-dynamic";

export default async function CollectionPage(props) {
  const session = await auth();
  const { id } = await props.params;

  if (!session) {
    return <div className="p-8">Please login</div>;
  }

  await connectToDatabase();

  const collection = await Collection.findOne({
    _id: id,
    userId: session.user.id,
  });

  if (!collection) {
    return <div className="p-8">Collection not found</div>;
  }

  const collectionArticles = await CollectionArticle.find({
    collectionId: id,
  }).populate("articleId");

  // Clean up potential nulls if articles were deleted but mapping remaining
  const news = collectionArticles.map((ca) => ca.articleId).filter(Boolean);

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-black sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/library"
              className="mb-2 block text-sm text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
            >
              &larr; Back to Library
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {collection.name}
            </h1>
            <p className="text-gray-500">{news.length} articles</p>
          </div>
        </div>

        <NewsList news={news} />
      </div>
    </div>
  );
}
