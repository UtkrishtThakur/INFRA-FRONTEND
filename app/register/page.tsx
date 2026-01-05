"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    async function submit() {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_CONTROL_API_URL}/auth/register`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            }
        )

        if (!res.ok) {
            alert("Register failed")
            return
        }

        router.push("/login")
    }

    return (
        <div className="p-10 max-w-sm mx-auto">
            <h1 className="text-xl mb-4">Register</h1>
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
                Register
            </button>
        </div>
    )
}
