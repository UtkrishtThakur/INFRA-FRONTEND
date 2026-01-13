interface ErrorBannerProps {
    onRetry: () => void
}

export default function ErrorBanner({ onRetry }: ErrorBannerProps) {
    return (
        <div className="w-full bg-red-50 border border-red-200 rounded-lg p-6 flex flex-col items-center justify-center text-center gap-4">
            <h3 className="text-red-800 font-medium text-lg">
                Unable to load endpoint analysis.
            </h3>
            <p className="text-red-600">
                Please check your connection or try again.
            </p>
            <button
                onClick={onRetry}
                className="mt-2 bg-white text-red-700 border border-red-300 px-4 py-2 rounded-md font-medium hover:bg-red-50 transition-colors shadow-sm"
            >
                Retry
            </button>
        </div>
    )
}
