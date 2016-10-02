jest.mock('../../getGQLType')
jest.mock('../../transformGQLInputValue')
jest.mock('../../createMutationField')

import { ObjectType, stringType } from '../../../../interface'
import getGQLType from '../../getGQLType'
import transformGQLInputValue from '../../transformGQLInputValue'
import createMutationField from '../../createMutationField'
import createProcedureMutationGQLFieldEntry from '../createProcedureMutationGQLFieldEntry'

getGQLType.mockImplementation((buildToken, type) => type)
createMutationField.mockImplementation((buildToken, config) => config)

const mockInputType = ({} = {}) => new ObjectType({
  name: 'bar',
  fields: new Map([
    ['a', { type: Symbol() }],
    ['b', { type: Symbol() }],
    ['c', { type: Symbol() }],
  ])
})

const mockProcedureSingleOutput = ({
  name = 'foo',
  isStable = false,
  inputType = mockInputType(),
  outputType = stringType,
  execute = jest.fn(),
} = {}) => ({
  name,
  isStable,
  inputType,
  output: {
    kind: 'SINGLE',
    outputType,
    execute,
  },
})

test('will correctly create a mutation field entry', () => {
  const buildToken = Symbol()
  const procedure = mockProcedureSingleOutput({ name: 'hello-world' })
  const fieldEntry = createProcedureMutationGQLFieldEntry(buildToken, procedure)
  expect(fieldEntry[0]).toBe('helloWorld')
  expect(fieldEntry[1].name).toBe('hello-world')
  expect(fieldEntry[1].inputFields.length).toBe(3)
  expect(fieldEntry[1].inputFields[0][0]).toBe('a')
  expect(fieldEntry[1].inputFields[0][1].type).toBe(procedure.inputType.fields.get('a').type)
  expect(fieldEntry[1].inputFields[1][0]).toBe('b')
  expect(fieldEntry[1].inputFields[1][1].type).toBe(procedure.inputType.fields.get('b').type)
  expect(fieldEntry[1].inputFields[2][0]).toBe('c')
  expect(fieldEntry[1].inputFields[2][1].type).toBe(procedure.inputType.fields.get('c').type)
  expect(fieldEntry[1].outputFields.length).toBe(1)
  expect(fieldEntry[1].outputFields[0][0]).toBe('string')
  expect(fieldEntry[1].outputFields[0][1].type).toBe(procedure.output.outputType)
  const value = Symbol()
  expect(fieldEntry[1].outputFields[0][1].resolve(value)).toBe(value)

  expect(getGQLType.mock.calls).toEqual([
    [buildToken, procedure.inputType.fields.get('a').type, true],
    [buildToken, procedure.inputType.fields.get('b').type, true],
    [buildToken, procedure.inputType.fields.get('c').type, true],
    [buildToken, procedure.output.outputType, false],
  ])
})
