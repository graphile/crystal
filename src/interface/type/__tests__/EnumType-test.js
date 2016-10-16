import NamedType from '../NamedType'
import EnumType from '../EnumType'

test('is instance of NamedType', () => {
  expect(new EnumType({}) instanceof NamedType).toBe(true)
})

test('variants will return the variants', () => {
  const name = Symbol('name')
  const variants = new Set(['a', 'b'])
  const enumType = new EnumType({ name, variants })
  expect(enumType.variants).toBe(variants)
})
