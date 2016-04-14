/* eslint-disable no-process-env */

// The `../src/postgres/index.js` promisifies `pg` so we need to import it for
// the side effect.
import '../src/postgres'

import { assign } from 'lodash'
import pg from 'pg'
import { Catalog, Schema, Table, Column, Enum, getCatalog } from '../src/postgres/catalog.js'

const TEST_DB = process.env.TEST_DB || 'postgres://localhost:5432/postgraphql_test'

export const connectClient = () => pg.connectAsync(TEST_DB)

// We cache the client here because we aren’t going to release our clients
// back to the pool after every test.
const _client = connectClient()

export const getClient = () => _client
export const getClientCatalog = () => getClient().then(getCatalog)

after(() => pg.end())

export const setupDatabase = query => async () => {
  const client = await pg.connectAsync(TEST_DB)
  await client.queryAsync(`begin;\n${query}\ncommit;`)
  client.end()
}

export class TestCatalog extends Catalog {}

export class TestSchema extends Schema {
  constructor ({ name = 'test', catalog = new TestCatalog(), tables, ...config } = {}) {
    super({ name, catalog, ...config })
    this.tables =
      (tables || [new TestTable({ schema: this })])
      .map(table => assign(table, { schema: this }))
  }
}

export class TestTable extends Table {
  constructor ({ name = 'test', schema = new TestSchema(), columns, ...config } = {}) {
    super({ name, schema, ...config })
    this.columns =
      (columns || [new TestColumn({ table: this })])
      .map(column => assign(column, { table: this }))
  }
}

export class TestColumn extends Column {
  constructor ({ name = 'test', table = new TestTable(), ...config } = {}) {
    super({ name, table, ...config })
  }
}

export class TestEnum extends Enum {
  constructor ({ name = 'test', schema = new TestSchema(), ...config } = {}) {
    super({ name, schema, ...config })
  }
}
