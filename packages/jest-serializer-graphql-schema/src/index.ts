import { GraphQLSchema, isSchema, printSchema } from "graphql";
import { Plugin } from "pretty-format";
import { consistentlyOrderedSchema } from "./consistentlyOrderedSchema";

export const test: Plugin["test"] = (val: any) => {
  return isSchema(val);
};
export const serialize = (schema: GraphQLSchema) => {
  return printSchema(consistentlyOrderedSchema(schema));
};
