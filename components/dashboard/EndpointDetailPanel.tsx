import { EndpointAnalysis } from "@/lib/types"

export default function EndpointDetailPanel({
    isOpen,
    data,
    onClose,
}: {
    isOpen: boolean
    data: EndpointAnalysis | null
    onClose: () => void
}) {
    if (!isOpen || !data) return null

    return (
        <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 animate-in fade-in"
                onClick={onClose}
            ></div>

            {/* Panel */}
            <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
                <header className="px-8 py-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="badge-status bg-gray-100 text-gray-600 px-2 font-mono uppercase">Audit Log</span>
                            <span className={`badge-status ${data.severity === 'HIGH' ? 'bg-red-500 text-white' : data.severity === 'WATCH' ? 'bg-amber-500 text-white' : 'bg-green-500 text-white'} px-2 font-bold uppercase`}>
                                {data.severity}
                            </span>
                        </div>
                        <h2 className="text-xl font-mono font-bold tracking-tight text-gray-900 truncate max-w-md">
                            {data.endpoint}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-8 space-y-12">
                    {/* Performance Metrics */}
                    <section>
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">Real-time Performance Metrics</h3>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="premium-card p-5 bg-gray-50/50">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Throughput</p>
                                <p className="text-2xl font-bold tracking-tighter text-gray-900">
                                    {data.metrics?.current_rpm?.toFixed(1) || "0.0"} <span className="text-[10px] font-medium text-gray-400">RPM</span>
                                </p>
                            </div>

                            <div className="premium-card p-5 bg-gray-50/50">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Throttle</p>
                                <p className={`text-2xl font-bold tracking-tighter ${data.metrics?.throttle_rate > 0 ? 'text-amber-500' : 'text-gray-900'}`}>
                                    {Math.round((data.metrics?.throttle_rate || 0) * 100)}<span className="text-[10px] font-medium text-gray-400">%</span>
                                </p>
                            </div>

                            <div className="premium-card p-5 bg-gray-50/50">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Block Rate</p>
                                <p className={`text-2xl font-bold tracking-tighter ${data.metrics?.block_rate > 0 ? 'text-red-500' : 'text-gray-900'}`}>
                                    {Math.round((data.metrics?.block_rate || 0) * 100)}<span className="text-[10px] font-medium text-gray-400">%</span>
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Analysis Summary */}
                    <section>
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Heuristic Analysis</h3>
                        <div className="p-6 rounded-2xl bg-gray-900 text-gray-100 shadow-xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -mr-16 -mt-16 rounded-full"></div>
                            <p className="text-lg font-medium leading-relaxed relative z-10">
                                {data.summary}
                            </p>
                        </div>
                    </section>

                    {/* Action & Suggestion */}
                    <section className="space-y-6">
                        <div className="flex flex-col gap-4">
                            <div className="p-5 rounded-xl border border-blue-100 bg-blue-50/30">
                                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2">Autonomous Response</p>
                                <p className="text-sm font-bold text-gray-900">{data.securex_action}</p>
                            </div>

                            {data.suggested_action && (
                                <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Human-in-the-Loop Recommendation</p>
                                    <p className="text-sm text-gray-800">{data.suggested_action}</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Observability Payload */}
                    <section className="bg-gray-50 -mx-8 px-8 py-10 border-y border-gray-100">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">Diagnostic Payload</h3>
                        <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Baseline Volume</p>
                                <p className="font-mono text-xs text-gray-900 font-bold">{data.metrics?.baseline_rpm} RPM</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Traffic Multiplier</p>
                                <p className="font-mono text-xs text-gray-900 font-bold">{data.metrics?.traffic_multiplier.toFixed(2)}x</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Avg Risk Score</p>
                                <p className="font-mono text-xs text-gray-900 font-bold">{data.metrics?.avg_risk_score.toFixed(4)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                <p className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full inline-block ${data.severity === 'NORMAL' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {data.severity === 'NORMAL' ? 'Operational' : 'Under Observation'}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                <footer className="px-8 py-6 border-t border-gray-100 bg-gray-50/50">
                    <button className="btn-primary w-full py-3">Override Deployment Policy</button>
                </footer>
            </div>
        </div>
    )
}
