'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { format } from 'date-fns';

export default function NewsCard({ article }) {
    const { data: session } = useSession();
    const [isSaved, setIsSaved] = useState(false); // In a real app, check DB init state
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!session) {
            alert('Please login to save articles');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/articles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    article,
                    action: isSaved ? 'unsave' : 'save'
                })
            });

            if (res.ok) {
                setIsSaved(!isSaved);
            }
        } catch (error) {
            console.error('Failed to save', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
            {article.urlToImage && (
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                </div>
            )}
            <div className="flex flex-1 flex-col p-4">
                <div className="mb-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{article.source.name}</span>
                    <span>{format(new Date(article.publishedAt), 'dd/MM/yyyy')}</span>
                </div>
                <h3 className="mb-2 text-lg font-bold leading-tight text-gray-900 line-clamp-2 dark:text-gray-100">
                    <a href={article.url} target="_blank" rel="noreferrer" className="hover:underline">
                        {article.title}
                    </a>
                </h3>
                <p className="mb-4 flex-1 text-sm text-gray-600 line-clamp-3 dark:text-gray-300">
                    {article.description}
                </p>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                    <a
                        href={article.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        Read More →
                    </a>

                    {session && (
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${isSaved
                                ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                                }`}
                        >
                            {loading ? '...' : isSaved ? 'Saved' : 'Save'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
