export default function Skeleton({ className }: { className?: string }) {
    return (
        <div className={`animate-shimmer bg-gray-100 rounded-md ${className || ""}`}></div>
    )
}
