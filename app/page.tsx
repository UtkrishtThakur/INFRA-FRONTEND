import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center p-8 bg-white rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-2">Infra</h1>
        <p className="text-gray-600 mb-6">
          Secure API Gateway with centralized control, rate limiting, and risk
          detection.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-4 py-2 bg-black text-white rounded"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-4 py-2 border rounded"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  )
}
