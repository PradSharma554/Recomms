import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Collection from "@/models/Collection";
import Link from "next/link";
import CreateCollectionButton from "@/components/CreateCollectionButton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

// Force dynamic since we read user session and DB
export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const session = await auth();

  if (!session) {
    // ... rest content ...

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
          <CreateCollectionButton />

          {collections.map((col) => (
            <Link
              key={col._id}
              href={`/collections/${col._id}`}
              className="block h-full"
            >
              <Card className="h-full transition-shadow hover:shadow-md flex flex-col justify-between">
                <CardHeader>
                  <CardTitle className="line-clamp-1">{col.name}</CardTitle>
                  <CardDescription>
                    Created {new Date(col.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="text-sm font-medium text-primary">
                  View Articles &rarr;
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
