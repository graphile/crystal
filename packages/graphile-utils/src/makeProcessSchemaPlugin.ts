import { SchemaBuilder } from "graphile-build";

type ProcessSchemaFunction = (
  schema: import("graphql").GraphQLSchema
) => import("graphql").GraphQLSchema;
export default function makeProcessSchemaPlugin(
  schemaCallback: ProcessSchemaFunction
) {
  return (builder: SchemaBuilder) => {
    builder.hook("finalize", schemaCallback);
  };
}
