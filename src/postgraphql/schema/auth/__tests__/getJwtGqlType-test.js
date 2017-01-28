jest.mock('jsonwebtoken')

import { sign as signJwt } from 'jsonwebtoken'
import { GraphQLScalarType } from 'graphql'
import { NullableType, BasicObjectType, integerType } from '../../../../interface'
import { _createJwtGqlType } from '../getJwtGqlType'

signJwt.mockImplementation(tokenObject => tokenObject)

test('will create a GraphQL scalar type', () => {
  expect(_createJwtGqlType({ name: 'foo' }) instanceof GraphQLScalarType).toBe(true)
})

test('will use the name from the named type', () => {
  expect(_createJwtGqlType({ name: 'foo_bar' }).name).toBe('FooBar')
})

test('will sign a JWT when serialized', () => {
  const jwtSecret = Symbol('jwtSecret')
  const type = _createJwtGqlType(new BasicObjectType({
    name: 'foo',
    fields: new Map([
      ['a', { type: integerType }],
      ['b', { type: integerType }],
      ['c', { type: integerType }],
      ['exp', { type: new NullableType(integerType) }],
    ]),
  }), jwtSecret)
  expect(type.serialize({ a: 1, b: 2, c: 3 })).toEqual({ a: 1, b: 2, c: 3 })
  expect(type.serialize({ a: 1, b: 2, c: 3, exp: 5000 })).toEqual({ a: 1, b: 2, c: 3, exp: 5000 })
  expect(signJwt.mock.calls).toEqual([
    [{ a: 1, b: 2, c: 3 }, jwtSecret, { audience: 'postgraphql', issuer: 'postgraphql', expiresIn: '1 day' }],
    [{ a: 1, b: 2, c: 3, exp: 5000 }, jwtSecret, { audience: 'postgraphql', issuer: 'postgraphql', expiresIn: undefined }],
  ])
})
