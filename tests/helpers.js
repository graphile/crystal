/* eslint-disable no-process-env */

import * as c from '#/postgres/catalog.js'

export const PG_CONFIG = process.env.TEST_DB || 'postgres://localhost:5432/postgraphql_test'

export class TestCatalog extends c.Catalog {
  constructor ({ ...config } = {}) {
    super({ ...config })
  }
}

export class TestSchema extends c.Schema {
  constructor ({ name = 'test', catalog = new TestCatalog(), ...config } = {}) {
    super({ name, catalog, ...config })
    this.catalog.addSchema(this)
    this.catalog.addTable(new TestTable({ schema: this }))
  }
}

export class TestTable extends c.Table {
  constructor ({ name = 'test', schema = new TestSchema(), isInsertable = true, isUpdatable = true, isDeletable = true, ...config } = {}) {
    super({ name, schema, isInsertable, isUpdatable, isDeletable, ...config })
    this.schema.catalog.addTable(this)
    this.schema.catalog.addColumn(new TestColumn({ table: this, isPrimaryKey: true }))
  }
}

export class TestColumn extends c.Column {
  constructor ({ name = 'test', table = new TestTable(), type = new TestType(), ...config } = {}) {
    super({ name, table, type, ...config })
    this.table.schema.catalog.addColumn(this)
  }
}

export class TestType extends c.Type {
  constructor (id = 0) {
    super(id)
  }
}

export class TestDomain extends c.Domain {
  constructor ({ id = 0, baseTypeId = 0, name = 'test', schema = new TestSchema() } = {}) {
    super({ id, name, schema, baseType: new TestType(baseTypeId) })
  }
}

export class TestEnum extends c.Enum {
  constructor ({ name = 'test', schema = new TestSchema(), ...config } = {}) {
    super({ name, schema, ...config })
  }
}

export class TestProcedure extends c.Procedure {
  constructor ({
    name = 'test',
    schema = new TestSchema(),
    returnType = new TestType(),
    ...config,
  } = {}) {
    super({ name, schema, returnType, ...config })
  }
}
