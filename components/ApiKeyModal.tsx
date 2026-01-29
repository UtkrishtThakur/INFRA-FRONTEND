"use client"

import { useState } from "react"

export default function ApiKeyModal({
    apiKey,
    onClose,
}: {
    apiKey: string
    onClose: () => void
}) {
    const [copied, setCopied] = useState(false)

    function copyKey() {
        navigator.clipboard.writeText(apiKey)
        setCopied(true)
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-2xl p-10 w-full max-w-md shadow-2xl transition-all duration-300">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-8 mx-auto">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                </div>

                <h2 className="text-2xl font-bold text-center mb-4 tracking-tight">
                    Deployment Key Generated
                </h2>

                <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-8">
                    <div className="flex gap-3">
                        <svg className="w-5 h-5 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="text-xs text-amber-800 font-medium leading-relaxed">
                            This cryptographic key is displayed <strong>exactly once</strong>. Secure it immediately. Undisclosed loss results in permanent loss of access for this identity.
                        </p>
                    </div>
                </div>

                <div className="bg-gray-50 border border-gray-100 text-gray-900 font-mono text-xs px-5 py-4 rounded-xl mb-10 break-all flex items-center justify-between">
                    <span className="select-all">{apiKey}</span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <button
                        onClick={copyKey}
                        className={`btn-primary w-full py-3 flex items-center justify-center gap-2 transition-all ${copied ? "bg-blue-600 hover:bg-blue-700" : ""
                            }`}
                    >
                        {copied ? (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                                Copied to Integrity Buffer
                            </>
                        ) : (
                            "Copy to Integrity Buffer"
                        )}
                    </button>

                    <button
                        onClick={onClose}
                        className="btn-secondary w-full py-3"
                    >
                        Proceed to Cluster View
                    </button>
                </div>
            </div>
        </div>
    )
}
