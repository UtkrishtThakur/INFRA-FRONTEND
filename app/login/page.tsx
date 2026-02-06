"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { saveToken } from "@/lib/auth"
import PageTransition from "@/components/ui/PageTransition"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function submit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setLoading(true)

        const body = new URLSearchParams()
        body.append("username", email)
        body.append("password", password)

        try {
            // Artificial delay to prevent flicker and show spinner
            const start = Date.now()

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_CONTROL_API_URL}/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: body.toString(),
                }
            )

            const delay = Math.max(500 - (Date.now() - start), 0)
            await new Promise(r => setTimeout(r, delay))

            const data = await res.json()

            if (!res.ok) {
                if (res.status === 403) {
                    setError("Please verify your email address before logging in.")
                } else if (res.status === 401) {
                    setError("Invalid email or password.")
                } else {
                    setError(data.detail || "Login failed")
                }
                return
            }

            saveToken(data.access_token)
            router.push("/dashboard")
        } catch {
            setError("Network error. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <PageTransition>
            <div className="min-h-screen flex items-center justify-center bg-[#fafbfc] px-4">
                <div className="w-full max-w-[400px] mx-auto">
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
                            Secure your APIs
                        </h1>
                        <p className="text-sm text-gray-500">
                            Sign in to manage your projects and monitor real-time activity.
                        </p>
                    </div>

                    <form onSubmit={submit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-xs font-medium animate-fade-in flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Email</label>
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400"
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400"
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white p-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center h-10 mt-2"
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    "Sign In"
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-400">
                            SecureX Control Plane &copy; 2026
                        </p>
                    </div>
                </div>
            </div>
        </PageTransition>
    )
}
