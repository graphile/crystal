/* eslint-disable no-process-env */

import { Catalog, Schema, Table, Column, Type, Enum } from '#/postgres/catalog.js'

export const PG_CONFIG = process.env.TEST_DB || 'postgres://localhost:5432/postgraphql_test'

export class TestCatalog extends Catalog {
  constructor ({ ...config } = {}) {
    super({ ...config })
  }
}

export class TestSchema extends Schema {
  constructor ({ name = 'test', catalog = new TestCatalog(), ...config } = {}) {
    super({ name, catalog, ...config })
    this.catalog.addSchema(this)
    this.catalog.addTable(new TestTable({ schema: this }))
  }
}

export class TestTable extends Table {
  constructor ({ name = 'test', schema = new TestSchema(), ...config } = {}) {
    super({ name, schema, ...config })
    this.schema.catalog.addTable(this)
    this.schema.catalog.addColumn(new TestColumn({ table: this, isPrimaryKey: true }))
  }
}

export class TestColumn extends Column {
  constructor ({ name = 'test', table = new TestTable(), type = new TestType(), ...config } = {}) {
    super({ name, table, type, ...config })
    this.table.schema.catalog.addColumn(this)
  }
}

export class TestType extends Type {
  constructor (id = 0) {
    super(id)
  }
}

export class TestEnum extends Enum {
  constructor ({ name = 'test', schema = new TestSchema(), ...config } = {}) {
    super({ name, schema, ...config })
  }
}
