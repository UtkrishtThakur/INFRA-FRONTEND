export interface AuthResponse {
    access_token: string
    token_type: string
}

export interface Project {
    id: string
    name: string
    upstream_base_url: string
    created_at: string
}

export interface APIKey {
    id: string
    label?: string
    is_active: boolean
    created_at: string
    api_key?: string
}

export type Domain = {
    id: string
    hostname: string
    verified: boolean
    created_at: string
    verified_at?: string | null
}

export type DomainVerification = {
    type: string
    host: string
    value: string
}

export interface EndpointAnalysis {
    endpoint: string
    severity: "NORMAL" | "WATCH" | "HIGH"
    color: "green" | "yellow" | "red"
    summary: string
    metrics: {
        current_rpm: number
        baseline_rpm: number
        traffic_multiplier: number
        throttle_rate: number
        block_rate: number
        avg_risk_score: number
    }
    securex_action: string
    suggested_action: string | null
}
