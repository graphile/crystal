import Type from './Type'
import ObjectType from './ObjectType'

/**
 * A basic object type is a shortcut for creating a simple `ObjectType`. A basic
 * object type’s value is an object whose key/value pairs match the fields for
 * this type.
 */
class BasicObjectType implements ObjectType<BasicObjectType.Value> {
  public readonly kind: 'OBJECT' = 'OBJECT'
  public readonly name: string
  public readonly description: string | undefined
  public readonly fields: Map<string, ObjectType.Field<BasicObjectType.Value, mixed>>

  constructor ({
    name,
    description,
    fields,
  }: {
    name: string,
    description?: string | undefined,
    fields: Map<string, BasicObjectType.Field<mixed>>,
  }) {
    this.name = name
    this.description = description

    this.fields = new Map(Array.from(fields).map<[string, ObjectType.Field<BasicObjectType.Value, mixed>]>(
      ([fieldName, field]) => [fieldName, {
        description: field.description,
        type: field.type,
        getValue: value => value[fieldName],
      }],
    ))
  }

  public fromFields (fields: Map<string, mixed>): BasicObjectType.Value {
    const object = {}

    Array.from(this.fields).forEach(([fieldName, field]) => {
      const fieldValue = fields.get(fieldName)

      if (!field.type.isTypeOf(fieldValue))
        throw new Error(`Field value for '${fieldName}' is not of the correct type.`)

      object[fieldName] = fieldValue
    })

    return object
  }

  public isTypeOf (value: mixed): value is BasicObjectType.Value {
    if (value === null || typeof value !== 'object')
      return false

    for (const fieldName of Object.keys(value)) {
      const field = this.fields.get(fieldName)
      if (!field)
        return false
      if (!field.type.isTypeOf(value[fieldName]))
        return false
    }

    return true
  }
}

namespace BasicObjectType {
  export type Value = { [fieldName: string]: mixed }

  export type Field<T> = {
    description?: string | undefined,
    type: Type<T>,
  }
}

export default BasicObjectType
