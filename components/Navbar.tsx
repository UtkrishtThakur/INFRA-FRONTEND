"use client"

import { logout } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function Navbar() {
    const router = useRouter()

    return (
        <div className="flex justify-between p-4 border-b">
            <div className="font-bold">Infra Dashboard</div>
            <button
                onClick={() => {
                    logout()
                    router.push("/login")
                }}
                className="text-red-600"
            >
                Logout
            </button>
        </div>
    )
}
