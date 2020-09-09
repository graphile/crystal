import { GraphQLSchema, isSchema, printSchema } from "graphql";
import { NewPlugin } from "pretty-format";

const GraphQLSchemaSnapshotSerializer: NewPlugin = {
  test(val: any) {
    return isSchema(val);
  },
  serialize(schema: GraphQLSchema) {
    return printSchema(schema);
  },
};

module.exports = GraphQLSchemaSnapshotSerializer;
