/* eslint-disable no-process-env */

import { assign } from 'lodash'
import { Catalog, Schema, Table, Column, Enum } from '#/postgres/Catalog.js'

export const PG_CONFIG = process.env.TEST_DB || 'postgres://localhost:5432/postgraphql_test'

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
      (columns || [new TestColumn({ table: this, isPrimaryKey: true })])
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
