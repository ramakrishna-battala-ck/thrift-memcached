import { expect } from 'code'
import * as Lab from 'lab'

import { Memcached } from '../../main'

export const lab = Lab.script()

const describe = lab.describe
const it = lab.it

describe('Memcached', () => {
    it('should set/get string values', async () => {
        const client = new Memcached([ 'localhost:11211' ])
        await client.set('test_1', 'test_value_1')
        const actual = await client.get<string>('test_1')

        expect(actual).to.equal('test_value_1')
    })

    it('should set/get binary values', async () => {
        const client = new Memcached([ 'localhost:11211' ])
        const data = Buffer.from('test_value_2')
        await client.set('test_2', data)
        const rawResult = await client.get<Buffer>('test_2')
        const actual = rawResult.toString('utf-8')

        expect(actual).to.equal('test_value_2')
    })

    it('should reject when fetching missing key', async () => {
        const client = new Memcached([ 'localhost:11211' ])
        return client.get<string>('missing_key').then((val: any) => {
            throw new Error('Should reject for missing key')
        }, (err: any) => {
            expect(err.message).to.equal('Given key[missing_key] does not have a value in Memcached')
        })
    })
})
