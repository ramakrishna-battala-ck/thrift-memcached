// List of server hosts as strings
export type ServerList = Array<string>

// Map of server host to server priority
export interface ServerPriorityMap {
    [host: string]: number
}

export type Servers =
    ServerList | ServerPriorityMap

export interface Decoders {
    [key: string]: any
}

export interface Encoders {
    [key: string]: any
}

export type PopulateFunction<T> =
    () => Promise<T>

export interface Envelope {
    data: any
    timestamp: number
    ttl: number
}

export interface MemcachedConfig {
    namespace: string
    encoders: any
    decoders: any
}
