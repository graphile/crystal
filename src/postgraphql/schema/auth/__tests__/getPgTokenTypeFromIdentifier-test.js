import withPgClient from '../../../../__tests__/utils/withPgClient'
import introspectDatabase from '../../../../postgres/introspection/introspectDatabase'
import getPgTokenTypeFromIdentifier from '../getPgTokenTypeFromIdentifier'

// good names start with a letter or underscore and may also contain numbers after position 0
const goodNames = [
  'test', 'test_0', 'test_1', 'test_2', 'test_3', 'test_4', 'test_5', 'test_6', 'test_7', 'test_8', 'test_9', '_test',
]

goodNames.forEach(goodName => {
  test(`Good schema name ${goodName} should allow create without error`, withPgClient(async client => {
    await client.query(`create schema ${goodName}; create type ${goodName}.jwt_token as (role text, exp integer, a integer, b integer, c integer)`)

    let catalog   = await introspectDatabase(client, [goodName])
    let tokenType = getPgTokenTypeFromIdentifier(catalog, `${goodName}.jwt_token`)

    expect(tokenType.name).toBe('jwt_token')
  })
})

// schema, type, etc... names are not allowed to start with numbers
const badNames = [
  '0_test', '1_test', '2_test', '3_test', '4_test', '5_test', '6_test', '7_test', '8_test', '9_test',
]

badNames.forEach(badName => {
  test(`Bad schema name ${badName} should throw a syntax error on create`, withPgClient(async client => {
    let badQuery = 'not an error'

    try {
      badQuery = await client.query(`create schema ${badName}; create type ${badName}.jwt_token as (role text, exp integer, a integer, b integer, c integer)`)
    } catch (e) {
      badQuery = e
    }

    // unfortunately we only get a generic error with the text "syntax error" from the client
    expect(badQuery instanceof Error && /syntax/.test(badQuery)).toBe(true)
  })
}
