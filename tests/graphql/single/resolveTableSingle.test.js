/* eslint-disable camelcase */

import expect, { createSpy } from 'expect'
import { noop } from 'lodash'
import { TestSchema, TestTable, TestColumn } from '../helpers.js'
import resolveTableSingle from '#/graphql/single/resolveTableSingle.js'

describe('resolveTableSingle', () => {
  it('is null when nothing is returned', async () => {
    const resolve = resolveTableSingle(new TestTable({ name: 'lol' }))

    const client = {
      queryAsync: createSpy().andReturn({
        rows: [],
      }),
    }

    expect(await resolve({}, {}, { client })).toNotExist()

    expect(client.queryAsync.calls[0].arguments).toEqual([{
      name: 'test_lol_single',
      text: 'select * from "test"."lol" where true limit 1',
      values: [],
    }])
  })

  it('returns the value when one is returned', async () => {
    const resolve = resolveTableSingle(new TestTable({
      name: 'unicorn',
      schema: new TestSchema({ name: 'pony' }),
    }))

    const object = {
      id: 1,
      hello: 'world',
      SomethingLol: 'will not be transformed',
      answer: 42,
    }

    const client = {
      queryAsync: createSpy().andReturn({
        rows: [object],
      }),
    }

    expect(await resolve({}, {}, { client })).toEqual(object)

    expect(client.queryAsync.calls[0].arguments).toEqual([{
      name: 'pony_unicorn_single',
      text: 'select * from "pony"."unicorn" where true limit 1',
      values: [],
    }])
  })

  it('will add a condition for primary key', async () => {
    const resolve = resolveTableSingle(
      new TestTable({
        name: 'person',
        columns: [
          new TestColumn({ name: 'id', isPrimaryKey: true }),
          new TestColumn({ name: 'given_name' }),
          new TestColumn({ name: 'family_name' }),
        ],
      })
    )

    const object = {
      id: 3,
      given_name: 'Test',
      family_name: 'User',
    }

    const client = {
      queryAsync: createSpy().andReturn({
        rows: [object],
      }),
    }

    const client2 = {
      queryAsync: createSpy().andReturn({
        rows: [{ ...object, id: 4, given_name: 'Lol' }],
      }),
    }

    expect(await resolve({}, { id: 3 }, { client })).toEqual(object)
    expect(await resolve({}, { id: 1 }, { client })).toEqual(object)
    expect(await resolve({}, { id: 42 }, { client })).toEqual(object)
    expect(await resolve({}, {}, { client })).toEqual(object)
    expect(await resolve({}, { id: 4 }, { client: client2 })).toEqual({ ...object, id: 4, given_name: 'Lol' })

    const query = {
      name: 'test_person_single',
      text: 'select * from "test"."person" where "id" = $1 limit 1',
    }

    expect(client.queryAsync.calls[0].arguments).toEqual([{ ...query, values: [3] }])
    expect(client.queryAsync.calls[1].arguments).toEqual([{ ...query, values: [1] }])
    expect(client.queryAsync.calls[2].arguments).toEqual([{ ...query, values: [42] }])
    expect(client.queryAsync.calls[3].arguments).toEqual([{ ...query, values: [noop()] }])
  })

  it('will add multiple conditions for compound primary keys', async () => {
    const resolve = resolveTableSingle(
      new TestTable({
        name: 'compound_key',
        columns: [
          new TestColumn({ name: 'id_2', isPrimaryKey: true }),
          new TestColumn({ name: 'id_1', isPrimaryKey: true }),
          new TestColumn({ name: 'id_3', isPrimaryKey: true }),
          new TestColumn({ name: 'other_1' }),
          new TestColumn({ name: 'other_2' }),
        ],
      })
    )

    const object = {
      id_2: 3,
      id_1: 2,
      id_3: 1,
      other_1: 'woodchuck',
      other_2: 'wood',
    }

    const client = {
      queryAsync: createSpy().andReturn({
        rows: [object],
      }),
    }

    expect(await resolve({}, { id1: 3, id2: 2, id3: 1 }, { client })).toEqual(object)
    expect(await resolve({}, { id: 1, id1: 2, id2: 2, id3: 3 }, { client })).toEqual(object)
    expect(await resolve({}, { id: 42 }, { client })).toEqual(object)

    const query = {
      name: 'test_compound_key_single',
      text: 'select * from "test"."compound_key" where "id_2" = $1 and "id_1" = $2 and "id_3" = $3 limit 1',
    }

    expect(client.queryAsync.calls[0].arguments).toEqual([{ ...query, values: [2, 3, 1] }])
    expect(client.queryAsync.calls[1].arguments).toEqual([{ ...query, values: [2, 2, 3] }])
    expect(client.queryAsync.calls[2].arguments).toEqual([{ ...query, values: [noop(), noop(), noop()] }])
  })
})
