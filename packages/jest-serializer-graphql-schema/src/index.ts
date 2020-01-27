import { GraphQLSchema, isSchema, printSchema } from "graphql";
import { Plugin } from "pretty-format";

const GraphQLSchemaSnapshotSerializer: Plugin = {
  test(val: any) {
    return isSchema(val);
  },
  serialize(schema: GraphQLSchema) {
    return printSchema(schema);
  },
};

module.exports = GraphQLSchemaSnapshotSerializer;
