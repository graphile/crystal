import pluralize = require('pluralize')
import { GraphQLList, GraphQLFieldConfig, GraphQLInputFieldConfig } from 'graphql'
import { Type, NullableType, ListType, ObjectType, Procedure } from '../../../interface'
import { formatName } from '../../utils'
import BuildToken from '../BuildToken'
import getGQLType from '../getGQLType'
import transformGQLInputValue from '../transformGQLInputValue'
import createMutationGQLField from '../createMutationGQLField'
import createConnectionGQLField from '../connection/createConnectionGQLField'

/**
 * Creates the mutation field entry for a procedure. Depending on the output
 * variant it may be one of many different forms.
 *
 * Note that we do not check `Procedure#isStable` in this method. Callers
 * should ensure that the procedure is stable before creating a mutation for
 * it.
 */
export default function createProcedureMutationGQLFieldEntry (
  buildToken: BuildToken,
  procedure: Procedure,
): [string, GraphQLFieldConfig<mixed, mixed>] {
  // Depending on the procedure output, we may create different kinds of
  // procedures.
  switch (procedure.output.kind) {
    case 'SINGLE':
      return createProcedureWithSingleOutputMutationGQLFieldEntry(buildToken, procedure as any)
    case 'PAGINATOR':
      return createProcedureWithPaginatorOutputMutationGQLFieldEntry(buildToken, procedure as any)
  }
}

/**
 * Creates a mutation field for `Procedure`s with a single output. A fairly
 * simple mutation by all means.
 */
function createProcedureWithSingleOutputMutationGQLFieldEntry <TOutputValue>(
  buildToken: BuildToken,
  procedure: Procedure & { output: Procedure.SingleOutput<TOutputValue> },
): [string, GraphQLFieldConfig<mixed, mixed>] {
  const { name } = procedure
  const output: Procedure.SingleOutput<TOutputValue> = procedure.output

  // The input fields of the object type for this procedure are simply turned
  // into the input field entries for our GraphQL mutation.
  const inputFields =
    Array.from(procedure.inputType.fields)
      .map<[string, GraphQLInputFieldConfig<mixed> & { internalName: string }]>(([fieldName, field]) =>
        [formatName.field(fieldName), {
          // TODO: description
          type: getGQLType(buildToken, field.type, true),
          internalName: fieldName,
        }]
      )

  return [formatName.field(name), createMutationGQLField<TOutputValue>(buildToken, {
    name,
    inputFields,

    outputFields: [
      // We just have a single output field which is simply the type returned
      // by the procedure.
      [formatName.field(getTypeOutputFieldName(output.outputType)), {
        // TODO: description
        type: getGQLType(buildToken, output.outputType, false),
        resolve: value => value,
      }],
    ],

    // Execute the procedure.
    // TODO: Test this
    execute: async (context, input) =>
      await output.execute(
        context,
        // Reconstruct the correct input object map for our procedure before
        // execution.
        // TODO: We use this logic a lot, extract it into a module and test
        // that module.
        new Map(inputFields.map<[string, mixed]>(([gqlFieldName, gqlField]) =>
          [gqlField.internalName, transformGQLInputValue(gqlField.type, input[gqlFieldName])]
        ))
      ),
  })]
}

/**
 * Gets the mutation output field name for a given type. Normally this will
 * just find the named type and use that name. However, if the type is a list
 * type then the named type’s name will be pluralized.
 */
function getTypeOutputFieldName (type: Type<mixed>): string {
  // For nullable types, just get the name of the non null variant.
  if (type instanceof NullableType)
    return getTypeOutputFieldName(type.nonNullType)

  // For list types, pluralize the name of the item type.
  if (type instanceof ListType)
    return pluralize(getTypeOutputFieldName(type.itemType))

  // Otherwise just get the name of the named type.
  return type.getNamedType().name
}

/**
 * Creates a mutation field for procedures with a paginator output. Instead of
 * returning a connection (this is a mutation, a connection would make no
 * sense!), we return *all* of the values.
 */
function createProcedureWithPaginatorOutputMutationGQLFieldEntry <TItemOutputValue>(
  buildToken: BuildToken,
  procedure: Procedure & { output: Procedure.PaginatorOutput<TItemOutputValue> },
): [string, GraphQLFieldConfig<mixed, mixed>] {
  const { name } = procedure
  const output: Procedure.PaginatorOutput<TItemOutputValue> = procedure.output

  // The input fields of the object type for this procedure are simply turned
  // into the input field entries for our GraphQL mutation.
  const inputFields =
    Array.from(procedure.inputType.fields)
      .map<[string, GraphQLInputFieldConfig<mixed> & { internalName: string }]>(([fieldName, field]) =>
        [formatName.field(fieldName), {
          // TODO: description
          type: getGQLType(buildToken, field.type, true),
          internalName: fieldName,
        }]
      )

  return [formatName.field(name), createMutationGQLField<Array<TItemOutputValue>>(buildToken, {
    name,
    inputFields,

    // Our one output field is the connection output field.
    outputFields: [
      [formatName.field(pluralize(output.paginator.itemType.getNamedType().name)), {
        // TODO: description
        type: new GraphQLList(getGQLType(buildToken, output.paginator.itemType, false)),
        resolve: value => value,
      }],
    ],

    // For our execution we will read all of the values in our paginator.
    execute: async (context, gqlInput) => {
      // Create our input object from
      const input = new Map(inputFields.map<[string, mixed]>(([gqlFieldName, gqlField]) =>
        [gqlField.internalName, transformGQLInputValue(gqlField.type, gqlInput[gqlFieldName])]
      ))

      // Read all of the values in the default ordering of our paginator. We
      // don’t care about cursors, ordering, or limits. We just want everything
      // here.
      const { values } = await output.paginator.defaultOrdering.readPage(context, input, {})

      // Return only the values excluding cursors.
      return values.map(({ value }) => value)
    },
  })]
}
