export default function DashboardSkeleton() {
    return (
        <div className="flex flex-col gap-4 w-full">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                    key={i}
                    className="premium-card p-6 flex flex-col md:flex-row justify-between items-center gap-6"
                >
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="w-10 h-10 rounded-lg bg-gray-50 animate-shimmer shrink-0"></div>
                        <div className="space-y-2 w-full min-w-[200px]">
                            <div className="h-4 bg-gray-50 rounded w-3/4 animate-shimmer"></div>
                            <div className="h-3 bg-gray-50 rounded w-1/2 animate-shimmer"></div>
                        </div>
                    </div>

                    <div className="flex gap-8 w-full md:w-auto justify-between md:justify-end items-center">
                        <div className="space-y-2">
                            <div className="h-3 bg-gray-50 rounded w-12 animate-shimmer"></div>
                            <div className="h-5 bg-gray-50 rounded w-16 animate-shimmer"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-3 bg-gray-50 rounded w-12 animate-shimmer"></div>
                            <div className="h-5 bg-gray-50 rounded w-16 animate-shimmer"></div>
                        </div>
                        <div className="w-24 h-8 bg-gray-50 rounded-lg animate-shimmer"></div>
                    </div>
                </div>
            ))}
        </div>
    )
}
