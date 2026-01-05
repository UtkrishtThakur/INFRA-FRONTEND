"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { saveToken } from "@/lib/auth"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    async function submit() {
        const body = new URLSearchParams()
        body.append("username", email)   // OAuth uses "username"
        body.append("password", password)

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

        if (!res.ok) {
            alert("Login failed")
            return
        }

        const data = await res.json()
        saveToken(data.access_token)
        router.push("/dashboard")
    }


    return (
        <div className="p-10 max-w-sm mx-auto">
            <h1 className="text-xl mb-4">Login</h1>
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
