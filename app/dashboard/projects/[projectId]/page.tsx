"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Protected from "@/components/Protected"
import Navbar from "@/components/Navbar"
import ApiKeyModal from "@/components/ApiKeyModal"
import { apiFetch } from "@/lib/api"
import { APIKey, Project } from "@/lib/types"

const GATEWAY_URL = "https://gateway.antigravity.io"

export default function ProjectDetailPage() {
    const { projectId } = useParams<{ projectId: string }>()
    const router = useRouter()

    const [project, setProject] = useState<Project | null>(null)
    const [keyMeta, setKeyMeta] = useState<APIKey | null>(null)
    const [rawKey, setRawKey] = useState<string | null>(null)
    const [showKeyModal, setShowKeyModal] = useState(false)
    const [loadingKey, setLoadingKey] = useState(false)

    async function loadProject() {
        const res = await apiFetch(`/projects/${projectId}`)
        setProject(res)
    }

    async function loadKey() {
        const res = await apiFetch(`/projects/${projectId}/keys`)
        setKeyMeta(Array.isArray(res) ? res[0] ?? null : res)
    }

    useEffect(() => {
        loadProject()
        loadKey()
    }, [projectId])

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

            {showKeyModal && rawKey && (
                <ApiKeyModal apiKey={rawKey} onClose={closeKeyModal} />
            )}

            <div className="p-6 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8 border-b pb-4">
                    <h1 className="text-2xl font-bold">Project</h1>
                    <button
                        onClick={deleteProject}
                        className="text-red-600 px-4 py-2 hover:bg-red-50 rounded text-sm"
                    >
                        Delete Project
                    </button>
                </div>

                {/* Gateway Info */}
                <section className="bg-white border p-6 rounded-lg mb-6">
                    <h2 className="font-semibold mb-2">Gateway Endpoint</h2>
                    <p className="text-sm text-gray-600 mb-2">
                        Send all API requests to this URL:
                    </p>

                    <pre className="bg-gray-100 p-3 rounded font-mono text-sm">
                        {GATEWAY_URL}
                    </pre>
                </section>

                {/* API Key */}
                <section className="bg-white border p-6 rounded-lg mb-6">
                    <h2 className="font-semibold mb-4">API Key</h2>

                    {keyMeta ? (
                        <div className="font-mono mb-3">
                            sk_live_••••{keyMeta.id.slice(-4)}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 mb-3">No API key yet</p>
                    )}

                    <button
                        onClick={createOrRegenerateKey}
                        disabled={loadingKey}
                        className="border px-4 py-2 rounded hover:bg-black hover:text-white disabled:opacity-50"
                    >
                        {loadingKey
                            ? "Processing..."
                            : keyMeta
                                ? "Regenerate API Key"
                                : "Create API Key"}
                    </button>
                </section>

                {/* Usage Example */}
                {keyMeta && (
                    <section className="bg-white border p-6 rounded-lg">
                        <h2 className="font-semibold mb-2">Example Request</h2>

                        <pre className="bg-gray-100 p-3 rounded font-mono text-sm overflow-x-auto">
                            {`curl ${GATEWAY_URL}/your-endpoint \\
  -H "x-api-key: YOUR_API_KEY"`}
                        </pre>
                    </section>
                )}
            </div>
        </Protected>
    )
}
