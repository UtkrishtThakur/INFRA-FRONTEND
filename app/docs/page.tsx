"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState("intro")

    const scrollTo = (id: string) => {
        setActiveSection(id)
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: "smooth" })
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-8 py-12">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">Documentation</h1>
                    <p className="text-lg text-gray-500 max-w-2xl">
                        Learn how to integrate SecureX, understand your traffic, and configure your project for maximum security.
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-8 py-12 flex gap-12">
                {/* Sidebar Navigation */}
                <div className="w-64 flex-shrink-0 hidden md:block">
                    <div className="sticky top-24 space-y-8">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Getting Started</h3>
                            <ul className="space-y-2">
                                <NavItem id="intro" label="Introduction" active={activeSection} onClick={scrollTo} />
                                <NavItem id="quickstart" label="Quick Start" active={activeSection} onClick={scrollTo} />
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Integration</h3>
                            <ul className="space-y-2">
                                <NavItem id="curl" label="cURL / CLI" active={activeSection} onClick={scrollTo} />
                                <NavItem id="python" label="Python Client" active={activeSection} onClick={scrollTo} />
                                <NavItem id="nginx" label="Nginx Proxy" active={activeSection} onClick={scrollTo} />
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Concepts</h3>
                            <ul className="space-y-2">
                                <NavItem id="dashboard" label="Dashboard & Metrics" active={activeSection} onClick={scrollTo} />
                                <NavItem id="risk" label="Risk & Mitigation" active={activeSection} onClick={scrollTo} />
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0 space-y-16 pb-24">
                    {/* Introduction */}
                    <Section id="intro" title="Introduction">
                        <p className="text-lg text-gray-600 leading-relaxed mb-6">
                            SecureX is not just a firewall; it is a <strong className="text-gray-900">Behavioral Control Layer</strong> for your API. Instead of relying on static rules that attackers easily bypass, SecureX learns what "normal" traffic looks like for your specific service. It monitors velocity, burstiness, and access patterns to detect anomalies in real-time.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <FeatureCard
                                title="Deep Visibility"
                                description="See exactly who is accessing your API and how, with detailed audit logs."
                            />
                            <FeatureCard
                                title="Contextual Defense"
                                description="Alerts that understand the difference between a Monday morning spike and a Friday night attack."
                            />
                        </div>
                    </Section>

                    {/* Quick Start */}
                    <Section id="quickstart" title="Quick Start">
                        <p className="text-gray-600 mb-6">Protecting your API takes just a few minutes.</p>

                        <Step number={1} title="Create a Project">
                            <p className="text-gray-600">
                                Log in to the Dashboard and click <strong>New Project</strong>. You will need to provide your
                                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm mx-1 text-gray-800">Upstream URL</code>
                                (e.g., <span className="text-blue-500">https://api.your-backend.com</span>). This is where SecureX will forward valid requests.
                            </p>
                        </Step>

                        <Step number={2} title="Get Your API Key">
                            <p className="text-gray-600 mb-3">
                                Once created, you will be shown a Project API Key. Copy this immediately.
                            </p>
                            <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg flex gap-3">
                                <span className="text-amber-600">⚠️</span>
                                <p className="text-sm text-amber-800">
                                    For security reasons, the API key is shown only once. If you lose it, you will need to regenerate it.
                                </p>
                            </div>
                        </Step>

                        <Step number={3} title="Route Your Traffic">
                            <p className="text-gray-600">
                                Point your client applications to the SecureX Gateway instead of your backend.
                            </p>
                            <div className="mt-4 p-4 bg-gray-900 rounded-lg text-gray-100 font-mono text-sm">
                                https://worker.securex.dev
                            </div>
                        </Step>
                    </Section>

                    {/* Integration */}
                    <Section id="curl" title="Integration: cURL">
                        <p className="text-gray-600 mb-4">
                            Test that your project is set up correctly by making a request through the gateway.
                        </p>
                        <CodeBlock language="bash">
                            {`curl -i \\
  -H "x-api-key: sk_live_12345abcdef" \\
  https://worker.securex.dev/api/v1/users`}
                        </CodeBlock>
                        <p className="text-sm text-gray-500 mt-2">
                            SecureX will forward this request to <span className="font-mono text-gray-700">https://api.your-backend.com/api/v1/users</span>.
                        </p>
                    </Section>

                    <Section id="python" title="Integration: Python">
                        <p className="text-gray-600 mb-4">
                            If you are calling your API from a Python script, simply include the header.
                        </p>
                        <CodeBlock language="python">
                            {`import requests

GATEWAY_URL = "https://worker.securex.dev"
API_KEY = "sk_live_12345abcdef"

headers = {
    "x-api-key": API_KEY,
    "Content-Type": "application/json"
}

# Real destination: https://api.your-backend.com/orders/123
response = requests.get(
    f"{GATEWAY_URL}/orders/123",
    headers=headers
)

print(f"Status: {response.status_code}")`}
                        </CodeBlock>
                    </Section>

                    <Section id="nginx" title="Integration: Nginx Proxy">
                        <p className="text-gray-600 mb-4">
                            To transparently protect an internal service using Nginx:
                        </p>
                        <CodeBlock language="nginx">
                            {`server {
    listen 80;
    server_name api.myservice.com;

    location / {
        # Forward traffic to SecureX Gateway
        proxy_pass https://worker.securex.dev;
        
        # Inject API Key (if not provided by client)
        proxy_set_header x-api-key "sk_live_12345abcdef";
        
        # Standard Proxy Headers
        proxy_set_header Host worker.securex.dev;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_ssl_server_name on;
    }
}`}
                        </CodeBlock>
                    </Section>


                    {/* Dashboard */}
                    <Section id="dashboard" title="Understanding the Dashboard">
                        <p className="text-gray-600 mb-6">
                            The dashboard offers a real-time view of your traffic health.
                        </p>

                        <div className="space-y-6">
                            <InfoCard title="No Active Traffic" type="neutral">
                                If you see this message, it simply means SecureX hasn't received any requests in the last 5 minutes. This is not an error. Once you send a request, metrics will appear instantly.
                            </InfoCard>

                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Key Metrics</h4>
                                <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <MetricDef label="Current RPM" desc="Requests per Minute (Real-time volume)." />
                                    <MetricDef label="Baseline RPM" desc="Expected volume based on 7-day history." />
                                    <MetricDef label="Traffic Multiplier" desc="Relative spike intensity (e.g. 2.5x)." />
                                </ul>
                            </div>
                        </div>
                    </Section>

                    {/* Risk & Mitigation */}
                    <Section id="risk" title="Risk & Mitigation">
                        <p className="text-gray-600 mb-6">
                            Every request is assigned a risk score from <code className="text-sm font-bold">0.0</code> (Safe) to <code className="text-sm font-bold">1.0</code> (High Risk).
                        </p>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="border border-gray-100 rounded-xl p-6 bg-white shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <h4 className="font-semibold text-gray-900">Throttling (Soft Mitigation)</h4>
                                </div>
                                <p className="text-gray-600 text-sm mb-2">
                                    <strong>Trigger:</strong> Moderate risk (0.5 - 0.8) or slight rate limit overages.
                                </p>
                                <p className="text-gray-600 text-sm">
                                    <strong>Action:</strong> Adds a small delay (~300ms) to the response. This frustrates bots without breaking the app for legitimate users.
                                </p>
                            </div>

                            <div className="border border-gray-100 rounded-xl p-6 bg-white shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <h4 className="font-semibold text-gray-900">Blocking (Hard Mitigation)</h4>
                                </div>
                                <p className="text-gray-600 text-sm mb-2">
                                    <strong>Trigger:</strong> Risk Score &ge; 0.9 or extreme rate limit violation.
                                </p>
                                <p className="text-gray-600 text-sm">
                                    <strong>Action:</strong> Immediate 429 Too Many Requests. This protects your backend from going down.
                                </p>
                            </div>
                        </div>
                    </Section>

                </div>
            </div>
        </div>
    )
}

