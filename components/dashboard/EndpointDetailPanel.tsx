import { EndpointAnalysis } from "@/lib/types"

interface EndpointDetailPanelProps {
    data: EndpointAnalysis | null
    isOpen: boolean
    onClose: () => void
}

export default function EndpointDetailPanel({
    data,
    isOpen,
    onClose,
}: EndpointDetailPanelProps) {
    if (!isOpen || !data) return null

    const severityColors = {
        NORMAL: "bg-green-100 text-green-800 border-green-200",
        WATCH: "bg-yellow-100 text-yellow-800 border-yellow-200",
        HIGH: "bg-red-100 text-red-800 border-red-200",
    }

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

                <div className="p-6 md:p-8 space-y-8">

                    {/* Section 1 - Header */}
                    <div className="space-y-4 pt-4">
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                            API Endpoint
                        </div>
                        <h2 className="text-xl font-mono break-all font-semibold text-gray-900">
                            {data.endpoint}
                        </h2>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${severityColors[data.severity] || "bg-gray-100 text-gray-800"}`}>
                            {data.severity}
                        </span>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Section 2 - What's Happening Now */}
                    <section>
                        <h3 className="text-sm uppercase tracking-wide text-gray-500 font-semibold mb-4">
                            What&apos;s Happening Now
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            <StatBox label="Current RPM" value={(data.metrics?.current_rpm ?? 0).toString()} />
                            <StatBox label="Throttle" value={`${((data.metrics?.throttle_rate ?? 0) * 100).toFixed(1)}%`} highlight={(data.metrics?.throttle_rate ?? 0) > 0} />
                            <StatBox label="Block" value={`${((data.metrics?.block_rate ?? 0) * 100).toFixed(1)}%`} highlight={(data.metrics?.block_rate ?? 0) > 0} />
                        </div>
                    </section>

                    {/* Section 3 - Baseline Comparison */}
                    <section>
                        <h3 className="text-sm uppercase tracking-wide text-gray-500 font-semibold mb-4">
                            Baseline Comparison
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Baseline RPM</span>
                                <span className="font-mono font-medium">{data.metrics?.baseline_rpm ?? 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Traffic Multiplier</span>
                                <span className="font-mono font-medium">{data.metrics?.traffic_multiplier ? `${data.metrics.traffic_multiplier}x` : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Avg Risk Score</span>
                                <span className="font-mono text-gray-500">{data.metrics?.avg_risk_score != null ? data.metrics.avg_risk_score.toFixed(2) : 'N/A'}</span>
                            </div>
                        </div>
                    </section>

                    {/* Section 4 - Explanation */}
                    <section>
                        <h3 className="text-sm uppercase tracking-wide text-gray-500 font-semibold mb-4">
                            Analysis
                        </h3>
                        <p className="text-gray-900 leading-relaxed text-lg">
                            {data.summary}
                        </p>
                    </section>

                    {/* Section 5 & 6 - Actions */}
                    <section className="space-y-4">
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                            <h4 className="text-blue-900 text-sm font-semibold mb-1">
                                SecureX Action
                            </h4>
                            <p className="text-blue-800 text-sm">
                                {data.securex_action}
                            </p>
                        </div>

                        {data.suggested_action && (
                            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                <h4 className="text-gray-900 text-sm font-semibold mb-1">
                                    Suggested Action
                                </h4>
                                <p className="text-gray-700 text-sm">
                                    {data.suggested_action}
                                </p>
                            </div>
                        )}
                    </section>

                </div>
            </div>
        </div>
    )
}

function StatBox({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className={`p-3 rounded-lg border ${highlight ? "bg-red-50 border-red-100" : "bg-white border-gray-100"} text-center`}>
            <div className={`text-2xl font-bold mb-1 ${highlight ? "text-red-600" : "text-gray-900"}`}>
                {value}
            </div>
            <div className="text-xs text-gray-500 font-medium uppercase">
                {label}
            </div>
        </div>
    )
}
