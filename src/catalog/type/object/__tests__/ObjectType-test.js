import test from 'ava'
import NamedType from '../../NamedType'
import ObjectType from '../ObjectType'

test('is an instance of NamedType', t => {
  t.true(new ObjectType() instanceof NamedType)
})
