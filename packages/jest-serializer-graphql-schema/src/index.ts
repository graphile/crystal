import type { GraphQLSchema } from "graphql";
import { isSchema, printSchema } from "graphql";
import type { Plugin } from "pretty-format";

import { consistentlyOrderedSchema } from "./consistentlyOrderedSchema";

export const test: Plugin["test"] = (val) => isSchema(val);
export const serialize = (schema: GraphQLSchema): string => {
  return printSchema(consistentlyOrderedSchema(schema));
};
