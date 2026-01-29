"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"

function VerifyContent() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const email = searchParams.get("email")
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
    const [message, setMessage] = useState("")

    useEffect(() => {
        if (!token || !email) {
            setStatus("error")
            setMessage("Fragmented payload. Missing verification token or identity.")
            return
        }

        const verify = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_CONTROL_API_URL}/auth/verify-email?token=${token}&email=${email}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }
                )

                const data = await res.json()

                if (!res.ok) {
                    throw new Error(data.detail || "Validation fail. Verification token mismatch.")
                }

                setStatus("success")
            } catch (err: any) {
                setStatus("error")
                setMessage(err.message || "Internal network error during validation.")
            }
        }

        // Add a slight delay for "premium" feel (loading skeleton visible)
        const timer = setTimeout(verify, 1500)
        return () => clearTimeout(timer)
    }, [token, email])

    if (status === "loading") {
        return (
            <div className="max-w-md w-full premium-card p-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full mx-auto mb-8 animate-pulse"></div>
                <div className="h-8 bg-gray-50 rounded w-3/4 mx-auto mb-4 animate-shimmer"></div>
                <div className="h-4 bg-gray-50 rounded w-5/6 mx-auto animate-shimmer"></div>
                <div className="mt-12 h-10 bg-gray-50 rounded w-full animate-pulse"></div>
            </div>
        )
    }

    if (status === "success") {
        return (
            <div className="max-w-md w-full premium-card p-12 text-center animate-in zoom-in-95 duration-500">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-4">Access Granted</h1>
                <p className="text-gray-500 leading-relaxed mb-10">
                    Infrastructure credentials verified. Your account is now fully active on the SecureX Control Plane.
                </p>
                <Link href="/login" className="btn-primary w-full py-3 inline-block">
                    Enter Control Plane
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-md w-full premium-card p-12 text-center animate-in zoom-in-95 duration-500 border-red-100 bg-red-50/10">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-4 text-red-900">Validation Error</h1>
            <p className="text-red-600 font-medium text-sm mb-6 leading-relaxed">
                {message}
            </p>
            <p className="text-gray-400 text-xs mb-10 leading-relaxed">
                This verification session may have expired or was previously utilized. High-security tokens are single-use.
            </p>
            <Link href="/login" className="btn-secondary w-full py-3">
                Back to Authentication
            </Link>
        </div>
    )
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
            <div className="mb-12 flex items-center gap-2">
                <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                    <span className="text-white font-bold italic">S</span>
                </div>
                <span className="font-bold text-xl tracking-tight text-black">SecureX</span>
            </div>
            <Suspense fallback={
                <div className="max-w-md w-full premium-card p-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full mx-auto mb-8 animate-pulse"></div>
                    <div className="h-8 bg-gray-50 rounded w-3/4 mx-auto mb-4 animate-pulse"></div>
                    <div className="h-4 bg-gray-50 rounded w-5/6 mx-auto animate-pulse"></div>
                    <div className="mt-12 h-10 bg-gray-50 rounded w-full animate-pulse"></div>
                </div>
            }>
                <VerifyContent />
            </Suspense>
        </div>
    )
}
