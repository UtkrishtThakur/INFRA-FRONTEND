"use client"

import { useEffect, useState } from "react"
import Protected from "@/components/Protected"
import Navbar from "@/components/Navbar"
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton"
import PageTransition from "@/components/ui/PageTransition"
import { apiFetch } from "@/lib/api"
import { Project } from "@/lib/types"
import { useRouter } from "next/navigation"

export default function Dashboard() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        loadProjects()
    }, [])

    async function loadProjects() {
        try {
            setLoading(true)
            const res = await apiFetch("/projects")

            if (Array.isArray(res) && res.length === 0) {
                router.replace("/dashboard/create")
                return
            }

            setProjects(res)
        } catch (error) {
            console.error("Failed to load projects", error)
        } finally {
            // Only set loading to false if we have projects (otherwise we are redirecting)
            // But if there is an error we should show it. 
            // If res.length === 0 we redirected, so we don't need to unset loading immediately 
            // (component will unmount), but strictly speaking we should only unset if we stay.
            // However, to be safe against race conditions/errors:
            setLoading(false)
        }
    }

    if (loading && projects.length === 0) {
        return (
            <Protected>
                <div className="min-h-screen bg-[#fafbfc]">
                    <Navbar />
                    <div className="p-8 max-w-6xl mx-auto">
                        <header className="flex justify-between items-end mb-12 opacity-50">
                            <div>
                                <div className="h-4 w-24 bg-gray-100 rounded mb-2"></div>
                                <div className="h-8 w-48 bg-gray-100 rounded"></div>
                            </div>
                        </header>
                        <DashboardSkeleton />
                    </div>
                </div>
            </Protected>
        )
    }

    // Double check redirection didn't fail
    if (projects.length === 0 && !loading) {
        // Redundancy in case the effect redirect missed or error state
        return (
            <Protected>
                <div className="min-h-screen bg-[#fafbfc]">
                    <Navbar />
                    <div className="p-8 max-w-6xl mx-auto text-center py-20">
                        <p className="text-gray-400">No projects found. Redirecting...</p>
                        <button onClick={() => router.push("/dashboard/create")} className="mt-4 text-blue-600 underline">
                            Click here if not redirected
                        </button>
                    </div>
                </div>
            </Protected>
        )
    }

    return (
        <Protected>
            <div className="min-h-screen bg-[#fafbfc]">
                <Navbar />
                <PageTransition>
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
                                onClick={() => router.push("/dashboard/create")}
                                className="btn-primary flex items-center gap-2 shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                                New Project
                            </button>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((p) => (
                                <div
                                    key={p.id}
                                    className="premium-card p-6 cursor-pointer flex flex-col group relative overflow-hidden"
                                    onClick={() => router.push(`/dashboard/projects/${p.id}`)}
                                >
                                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                                        <svg className="w-24 h-24 text-black transform rotate-12 translate-x-8 -translate-y-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" /></svg>
                                    </div>

                                    <div className="flex justify-between items-start mb-6 relative">
                                        <div className="font-bold text-lg tracking-tight group-hover:text-blue-600 transition-colors">
                                            {p.name}
                                        </div>
                                        <div className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                                    </div>

                                    <div className="space-y-4 mb-8 relative">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Upstream Service</p>
                                            <p className="text-xs font-mono text-gray-600 truncate bg-gray-50 p-2 rounded border border-gray-100">
                                                {p.upstream_base_url}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center relative">
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
                    </div>
                </PageTransition>
            </div>
        </Protected>
    )
}
