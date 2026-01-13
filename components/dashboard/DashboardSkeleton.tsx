export default function DashboardSkeleton() {
    // Create an array of 6 items to map over
    return (
        <div className="flex flex-col gap-3 w-full">
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    className="relative flex h-24 w-full overflow-hidden rounded-lg bg-white border border-gray-100 animate-pulse"
                >
                    {/* Fake color bar */}
                    <div className="w-2 bg-gray-200 shrink-0" />

                    <div className="flex-1 p-4 flex flex-col gap-3">
                        {/* Fake Path */}
                        <div className="h-4 w-1/3 bg-gray-200 rounded" />

                        {/* Fake Summary Lines */}
                        <div className="space-y-2">
                            <div className="h-3 w-3/4 bg-gray-100 rounded" />
                            <div className="h-3 w-1/2 bg-gray-100 rounded" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
