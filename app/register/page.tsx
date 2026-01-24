"use client"

import { useState } from "react"

export default function RegisterPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function submit() {
        if (!email || !password) {
            setError("Email and password are required")
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
                setError(data?.detail || "Registration failed")
                return
            }

            // ✅ Registration successful → wait for email verification
            setSuccess(true)
        } catch {
            setError("Network error")
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="p-10 max-w-sm mx-auto text-center">
                <h1 className="text-xl mb-3">Verify your email</h1>
                <p className="text-gray-600">
                    We’ve sent a verification link to
                </p>
                <p className="font-medium mt-1">{email}</p>
                <p className="text-sm text-gray-500 mt-4">
                    Click the link in your email to activate your account.
                </p>
            </div>
        )
    }

    return (
        <div className="p-10 max-w-sm mx-auto">
            <h1 className="text-xl mb-4">Register</h1>

            {error && (
                <p className="text-red-600 text-sm mb-3">{error}</p>
            )}

            <input
                type="email"
                placeholder="Email"
                className="border p-2 w-full mb-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                className="border p-2 w-full mb-4"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button
                onClick={submit}
                disabled={loading}
                className="bg-black text-white p-2 w-full disabled:opacity-50"
            >
                {loading ? "Registering..." : "Register"}
            </button>
        </div>
    )
}
