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
