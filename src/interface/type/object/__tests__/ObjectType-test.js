import NamedType from '../../NamedType'
import ObjectType from '../ObjectType'

test('is an instance of NamedType', () => {
  expect(new ObjectType() instanceof NamedType).toBe(true)
})
