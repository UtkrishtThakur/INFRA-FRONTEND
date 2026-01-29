import { useState } from "react"
import { apiFetch } from "@/lib/api"
import { useRouter } from "next/navigation"
import ApiKeyModal from "@/components/ApiKeyModal"

export default function CreateProjectModal({
    onClose,
    onCreated,
}: {
    onClose: () => void
    onCreated?: () => void
}) {
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
            onCreated?.()
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
        onClose()
    }

    if (createdKey) {
        return (
            <ApiKeyModal
                apiKey={createdKey}
                onClose={handleCloseSuccess}
            />
        )
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-2xl p-10 w-full max-w-lg shadow-2xl transition-all duration-300">
                <header className="mb-10 text-center">
                    <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">Deploy Project Cluster</h2>
                    <p className="text-sm text-gray-500 mt-2">
                        Initialize a new secure boundary for your upstream services.
                    </p>
                </header>

                <form onSubmit={createProject} className="space-y-8">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest p-4 rounded-lg border border-red-100">
                            Error: {error}
                        </div>
                    )}

                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
                                Project Identifier
                            </label>
                            <input
                                placeholder="e.g. Core Commerce Flow"
                                className="input-standard"
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
                                placeholder="https://production.cluster.local"
                                className="input-standard"
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

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary flex-1 py-3"
                            disabled={loading}
                        >
                            Abort
                        </button>
                        <button
                            type="submit"
                            className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
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
    )
}
