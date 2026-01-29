import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* --- Navigation --- */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full glass sticky top-0 z-50 mt-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
            <span className="text-white font-bold italic">S</span>
          </div>
          <span className="font-bold text-xl tracking-tight">SecureX</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium hover:text-gray-600 transition-colors">
            Login
          </Link>
          <Link href="/register" className="btn-primary">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <main className="flex-1">
        <section className="px-6 pt-24 pb-32 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 mb-8 animate-fade-in text-[10px] font-bold uppercase tracking-wider text-gray-500">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            SecureX Control Plane v1.0
          </div>

          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-black to-gray-500 py-2 leading-tight">
            API Gateway Control <br className="hidden md:block" /> at your fingertips.
          </h1>

          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            The modern command center for your API infrastructure. Monitor traffic, manage keys, and secure your upstream services with clinical precision.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="btn-primary text-base px-8 py-3.5 w-full sm:w-auto">
              Get Implementation Access
            </Link>
            <Link href="/login" className="btn-secondary text-base px-8 py-3.5 w-full sm:w-auto">
              View Dashboard
            </Link>
          </div>
        </section>

        {/* --- Conceptual Architecture --- */}
        <section className="px-6 py-24 bg-gray-50 border-y border-gray-100 overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold mb-6 tracking-tight">Separation of Concerns.</h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                SecureX decouples the <strong>Control Plane</strong> from the <strong>Data Plane</strong>. Manage policies and observability here, while your data flows through high-performance workers.
              </p>

              <ul className="space-y-4">
                {[
                  "Real-time visibility into every endpoint",
                  "Immutable API key tracking & security",
                  "Sub-millisecond latency overhead",
                  "Global distribution ready",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="premium-card p-10 bg-white aspect-square flex flex-col items-center justify-center text-center relative overflow-hidden">
                {/* 🔧 FIXED: removed Tailwind arbitrary gradient (Windows-safe) */}
                <div
                  className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />

                <div className="grid grid-cols-1 gap-12 relative z-10 w-full">
                  <div className="p-4 border border-dashed border-gray-200 rounded-lg bg-white relative">
                    <span className="absolute -top-3 left-4 bg-white px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Control Plane (You)
                    </span>
                    <div className="h-12 bg-gray-50 rounded flex items-center justify-center font-mono text-xs font-bold border border-gray-100">
                      SecureX Dashboard
                    </div>
                  </div>

                  <div className="flex justify-center h-4 relative">
                    <div className="w-px bg-gradient-to-b from-black to-transparent h-12 absolute -top-4"></div>
                    <div className="w-px bg-gradient-to-b from-gray-200 to-transparent h-12 absolute -top-4 ml-8"></div>
                    <div className="w-px bg-gradient-to-b from-gray-200 to-transparent h-12 absolute -top-4 mr-8"></div>
                  </div>

                  <div className="p-4 border border-gray-100 rounded-lg bg-black text-white shadow-2xl relative mt-4">
                    <span className="absolute -top-3 left-4 bg-black px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Data Plane
                    </span>
                    <div className="h-12 border border-gray-700/50 rounded flex items-center justify-center font-mono text-xs font-bold">
                      SecureX Edge Workers
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 shrink-0">
                    <div className="h-8 bg-gray-50 rounded flex items-center justify-center font-mono text-[9px] text-gray-400 border border-gray-100">
                      User A
                    </div>
                    <div className="h-8 bg-gray-100 rounded flex items-center justify-center font-mono text-[9px] font-bold border border-gray-200">
                      API Gateway
                    </div>
                    <div className="h-8 bg-gray-50 rounded flex items-center justify-center font-mono text-[9px] text-gray-400 border border-gray-100">
                      User B
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Social Proof / Stats --- */}
        <section className="px-6 py-32 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="text-4xl font-black tracking-tight">100%</div>
              <div className="font-bold text-gray-900 border-l-2 border-black pl-4">Audit-Ready</div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Every API key generation and usage is logged and verifiable in real-time. No secrets hidden from the owner.
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl font-black tracking-tight">0.5ms</div>
              <div className="font-bold text-gray-900 border-l-2 border-black pl-4">Edge Latency</div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Our workers are optimized for raw performance, ensuring no perceptible impact on your users' experience.
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl font-black tracking-tight">24/7</div>
              <div className="font-bold text-gray-900 border-l-2 border-black pl-4">Anomaly Detection</div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Automated signals catch high error rates or traffic spikes across all endpoints before they become outages.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="px-6 py-12 border-t border-gray-100 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
              <span className="text-white font-bold italic text-xs">S</span>
            </div>
            <span className="font-bold text-lg tracking-tight">SecureX</span>
          </div>
          <div className="text-sm text-gray-400">
            &copy; 2026 SecureX Infrastructure. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-black transition-colors">Documentation</a>
            <a href="#" className="hover:text-black transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
