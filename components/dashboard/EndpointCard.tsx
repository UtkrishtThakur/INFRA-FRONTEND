import { EndpointAnalysis } from "@/lib/types"

export default function EndpointCard({
    data,
    onClick,
}: {
    data: EndpointAnalysis
    onClick: () => void
}) {
    const severityColors = {
        HIGH: "bg-red-500",
        WATCH: "bg-amber-500",
        NORMAL: "bg-green-500",
    }

    return (
        <div
            onClick={onClick}
            className="premium-card p-6 flex flex-col md:flex-row justify-between items-center gap-6 cursor-pointer group hover:scale-[1.01]"
        >
            <div className="flex items-center gap-4 w-full md:w-auto">
                <div className={`w-2 h-10 rounded-full ${severityColors[data.severity]} opacity-80 shrink-0`}></div>
                <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-mono text-xs font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                            {data.endpoint}
                        </h3>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-snug line-clamp-1">
                        {data.summary}
                    </p>
                </div>
            </div>

            <div className="flex gap-10 w-full md:w-auto justify-between md:justify-end items-center">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Throughput</p>
                    <p className="text-xl font-bold tracking-tighter text-gray-900 text-right">
                        {data.metrics?.current_rpm?.toFixed(1) || "0.0"} <span className="text-[10px] text-gray-400">RPM</span>
                    </p>
                </div>

                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Control Action</p>
                    <p className={`text-[10px] font-black uppercase tracking-widest p-1.5 rounded text-right ${data.metrics?.throttle_rate > 0 ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-500'}`}>
                        {data.metrics?.throttle_rate > 0 ? `DEGRADED ${Math.round(data.metrics.throttle_rate * 100)}%` : "NOMINAL"}
                    </p>
                </div>

                <div className="btn-secondary py-1.5 px-3 text-[10px] uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Inspect
                </div>
            </div>
        </div>
    )
}
