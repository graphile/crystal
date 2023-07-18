/*
 * This is the 'entry' file for the 'webpack' example; please see that instead.
 */
import * as grafast from "grafast";
import type { GraphQLSchema } from "grafast/graphql";

// @ts-ignore
import { schema as s } from "../../exported-schema-for-webpack.mjs.js";

const schema: GraphQLSchema = s;

export { grafast, schema };
