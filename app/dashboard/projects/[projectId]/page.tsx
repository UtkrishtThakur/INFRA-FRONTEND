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
            const res: EndpointAnalysis[] = await apiFetch(`/projects/${projectId}/endpoint-analysis`)

            // Client-side sorting as per rules: 
            // 1. Severity (HIGH -> WATCH -> NORMAL)
            // 2. Request Volume (descending)
            const severityOrder = { HIGH: 0, WATCH: 1, NORMAL: 2 }

            const sorted = res.sort((a, b) => {
                const sevA = severityOrder[a.severity] ?? 99
                const sevB = severityOrder[b.severity] ?? 99
                if (sevA !== sevB) return sevA - sevB
                return b.request_volume - a.request_volume
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
            ? "Regenerate API key? Old key will stop working."
            : "Create API key?"

        if (!confirm(msg)) return

        setLoadingKey(true)
        try {
            const res = await apiFetch(`/projects/${projectId}/key/regenerate`, {
                method: "POST",
            })

            const key = res.api_key || res.key || res.token

            if (!key) {
                throw new Error("API did not return a key")
            }

            setRawKey(key)
            setShowKeyModal(true)
            await loadKey()
        } catch (e) {
            console.error(e)
            alert("Failed to generate API key: " + (e instanceof Error ? e.message : "Unknown error"))
        } finally {
            setLoadingKey(false)
        }
    }

    function closeKeyModal() {
        setShowKeyModal(false)
        setRawKey(null)
    }

    async function deleteProject() {
        if (!confirm("Delete this project? This cannot be undone.")) return
        await apiFetch(`/projects/${projectId}`, { method: "DELETE" })
        router.replace("/dashboard")
    }

    return (
        <Protected>
            <Navbar />

            <EndpointDetailPanel
                isOpen={!!selectedEndpoint}
                data={selectedEndpoint}
                onClose={() => setSelectedEndpoint(null)}
            />

            {showKeyModal && rawKey && (
                <ApiKeyModal apiKey={rawKey} onClose={closeKeyModal} />
            )}

            <div className="p-6 max-w-3xl mx-auto pb-40">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{project?.name || "Project"}</h1>
                        <p className="text-sm text-gray-500 font-mono mt-1">{project?.id}</p>
                    </div>

                    <button
                        onClick={deleteProject}
                        className="text-gray-400 px-3 py-1.5 hover:text-red-600 hover:bg-red-50 rounded text-sm transition-colors"
                    >
                        Delete Project
                    </button>
                </div>

                {/* --- Main Section: Endpoint Analysis --- */}
                <section className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-semibold text-lg">Endpoint Analysis</h2>
                        {/* Optional refresh button, not strictly required but good for ux */}
                        <button
                            onClick={loadEndpoints}
                            disabled={loadingEndpoints}
                            className="text-sm text-gray-500 hover:text-black disabled:opacity-50"
                        >
                            Refresh
                        </button>
                    </div>

                    {loadingEndpoints ? (
                        <DashboardSkeleton />
                    ) : endpointError ? (
                        <ErrorBanner onRetry={loadEndpoints} />
                    ) : endpoints.length === 0 ? (
                        // Empty State
                        <div className="text-center py-12 px-4 rounded-lg bg-gray-50 border border-gray-100 mb-8">
                            <h3 className="text-gray-900 font-medium mb-2">No traffic recorded yet.</h3>
                            <p className="text-gray-500 max-w-sm mx-auto text-sm leading-relaxed">
                                Once requests start flowing through SecureX, endpoint analysis will appear here automatically.
                            </p>
                        </div>
                    ) : (
                        // List
                        <div className="flex flex-col gap-3">
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

                {/* --- Connection Info --- */}
                <section className="border-t border-gray-100 pt-8 mt-12">
                    <h2 className="font-semibold text-lg mb-6">Connection Details</h2>

                    {/* Gateway Info */}
                    <div className="bg-white border border-gray-200 p-6 rounded-lg mb-4 shadow-sm">
                        <h2 className="text-sm font-semibold text-gray-900 mb-2">Gateway Endpoint</h2>
                        <p className="text-sm text-gray-500 mb-3">
                            Send all API requests to this URL:
                        </p>
                        <pre className="bg-gray-50 border border-gray-100 p-3 rounded font-mono text-sm text-gray-800 break-all">
                            {GATEWAY_URL}
                        </pre>
                    </div>

                    {/* API Key */}
                    <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-sm font-semibold text-gray-900 mb-1">API Key</h2>
                                {keyMeta ? (
                                    <div className="font-mono text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded inline-block border border-gray-200">
                                        sk_live_••••{keyMeta.id.slice(-4)}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">No API key yet</p>
                                )}
                            </div>
                            <button
                                onClick={createOrRegenerateKey}
                                disabled={loadingKey}
                                className="text-sm bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors"
                            >
                                {loadingKey
                                    ? "Processing..."
                                    : keyMeta
                                        ? "Regenerate Key"
                                        : "Create API Key"}
                            </button>
                        </div>

                        {keyMeta && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Example Request</p>
                                <pre className="bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-xs overflow-x-auto">
                                    {`curl ${GATEWAY_URL}/your-endpoint \\
  -H "x-api-key: YOUR_API_KEY"`}
                                </pre>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </Protected>
    )
}
