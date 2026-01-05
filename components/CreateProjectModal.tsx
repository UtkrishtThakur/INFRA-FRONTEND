import { useState } from "react"
import { apiFetch } from "@/lib/api"
import { useRouter } from "next/navigation"
import ApiKeyModal from "@/components/ApiKeyModal"

export default function CreateProjectModal({
    onClose,
}: {
    onClose: () => void
}) {
    const [name, setName] = useState("")
    const [upstream, setUpstream] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [createdKey, setCreatedKey] = useState<string | null>(null)
    const [createdProjectId, setCreatedProjectId] = useState<string | null>(null)
    const router = useRouter()

    async function createProject() {
        if (!name || !upstream) {
            setError("All fields are required")
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

            // Auto-create a default API key
            const keyRes = await apiFetch(`/projects/${project.id}/keys`, {
                method: "POST",
                body: JSON.stringify({ label: "default" }),
            })

            // Capture the key and project ID
            // Assuming keyRes contains { api_key: "..." } or similar.
            // Based on other code, it's res.api_key
            setCreatedKey(keyRes.api_key)
            setCreatedProjectId(project.id)
            setLoading(false)

            // Do NOT redirect yet. Wait for user to copy key.
        } catch (err: any) {
            setError(err.message || "Failed to create project")
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-200">
                <h2 className="text-xl font-semibold mb-4">Create New Project</h2>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Project Name
                        </label>
                        <input
                            placeholder="My Awesome API"
                            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-black focus:outline-none"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Upstream API URL
                        </label>
                        <input
                            placeholder="https://api.backend.com"
                            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-black focus:outline-none"
                            value={upstream}
                            onChange={(e) => setUpstream(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            The base URL where we should forward requests.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={createProject}
                        className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Project"}
                    </button>
                </div>
            </div>
        </div>
    )
}
