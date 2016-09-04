import test from 'ava'
import idSerde from '../idSerde'

test('serialize will serialize an id', t => {
  t.is(idSerde.serialize({ name: 'name', key: 'key' }), 'WyJuYW1lIiwia2V5Il0=')
})

test('deserialize will deserialize an id', t => {
  t.deepEqual(idSerde.deserialize('WyJuYW1lIiwia2V5Il0='), { name: 'name', key: 'key' })
})