function Section({ id, title, children }: { id: string, title: string, children: React.ReactNode }) {
    return (
        <section id={id} className="scroll-mt-32">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                {title}
                <div className="h-px bg-gray-100 flex-grow"></div>
            </h2>
            {children}
        </section>
    )
}

function NavItem({ id, label, active, onClick }: { id: string, label: string, active: string, onClick: (id: string) => void }) {
    const isActive = active === id
    return (
        <li>
            <button
                onClick={() => onClick(id)}
                className={`text-sm font-medium transition-colors ${isActive ? "text-black translate-x-1" : "text-gray-500 hover:text-gray-800"
                    } block w-full text-left flex items-center gap-2`}
            >
                {isActive && <div className="w-1 h-3 bg-black rounded-full" />}
                {label}
            </button>
        </li>
    )
}

function Step({ number, title, children }: { number: number, title: string, children: React.ReactNode }) {
    return (
        <div className="flex gap-4 mb-8 last:mb-0">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                {number}
            </div>
            <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
                <div className="text-sm leading-relaxed">{children}</div>
            </div>
        </div>
    )
}

function CodeBlock({ language, children }: { language: string, children: string }) {
    return (
        <div className="relative group rounded-xl overflow-hidden bg-gray-900 border border-gray-800 shadow-sm my-4">
            <div className="absolute top-2 right-2 text-xs text-gray-500 font-mono uppercase px-2">{language}</div>
            <pre className="p-4 overflow-x-auto text-sm font-mono text-gray-100 leading-relaxed">
                {children}
            </pre>
        </div>
    )
}

function FeatureCard({ title, description }: { title: string, description: string }) {
    return (
        <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    )
}

function InfoCard({ title, children, type = "neutral" }: { title: string, children: React.ReactNode, type?: "neutral" | "warning" }) {
    const colors = type === "warning" ? "bg-amber-50 border-amber-100 text-amber-900" : "bg-gray-50 border-gray-100 text-gray-900"
    return (
        <div className={`p-6 rounded-lg border ${colors}`}>
            <h4 className="font-bold mb-2 text-sm uppercase tracking-wide opacity-80">{title}</h4>
            <p className="text-sm leading-relaxed opacity-90">{children}</p>
        </div>
    )
}

function MetricDef({ label, desc }: { label: string, desc: string }) {
    return (
        <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
            <div className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">{label}</div>
            <div className="text-sm text-gray-600 font-medium">{desc}</div>
        </div>
    )
}
