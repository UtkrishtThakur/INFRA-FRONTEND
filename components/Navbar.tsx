"use client"

import { logout } from "@/lib/auth"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Navbar() {
    const router = useRouter()

    return (
        <nav className="glass sticky top-0 z-40 border-b border-gray-100 px-8 py-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <Link href="/dashboard" className="flex items-center gap-2 group">
                    <div className="w-6 h-6 bg-black rounded flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-white font-bold italic text-[10px]">S</span>
                    </div>
                    <span className="font-bold text-lg tracking-tight">SecureX</span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
                        Clusters
                    </Link>
                    <Link href="/dashboard/analytics" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
                        Global Edge
                    </Link>
                    <div className="h-4 w-px bg-gray-200"></div>
                    <button
                        onClick={() => {
                            logout()
                            router.push("/login")
                        }}
                        className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-widest text-[10px]"
                    >
                        Terminate Session
                    </button>
                </div>
            </div>
        </nav>
    )
}
