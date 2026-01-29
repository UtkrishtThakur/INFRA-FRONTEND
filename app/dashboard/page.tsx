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
            <div className="min-h-screen bg-[#fafbfc]">
                <Navbar />

                {showCreateModal && (
                    <CreateProjectModal
                        onClose={() => setShowCreateModal(false)}
                        onCreated={loadProjects}
                    />
                )}

                <div className="p-8 max-w-6xl mx-auto">
                    <header className="flex justify-between items-end mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="badge-status bg-black text-white px-2">Production</span>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Control Plane</span>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 italic">Project Clusters</h1>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="btn-primary flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                            New Project
                        </button>
                    </header>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="premium-card p-6 h-48 animate-shimmer"></div>
                            ))}
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 px-6 border border-dashed border-gray-200 rounded-2xl bg-white text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Initialize Your First Project</h3>
                            <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
                                Establish a project to start routing traffic through the SecureX Edge and monitoring your upstream services.
                            </p>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="btn-secondary"
                            >
                                Deploy New Project
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((p) => (
                                <div
                                    key={p.id}
                                    className="premium-card p-6 cursor-pointer flex flex-col group"
                                    onClick={() => router.push(`/dashboard/projects/${p.id}`)}
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="font-bold text-lg tracking-tight group-hover:text-blue-600 transition-colors">
                                            {p.name}
                                        </div>
                                        <div className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Upstream Service</p>
                                            <p className="text-xs font-mono text-gray-600 truncate bg-gray-50 p-2 rounded">
                                                {p.upstream_base_url}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                                        <span className="text-[10px] text-gray-400 font-mono">
                                            {p.id.slice(0, 8)}
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            Act: {new Date(p.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Protected>
    )
}
