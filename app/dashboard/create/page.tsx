"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"
import ApiKeyModal from "@/components/ApiKeyModal"
import Navbar from "@/components/Navbar"
import Protected from "@/components/Protected"
import PageTransition from "@/components/ui/PageTransition"

export default function CreateProjectPage() {
    const [name, setName] = useState("")
    const [upstream, setUpstream] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [createdKey, setCreatedKey] = useState<string | null>(null)
    const [createdProjectId, setCreatedProjectId] = useState<string | null>(null)
    const router = useRouter()

    async function createProject(e: React.FormEvent) {
        e.preventDefault()
        if (!name || !upstream) {
            setError("Identification and upstream targets are required.")
            return
        }

        try {
            setLoading(true)
            setError("")

            const project = await apiFetch("/projects", {
                method: "POST",
                body: JSON.stringify({
                    name,
                    upstream_base_url: upstream,
                }),
            })

            const keyRes = await apiFetch(`/projects/${project.id}/keys`, {
                method: "POST",
                body: JSON.stringify({ label: "default" }),
            })

            setCreatedKey(keyRes.api_key)
            setCreatedProjectId(project.id)
        } catch (err: any) {
            setError(err.message || "Cluster initialization failed.")
        } finally {
            setLoading(false)
        }
    }

    function handleCloseSuccess() {
        if (createdProjectId) {
            router.push(`/dashboard/projects/${createdProjectId}`)
        }
    }

    if (createdKey) {
        return (
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <ApiKeyModal
                    apiKey={createdKey}
                    onClose={handleCloseSuccess}
                />
            </div>
        )
    }

    return (
        <Protected>
            <div className="min-h-screen bg-[#fafbfc]">
                <Navbar />
                <PageTransition>
                    <div className="max-w-2xl mx-auto py-20 px-6">
                        <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100">
                            <header className="mb-10 text-center">
                                <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-black/20">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Initialize Project</h2>
                                <p className="text-sm text-gray-500 mt-2">
                                    Deploy a new secure gateway cluster for your services.
                                </p>
                            </header>

                            <form onSubmit={createProject} className="space-y-8">
                                {error && (
                                    <div className="bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest p-4 rounded-lg border border-red-100 flex items-center gap-3">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
                                            Project Identifier
                                        </label>
                                        <input
                                            placeholder="e.g. Core Commerce Flow"
                                            className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-gray-300"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            autoFocus
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
                                            Upstream Target URL
                                        </label>
                                        <input
                                            placeholder="https://api.internal.service"
                                            className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-gray-300"
                                            value={upstream}
                                            onChange={(e) => setUpstream(e.target.value)}
                                        />
                                        <p className="text-[10px] text-gray-400 font-medium mt-2 flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            SecureX will proxy traffic to this absolute target.
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="btn-primary w-full py-3 flex items-center justify-center gap-2 shadow-lg shadow-black/10 hover:shadow-xl transition-all"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                                Provisioning...
                                            </>
                                        ) : (
                                            "Execute Deployment"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </PageTransition>
            </div>
        </Protected>
    )
}
