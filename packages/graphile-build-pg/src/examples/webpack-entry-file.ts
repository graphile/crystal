/*
 * This is the 'entry' file for the 'webpack' example; please see that instead.
 */
import * as dataplanner from "dataplanner";
import type { GraphQLSchema } from "graphql";

// @ts-ignore
import { schema as s } from "../../exported-schema-for-webpack.mjs";

const schema: GraphQLSchema = s;

export { dataplanner, schema };
