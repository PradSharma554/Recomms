import NewsCard from './NewsCard';

export default function NewsList({ news }) {
    if (!news || news.length === 0) {
        return (
            <div className="flex h-64 w-full flex-col items-center justify-center text-center text-gray-500">
                <p className="text-lg font-medium">No articles found</p>
                <p className="text-sm">Try checking a different category or come back later.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((article) => (
                <NewsCard key={article.url} article={article} />
            ))}
        </div>
    );
}
