import { GraphQLSchema, isObjectType } from "graphql";

import { makeCrystalWrapResolver, $$crystalWrappedResolver } from "./resolvers";

export {
  makeCrystalWrapResolver,
  makeCrystalObjectExtension,
  makeCrystalObjectFieldExtension,
} from "./resolvers";

export { Plan } from "./plan";

/**
 * Ensures that all resolvers in `schema` are wrapped with a crystal resolver wrapper.
 */
export function enforceCrystal(schema: GraphQLSchema): GraphQLSchema {
  const types = Object.values(schema.getTypeMap());
  const crystalWrapResolver = makeCrystalWrapResolver();
  for (const type of types) {
    if (isObjectType(type) && !type.name.startsWith("__")) {
      const fields = type.getFields();
      for (const fieldName in fields) {
        if (
          Object.hasOwnProperty.call(fields, fieldName) &&
          !fieldName.startsWith("__")
        ) {
          const field = fields[fieldName];
          if (!field.resolve || !field.resolve[$$crystalWrappedResolver]) {
            field.resolve = crystalWrapResolver(field.type, field.resolve);
          }
        }
      }
    }
  }
  return schema;
}
