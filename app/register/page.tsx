"use client"

import { useState } from "react"
import Link from "next/link"

export default function RegisterPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function submit(e: React.FormEvent) {
        e.preventDefault()
        if (!email || !password) {
            setError("All fields are required to establish an account.")
            return
        }

        setLoading(true)
        setError(null)

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_CONTROL_API_URL}/auth/register`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                }
            )

            const data = await res.json()

            if (!res.ok) {
                setError(data?.detail || "Registration failed. Policy violation.")
                return
            }

            setSuccess(true)
        } catch {
            setError("Network conflict. Registration aborted.")
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white text-center">
                <div className="max-w-md w-full premium-card p-12">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-500">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mb-4">Activation Required</h1>
                    <p className="text-gray-500 leading-relaxed mb-8">
                        We’ve dispatched a cryptographic verification link to <span className="font-bold text-black">{email}</span>. Please click the link to activate your access.
                    </p>
                    <div className="space-y-4">
                        <Link href="/login" className="btn-primary w-full py-3 inline-block">
                            Go to Login
                        </Link>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
                            Check your spam if link doesn't arrive
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
            <Link href="/" className="mb-12 flex items-center gap-2 group">
                <div className="w-8 h-8 bg-black rounded flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold italic">S</span>
                </div>
                <span className="font-bold text-xl tracking-tight">SecureX</span>
            </Link>

            <div className="max-w-md w-full premium-card p-10">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight mb-2">Create Account</h1>
                    <p className="text-sm text-gray-500">Deploy your own API Control Plane in minutes.</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-100 animate-in fade-in slide-in-from-top-1">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                        <input
                            type="email"
                            placeholder="name@company.com"
                            className="input-standard"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Password</label>
                        <input
                            type="password"
                            placeholder="Min 8 characters"
                            className="input-standard"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="flex gap-1 mt-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className={`h-1 flex-1 rounded-full ${password.length >= i * 2 ? 'bg-black' : 'bg-gray-100'}`}></div>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            "Establish Account"
                        )}
                    </button>

                    <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                        By establishing an account, you agree to our <a href="#" className="underline">Infrastructure Governance Policy</a> and <a href="#" className="underline">Data Privacy Standards</a>.
                    </p>

                    <div className="text-center border-t border-gray-100 pt-6">
                        <p className="text-sm text-gray-500">
                            Already registered?{" "}
                            <Link href="/login" className="font-bold text-black border-b border-black/10 hover:border-black transition-all">
                                Login here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}
