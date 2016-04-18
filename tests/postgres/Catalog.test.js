import expect from 'expect'
import { Table, Column } from '#/postgres/Catalog.js'

describe('Catalog', () => {
  describe('Table', () => {
    it('will get a pascal case type name', () => {
      expect(new Table({ name: 'hello_world' }).getTypeName()).toEqual('HelloWorld')
    })

    it('will get a markdown pascal case name', () => {
      expect(new Table({ name: 'hello_world' }).getMarkdownTypeName()).toEqual('`HelloWorld`')
    })

    it('will get a camel case field name', () => {
      expect(new Table({ name: 'hello_world' }).getFieldName()).toEqual('helloWorld')
    })
  })

  describe('Column', () => {
    it('will get a camel case field name', () => {
      expect(new Column({ name: 'hello_world' }).getFieldName()).toEqual('helloWorld')
    })

    it('will get a markdown camel case field name', () => {
      expect(new Column({ name: 'hello_world' }).getMarkdownFieldName()).toEqual('`helloWorld`')
    })

    it('will rename `id` to `rowId` for field names', () => {
      expect(new Column({ name: 'id' }).getFieldName()).toEqual('rowId')
    })
  })
})
