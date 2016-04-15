/* eslint-disable no-process-env */

import { assign } from 'lodash'
import pg from 'pg'
import { Catalog, Schema, Table, Column, Enum } from '#/postgres/getCatalog.js'

export const PG_CONFIG = process.env.TEST_DB || 'postgres://localhost:5432/postgraphql_test'

// We acquire a single client here which we will use for all tests because we
// don’t care about concurrency. Mocha runs tests sequentially.
const client = pg.connectAsync(PG_CONFIG)

// We release our acquired client here.
after(() => pg.end())

// Nice convenience function for getting the client.
export const getClient = () => client

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
  constructor ({ name = 'test', table = new TestTable(), enum_, ...config } = {}) {
    super({ name, table, ...config })
    this._enum = enum_
  }

  getEnum () {
    return this._enum || super.getEnum()
  }
}

export class TestEnum extends Enum {
  constructor ({ name = 'test', schema = new TestSchema(), ...config } = {}) {
    super({ name, schema, ...config })
  }
}
