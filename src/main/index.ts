import * as _Memcached from 'memcached'
import { MemcachedMissingKey } from './errors'
import { Decoders, Encoders, PopulateFunction, Servers } from './types'

export class Memcached {
    private client: _Memcached
    private encoders: Encoders
    private decoders: Decoders

    constructor(servers: Servers, decoders: Decoders = {}) {
        this.client = new _Memcached(servers)
        this.encoders = {}
        this.decoders = {}
    }

    public async get<T>(key: string, fn?: PopulateFunction<T>, ttl?: number): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.client.get(key, (err: any, data: any) => {
                console.log('err: ', err)
                console.log('data: ', data)
                if (err !== undefined) {
                    reject(err)

                } else if (data === undefined && fn !== undefined) {
                    return fn().then((val: T): T => {
                        this.set(key, val, ttl)
                        return val
                    })

                } else if (data === undefined) {
                    reject(new MemcachedMissingKey(key))

                } else {
                    resolve(this.decodeValueForKey(key, data))

                }
            })
        })
    }

    public async getWithDefault<T>(key: string, defaultValue: T): Promise<T> {
        return this.get<T>(key).catch((err: any) => {
            return defaultValue
        })
    }

    public async set<T>(key: string, value: T, ttl: number = 60): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.client.set(key, this.encodeValueForKey(key, value), ttl, (err: any, result: boolean) => {
                if (err !== undefined) {
                    reject(err)

                } else {
                    resolve(result)
                }
            })
        })
    }

    private encodeValueForKey(key: string, value: any): any {
        if (this.encoders[key]) {
            return this.encoders[key](value)

        } else {
            return value
        }
    }

    private decodeValueForKey(key: string, value: any): any {
        if (this.decoders[key]) {
            return this.decoders[key](value)

        } else {
            return value
        }
    }
}
