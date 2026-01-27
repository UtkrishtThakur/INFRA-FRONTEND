"use client"

import { useEffect, useState } from "react"
import Protected from "@/components/Protected"
import Navbar from "@/components/Navbar"
import CreateProjectModal from "@/components/CreateProjectModal"
import { apiFetch } from "@/lib/api"
import { Project } from "@/lib/types"
import { useRouter } from "next/navigation"

export default function Dashboard() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const router = useRouter()

    useEffect(() => {
        loadProjects()
    }, [])

    async function loadProjects() {
        try {
            setLoading(true)
            const res = await apiFetch("/projects")
            setProjects(res)
        } catch (error) {
            console.error("Failed to load projects", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Protected>
            <Navbar />

            {showCreateModal && (
                <CreateProjectModal onClose={() => setShowCreateModal(false)} />
            )}

            <div className="p-6 max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Projects</h1>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                    >
                        + New Project
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-gray-500">
                        Loading projects...
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed rounded-lg bg-gray-50">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No projects yet
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Create your first project to get started.
                        </p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-black text-white px-4 py-2 rounded-md"
                        >
                            Create Project
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projects.map((p) => (
                            <div
                                key={p.id}
                                className="border rounded-lg p-5 cursor-pointer hover:border-black hover:shadow-sm transition-all bg-white group"
                                onClick={() =>
                                    router.push(`/dashboard/projects/${p.id}`)
                                }
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                                        {p.name}
                                    </div>
                                    <span className="text-xs font-mono text-gray-400">
                                        {p.id.slice(0, 8)}
                                    </span>
                                </div>

                                <div className="text-sm text-gray-600 truncate mb-4">
                                    <span className="font-medium text-gray-900">Upstream:</span>{" "}
                                    {p.upstream_base_url}
                                </div>

                                <div className="text-xs text-gray-400 mt-auto">
                                    Created {new Date(p.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Protected>
    )
}
