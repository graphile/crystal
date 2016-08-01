import test from 'ava'
import * as id from '../id'

test('serialize will serialize an id', t => {
  t.is(id.serialize({ name: 'name', key: 'key' }), 'WyJuYW1lIiwia2V5Il0=')
})

test('deserialize will deserialize an id', t => {
  t.deepEqual(id.deserialize('WyJuYW1lIiwia2V5Il0='), { name: 'name', key: 'key' })
})
