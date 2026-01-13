'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const categories = [
    'nutrition',
    'technology',
    'sports',
    'politics',
    'geopolitics',
    'archeology',
];

export default function CategoryTabs() {
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category') || 'nutrition';

    function cn(...inputs) {
        return twMerge(clsx(inputs));
    }

    return (
        <div className="w-full overflow-x-auto pb-4 pt-2 no-scrollbar">
            <div className="flex space-x-2 px-4">
                {categories.map((cat) => (
                    <Link
                        key={cat}
                        href={`/?category=${cat}`}
                        className={cn(
                            "inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                            currentCategory === cat
                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        )}
                    >
                        {cat}
                    </Link>
                ))}
            </div>
        </div>
    );
}
