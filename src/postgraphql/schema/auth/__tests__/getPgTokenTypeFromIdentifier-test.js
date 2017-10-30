import withPgClient from '../../../../__tests__/utils/withPgClient'
import introspectDatabase from '../../../../postgres/introspection/introspectDatabase'
import getPgTokenTypeFromIdentifier from '../getPgTokenTypeFromIdentifier'

// good names start with a letter or underscore and may also contain numbers after position 0
// note: names that start with a number must be escaped with double quotes
const validNames = [
  '_test', '0_test', 'test_0', '9_test', 'test_9',
]

validNames.forEach(validName => {
  test(`Valid schema name ${validName} and its jwt_token type should create without error and pass validation`, withPgClient(async client => {
    let query = 'not an error'

    try {
      query = await client.query(`create schema "${validName}"; create type "${validName}"."jwt_token" as (role text, exp integer, a integer, b integer, c integer)`)
    } catch (e) {
      query = e
    }

    expect(query).not.toBeInstanceOf(Error)

    let catalog   = await introspectDatabase(client, [validName])
    let tokenType = getPgTokenTypeFromIdentifier(catalog, `"${validName}"."jwt_token"`)

    expect(tokenType.name).toBe('jwt_token')
  }))
})
