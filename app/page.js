import { fetchNewsByCategory } from "@/lib/newsApi";
import { auth } from "@/lib/auth"; // Import auth
import CategoryTabs from "@/components/CategoryTabs";
import NewsList from "@/components/NewsList";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Force dynamic rendering since we are fetching external data and using auth
export const dynamic = "force-dynamic";

export default async function Home(props) {
  const searchParams = await props.searchParams;
  const category = searchParams?.category || "nutrition";
  const news = await fetchNewsByCategory(category);
  const session = await auth();

  // const time = session?.expires
  //   ? new Date(session.expires).toLocaleString()
  //   : null;

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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.user.image}
                        alt={session.user.name}
                      />
                      <AvatarFallback>
                        {session.user.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session.user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/library">My Library</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/api/auth/signout">Log out</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="default">
                <Link href="/login">Login</Link>
              </Button>
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
