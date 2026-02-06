import Skeleton from "../ui/Skeleton"

export default function DashboardSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {[1, 2, 3].map((i) => (
                <div key={i} className="premium-card p-6 h-48 border border-gray-100 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-2 w-2 rounded-full" />
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-8 w-full" />
                        </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                </div>
            ))}
        </div>
    )
}
