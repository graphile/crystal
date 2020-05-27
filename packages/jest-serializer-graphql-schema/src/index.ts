import { GraphQLSchema, isSchema, printSchema } from "graphql";
import { Plugin } from "pretty-format";

export const test: Plugin["test"] = (val: any) => {
  return isSchema(val);
};
export const serialize = (schema: GraphQLSchema) => {
  return printSchema(schema);
};
