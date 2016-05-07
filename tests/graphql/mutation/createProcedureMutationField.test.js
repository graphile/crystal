import expect from 'expect'
import { GraphQLNonNull, GraphQLObjectType, GraphQLInputObjectType, GraphQLString } from 'graphql'
import { TestProcedure, TestType } from '../../helpers.js'
import createProcedureMutationField from '#/graphql/mutation/createProcedureMutationField.js'

describe('createProcedureMutationField', () => {
  it('returns a field with a single argument', () => {
    const field = createProcedureMutationField(new TestProcedure())
    expect(field.args.input.type).toBeA(GraphQLNonNull)
    expect(field.args.input.type.ofType).toBeA(GraphQLInputObjectType)
    expect(field.args.input.type.ofType.name).toEqual('TestInput')
  })

  it('will have a `clientMutationId` field in input', () => {
    const field = createProcedureMutationField(new TestProcedure())
    expect(field.args.input.type.ofType.getFields().clientMutationId.type).toBe(GraphQLString)
  })

  it('creates an input type which will use procedure arguments', () => {
    const field = createProcedureMutationField(new TestProcedure({
      args: new Map([
        ['a', new TestType()],
        ['b', new TestType()],
      ]),
    }))
    expect(field.args.input.type.ofType.getFields()).toIncludeKeys(['a', 'b'])
    expect(field.args.input.type.ofType.getFields().a.type).toBe(GraphQLString)
    expect(field.args.input.type.ofType.getFields().b.type).toBe(GraphQLString)
  })

  it('will make strict procedures have required input types', () => {
    const field = createProcedureMutationField(new TestProcedure({
      isStrict: true,
      args: new Map([
        ['a', new TestType()],
        ['b', new TestType()],
      ]),
    }))
    expect(field.args.input.type.ofType.getFields()).toIncludeKeys(['a', 'b'])
    expect(field.args.input.type.ofType.getFields().a.type).toBeA(GraphQLNonNull)
    expect(field.args.input.type.ofType.getFields().b.type).toBeA(GraphQLNonNull)
    expect(field.args.input.type.ofType.getFields().a.type.ofType).toBe(GraphQLString)
    expect(field.args.input.type.ofType.getFields().b.type.ofType).toBe(GraphQLString)
  })

  it('will create an object payload type', () => {
    const field = createProcedureMutationField(new TestProcedure())
    expect(field.type).toBeA(GraphQLObjectType)
    expect(field.type.name).toEqual('TestPayload')
  })

  it('the payload will have a field name named output', () => {
    const field = createProcedureMutationField(new TestProcedure())
    expect(field.type.getFields().output.type).toBe(GraphQLString)
  })
})
