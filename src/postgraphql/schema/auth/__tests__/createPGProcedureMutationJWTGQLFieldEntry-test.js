jest.mock('jsonwebtoken')
jest.mock('../../../../graphql/schema/createMutationGQLField')
jest.mock('../../../../graphql/schema/transformGQLInputValue')
jest.mock('../../../../postgres/inventory/pgClientFromContext')

import { sign as signJwt } from 'jsonwebtoken'
import { Inventory } from '../../../../interface'
import createMutationGQLField from '../../../../graphql/schema/createMutationGQLField'
import transformGQLInputValue from '../../../../graphql/schema/transformGQLInputValue'
import withPGClient from '../../../../postgres/__tests__/fixtures/withPGClient'
import { introspectDatabase } from '../../../../postgres/introspection'
import addPGCatalogToInventory from '../../../../postgres/inventory/addPGCatalogToInventory'
import pgClientFromContext from '../../../../postgres/inventory/pgClientFromContext'
import createPGProcedureMutationJWTGQLFieldEntry from '../createPGProcedureMutationJWTGQLFieldEntry'

createMutationGQLField.mockImplementation((buildToken, config) => config)
transformGQLInputValue.mockImplementation((type, value) => value)

const jwtSecret = Symbol('jwtSecret')

let fieldEntry1

beforeAll(withPGClient(async pgClient => {
  const inventory = new Inventory()
  const pgCatalog = await introspectDatabase(pgClient, ['b'])
  addPGCatalogToInventory(inventory, pgCatalog)
  fieldEntry1 = createPGProcedureMutationJWTGQLFieldEntry(
    { inventory },
    pgCatalog,
    pgCatalog.getProcedureByName('b', 'authenticate'),
    jwtSecret,
  )
}))

test('will create a field entry that looks right', () => {
  expect(fieldEntry1).toMatchSnapshot()
})

test('will create a correct execute function', async () => {
  const value = { x: Symbol('x'), y: Symbol('y'), z: Symbol('z') }
  const result = { rows: [{ value }] }
  const pgClient = { query: jest.fn(() => result) }
  pgClientFromContext.mockReturnValue(pgClient)
  const context = Symbol('context')
  const input = { a: Symbol('a'), b: Symbol('b'), c: Symbol('c') }
  const jwtToken = Symbol('jwtToken')
  signJwt.mockReturnValue(jwtToken)
  expect(await fieldEntry1[1].execute(context, input)).toBe(jwtToken)
  expect(pgClientFromContext.mock.calls).toEqual([[context]])
  expect(transformGQLInputValue.mock.calls).toEqual([[fieldEntry1[1].inputFields[0][1].type, input.a], [fieldEntry1[1].inputFields[1][1].type, input.b], [fieldEntry1[1].inputFields[2][1].type, input.c]])
  expect(pgClient.query.mock.calls).toEqual([[{
    text: 'select to_json("b"."authenticate"(($1 + 0), ($2 + 0), ($3 + 0))) as value',
    values: [input.a, input.b, input.c],
  }]])
  expect(signJwt.mock.calls).toEqual([[
    value,
    jwtSecret,
    { audience: 'postgraphql', issuer: 'postgraphql', expiresIn: '1 day' },
  ]])
})
