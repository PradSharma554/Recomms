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
        <div className="flex flex-col h-full">
            <div className="relative h-48 w-full overflow-hidden rounded-t-xl bg-muted">
                {article.urlToImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        No Image
                    </div>
                )}
                <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center rounded-md border bg-black/50 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                        {article.source.name}
                    </span>
                </div>
            </div>
            <div className="flex flex-1 flex-col rounded-b-xl border border-t-0 bg-card text-card-foreground shadow-sm p-6">
                <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{format(new Date(article.publishedAt), 'dd/MM/yyyy')}</span>
                </div>
                <h3 className="mb-2 text-lg font-bold leading-tight tracking-tight line-clamp-2 hover:underline">
                    <a href={article.url} target="_blank" rel="noreferrer">
                        {article.title}
                    </a>
                </h3>
                <p className="mb-4 flex-1 text-sm text-muted-foreground line-clamp-3">
                    {article.description}
                </p>

                <div className="mt-auto flex items-center justify-between pt-4">
                    <a
                        href={article.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-primary hover:underline h-9 px-0 py-2"
                    >
                        Read More →
                    </a>

                    {session && (
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 ${isSaved
                                ? "bg-green-100 text-green-900 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                                : "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
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
