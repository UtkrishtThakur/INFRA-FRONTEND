"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Protected from "@/components/Protected"
import Navbar from "@/components/Navbar"
import ApiKeyModal from "@/components/ApiKeyModal"
import EndpointCard from "@/components/dashboard/EndpointCard"
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton"
import ErrorBanner from "@/components/dashboard/ErrorBanner"
import EndpointDetailPanel from "@/components/dashboard/EndpointDetailPanel"
import { apiFetch } from "@/lib/api"
import { APIKey, Project, EndpointAnalysis } from "@/lib/types"
import PageTransition from "@/components/ui/PageTransition"

const GATEWAY_URL = "https://gateway.devlooper.co.in/"

export default function ProjectDetailPage() {
    const { projectId } = useParams<{ projectId: string }>()
    const router = useRouter()

    const [project, setProject] = useState<Project | null>(null)
    const [endpoints, setEndpoints] = useState<EndpointAnalysis[]>([])
    const [loadingEndpoints, setLoadingEndpoints] = useState(true)
    const [endpointError, setEndpointError] = useState(false)

    // Selection state for Detail View
    const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointAnalysis | null>(null)

    const [keyMeta, setKeyMeta] = useState<APIKey | null>(null)
    const [rawKey, setRawKey] = useState<string | null>(null)
    const [showKeyModal, setShowKeyModal] = useState(false)
    const [loadingKey, setLoadingKey] = useState(false)
    const [lastRefresh, setLastRefresh] = useState(0)

    // Initial Load
    useEffect(() => {
        if (projectId) {
            loadProject()
            loadKey()
            loadEndpoints()
        }
    }, [projectId])

    async function loadProject() {
        try {
            const res = await apiFetch(`/projects/${projectId}`)
            setProject(res)
        } catch (e) {
            console.error(e)
        }
    }

    async function loadKey() {
        try {
            const res = await apiFetch(`/projects/${projectId}/keys`)
            setKeyMeta(Array.isArray(res) ? res[0] ?? null : res)
        } catch (e) {
            console.error(e)
        }
    }

    async function loadEndpoints() {
        setLoadingEndpoints(true)
        setEndpointError(false)
        try {
            const timeRange = '1h'
            const res = await apiFetch(`/projects/${projectId}/endpoint-analysis?time_range=${timeRange}`)
            const data: EndpointAnalysis[] = Array.isArray(res) ? res : (res?.endpoints ?? [])

            const severityOrder = { HIGH: 0, WATCH: 1, NORMAL: 2 }

            const sorted = data.sort((a, b) => {
                const sevA = severityOrder[a.severity] ?? 99
                const sevB = severityOrder[b.severity] ?? 99
                if (sevA !== sevB) return sevA - sevB
                return (b.metrics?.current_rpm ?? 0) - (a.metrics?.current_rpm ?? 0)
            })

            setEndpoints(sorted)
        } catch (e) {
            console.error("Failed to load endpoints", e)
            setEndpointError(true)
        } finally {
            setLoadingEndpoints(false)
        }
    }

    async function createOrRegenerateKey() {
        const msg = keyMeta
            ? "Regenerate cluster API key? This will permanently invalidate the current key."
            : "Generate deployment API key for this cluster?"

        if (!confirm(msg)) return

        setLoadingKey(true)
        try {
            const res = await apiFetch(`/projects/${projectId}/key/regenerate`, {
                method: "POST",
            })

            const key = res.api_key || res.key || res.token

            if (!key) throw new Error("API did not return a key")

            setRawKey(key)
            setShowKeyModal(true)
            await loadKey()
        } catch (e) {
            console.error(e)
            alert("Cryptographic operation failed: " + (e instanceof Error ? e.message : "Internal system collision."))
        } finally {
            setLoadingKey(false)
        }
    }

    async function deleteProject() {
        if (!confirm("Terminate this cluster and all associated policies? This action is irreversible.")) return
        try {
            await apiFetch(`/projects/${projectId}`, { method: "DELETE" })
            router.replace("/dashboard/create")
        } catch (e) {
            console.error(e)
            alert("Failed to delete project")
        }
    }

    return (
        <Protected>
            <div className="min-h-screen bg-[#fafbfc]">
                <Navbar />

                <PageTransition>

                    <EndpointDetailPanel
                        isOpen={!!selectedEndpoint}
                        data={selectedEndpoint}
                        onClose={() => setSelectedEndpoint(null)}
                    />

                    {showKeyModal && rawKey && (
                        <ApiKeyModal apiKey={rawKey} onClose={() => { setShowKeyModal(false); setRawKey(null); }} />
                    )}

                    <div className="p-8 max-w-6xl mx-auto pb-40">
                        {/* --- Hero Section --- */}
                        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="badge-status bg-blue-500 text-white px-2">Cluster Active</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">ID: {project?.id}</span>
                                </div>
                                <h1 className="text-4xl font-black tracking-tight text-gray-900 leading-none">
                                    {project?.name || "Cluster Isolation"}
                                </h1>
                            </div>

                            <button
                                onClick={deleteProject}
                                className="btn-secondary text-red-500 border-red-100 hover:bg-red-50 hover:border-red-200"
                            >
                                Terminate Cluster
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* --- Left Column: Analytics --- */}
                            <div className="lg:col-span-2 space-y-8">
                                <section>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Inbound Endpoint Audit</h2>
                                        <button
                                            onClick={() => {
                                                const now = Date.now()
                                                if (now - lastRefresh < 5000) return
                                                setLastRefresh(now)
                                                loadEndpoints()
                                            }}
                                            disabled={loadingEndpoints}
                                            className="text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:text-blue-700 disabled:opacity-50"
                                        >
                                            {loadingEndpoints ? "Synchronizing..." : "Force Refresh"}
                                        </button>
                                    </div>

                                    {loadingEndpoints ? (
                                        <DashboardSkeleton />
                                    ) : endpointError ? (
                                        <ErrorBanner onRetry={loadEndpoints} />
                                    ) : endpoints.length === 0 ? (
                                        <div className="premium-card py-20 px-8 text-center bg-white border-dashed">
                                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167" /></svg>
                                            </div>
                                            <h3 className="text-gray-900 font-bold mb-1">Silence in the data plane.</h3>
                                            <p className="text-gray-500 text-xs max-w-[240px] mx-auto leading-relaxed">
                                                Telemetry will populate here as soon as traffic hits the gateway.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-4">
                                            {endpoints.map((ep, idx) => (
                                                <EndpointCard
                                                    key={idx}
                                                    data={ep}
                                                    onClick={() => setSelectedEndpoint(ep)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </section>
                            </div>

                            {/* --- Right Column: Infrastructure --- */}
                            <div className="space-y-8">
                                <section>
                                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 font-mono">Cluster Infrastructure</h2>

                                    <div className="space-y-6">
                                        <div className="premium-card p-6 bg-white">
                                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Inbound Logic</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Gateway Entry Point</p>
                                                    <div className="bg-gray-900 p-3 rounded-lg flex items-center justify-between group">
                                                        <span className="font-mono text-[10px] text-gray-100 truncate">{GATEWAY_URL}</span>
                                                        <button
                                                            onClick={() => navigator.clipboard.writeText(GATEWAY_URL)}
                                                            className="text-gray-400 hover:text-white transition-colors"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Deployment Key</p>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1 bg-gray-50 border border-gray-100 p-3 rounded-lg font-mono text-[10px] text-gray-600">
                                                            {keyMeta ? `sk_live_••••${keyMeta.id.slice(-4)}` : "None Provisioned"}
                                                        </div>
                                                        <button
                                                            onClick={createOrRegenerateKey}
                                                            disabled={loadingKey}
                                                            className="btn-primary py-2 px-3 text-[10px] uppercase font-bold tracking-widest whitespace-nowrap"
                                                        >
                                                            {loadingKey ? "..." : keyMeta ? "Reset" : "Create"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="premium-card p-6 bg-gray-50/50 border-gray-100">
                                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Implementation Sample (Node.js)</h3>
                                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl font-mono text-[10px] overflow-x-auto leading-relaxed shadow-lg">
                                                {`const axios = require('axios');\n\nawait axios.get('${GATEWAY_URL}v1/user', {\n  headers: {\n    'x-api-key': 'YOUR_KEY'\n  }\n});`}
                                            </pre>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </PageTransition>
            </div>
        </Protected>
    )
}
