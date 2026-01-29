"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { saveToken } from "@/lib/auth"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    async function submit() {
        setError(null)
        const body = new URLSearchParams()
        body.append("username", email)   // OAuth uses "username"
        body.append("password", password)

        try {
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
        }
    }


    return (
        <div className="p-10 max-w-sm mx-auto">
            <h1 className="text-xl mb-4">Login</h1>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
                    {error}
                </div>
            )}

            <input
                placeholder="Email"
                className="border p-2 w-full mb-2"
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                className="border p-2 w-full mb-4"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={submit} className="bg-black text-white p-2 w-full">
                Login
            </button>
        </div>
    )
}
