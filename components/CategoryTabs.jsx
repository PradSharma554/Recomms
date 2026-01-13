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
        <div className="w-full overflow-x-auto pb-4 pt-2">
            <div className="flex space-x-2 px-4">
                {categories.map((cat) => (
                    <Link
                        key={cat}
                        href={`/?category=${cat}`}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-colors",
                            currentCategory === cat
                                ? "bg-black text-white dark:bg-white dark:text-black"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        )}
                    >
                        {cat}
                    </Link>
                ))}
            </div>
        </div>
    );
}
