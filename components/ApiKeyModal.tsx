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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                <div className="flex items-center gap-2 mb-2 text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <h2 className="text-lg font-semibold text-black">
                        API Key Created
                    </h2>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                    This key will be shown <strong>only once</strong>. Please copy it now and store it securely. You will not be able to see it again.
                </p>

                <div className="bg-gray-100 text-gray-800 font-mono text-sm p-4 rounded border mb-6 break-all select-all">
                    {apiKey}
                </div>

                <div className="flex justify-between">
                    <button
                        onClick={onClose}
                        className="text-gray-500 text-sm hover:text-gray-900"
                    >
                        Close
                    </button>

                    <button
                        onClick={copyKey}
                        className={`px-4 py-2 rounded text-white transition-colors ${copied ? 'bg-green-600' : 'bg-black hover:bg-gray-800'}`}
                    >
                        {copied ? "Copied to Clipboard" : "Copy API Key"}
                    </button>
                </div>
            </div>
        </div>
    )
}
