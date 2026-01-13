import { EndpointAnalysis } from "@/lib/types"

interface EndpointCardProps {
    data: EndpointAnalysis
    onClick: () => void
}

export default function EndpointCard({ data, onClick }: EndpointCardProps) {
    const colorMap = {
        green: "bg-green-500",
        yellow: "bg-yellow-500",
        red: "bg-red-500",
    }

    // Using a subtle border and shadow for the card
    return (
        <div
            onClick={onClick}
            className="group relative flex overflow-hidden rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
            {/* Left Color Bar */}
            <div className={`w-2 shrink-0 ${colorMap[data.color]}`} />

            <div className="flex-1 p-4">
                <div className="flex flex-col gap-1">
                    {/* Path - Monospace */}
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-sm text-gray-900 font-medium">
                            {data.endpoint}
                        </span>
                        {/* Optional: We could show basic metrics here if needed, but requirements say specific layout */}
                    </div>

                    {/* Summary Sentence */}
                    <p className="text-gray-600 text-sm leading-relaxed">
                        {data.summary}
                    </p>
                </div>
            </div>
        </div>
    )
}
