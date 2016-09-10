import idSerde from '../idSerde'

test('serialize will serialize an id', () => {
  expect(idSerde.serialize({ name: 'name', key: 'key' })).toBe('WyJuYW1lIiwia2V5Il0=')
})

test('deserialize will deserialize an id', () => {
  expect(idSerde.deserialize('WyJuYW1lIiwia2V5Il0=')).toEqual({ name: 'name', key: 'key' })
})
