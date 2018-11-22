import { GraphQLSchema } from "graphql";
import { SchemaBuilder } from "graphile-build";

type ProcessSchemaFunction = (schema: GraphQLSchema) => GraphQLSchema;
export default function makeProcessSchemaPlugin(
  schemaCallback: ProcessSchemaFunction
) {
  return (builder: SchemaBuilder) => {
    builder.hook("finalize", schemaCallback);
  };
}
