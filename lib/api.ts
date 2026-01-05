const API_URL = process.env.NEXT_PUBLIC_CONTROL_API_URL

if (!API_URL) {
    console.error("❌ CRITICAL: NEXT_PUBLIC_CONTROL_API_URL is missing. Please check .env.local and restart the server.")
} else {
    console.log("✅ API Configured:", API_URL)
}

export async function apiFetch(
    path: string,
    options: RequestInit = {}
) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    if (!API_URL) {
        throw new Error("Configuration Error: API URL is missing. Check console.")
    }

    const url = `${API_URL}${path}`
    console.log(`[API] Fetching ${url}`)

    const res = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
    })

    if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "API error")
    }

    return res.json()
}
