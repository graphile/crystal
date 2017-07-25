// @flow
import { defaultPlugins, getBuilder } from "graphql-build";
import {
  defaultPlugins as pgDefaultPlugins,
  inflections,
} from "graphql-build-pg";
import type { Pool, Client } from "pg";
import type { Plugin, Options, SchemaListener } from "graphql-build";

const ensureValidPlugins = (name, arr) => {
  if (!Array.isArray(arr)) {
    throw new Error(`Option '${name}' should be an array`);
  }
  for (let i = 0, l = arr.length; i < l; i++) {
    const fn = arr[i];
    if (typeof fn !== "function") {
      throw new Error(
        `Option '${name}' should be an array of functions, found '${typeof fn}' at index ${i}`
      );
    }
  }
};

type PostGraphQLOptions = {
  dynamicJson?: boolean,
  classicIds?: boolean,
  disableDefaultMutations?: string,
  nodeIdFieldName?: string,
  graphqlBuildOptions?: Options,
  replaceAllPlugins?: Array<Plugin>,
  appendPlugins?: Array<Plugin>,
  prependPlugins?: Array<Plugin>,
  jwtPgTypeIdentifier?: string,
  jwtSecret?: string,
};

type PgConfig = Client | Pool | string;

const getPostGraphQLBuilder = async (
  pgConfig,
  schemas,
  options: PostGraphQLOptions = {}
) => {
  const { dynamicJson, classicIds, nodeIdFieldName } = options;
  const {
    replaceAllPlugins,
    appendPlugins = [],
    prependPlugins = [],
    jwtPgTypeIdentifier,
    jwtSecret,
    disableDefaultMutations,
    graphqlBuildOptions,
  } = options;
  if (replaceAllPlugins) {
    ensureValidPlugins("replaceAllPlugins", replaceAllPlugins);
  }
  ensureValidPlugins("prependPlugins", prependPlugins);
  ensureValidPlugins("appendPlugins", appendPlugins);
  return getBuilder(
    replaceAllPlugins
      ? [...prependPlugins, ...replaceAllPlugins, ...appendPlugins]
      : [
          ...prependPlugins,
          ...defaultPlugins,
          ...pgDefaultPlugins,
          ...appendPlugins,
        ],
    Object.assign(
      {
        pgConfig: pgConfig,
        pgSchemas: Array.isArray(schemas) ? schemas : [schemas],
        pgExtendedTypes: !!dynamicJson,
        pgInflection: classicIds
          ? inflections.postGraphQLClassicIdsInflection
          : inflections.postGraphQLInflection,
        nodeIdFieldName: nodeIdFieldName || (classicIds ? "id" : "nodeId"),
        pgJwtTypeIdentifier: jwtPgTypeIdentifier,
        pgJwtSecret: jwtSecret,
        pgDisableDefaultMutations: disableDefaultMutations,
      },
      graphqlBuildOptions
    )
  );
};

export const createPostGraphQLSchema = async (
  pgConfig: PgConfig,
  schemas: Array<string> | string,
  options: PostGraphQLOptions = {}
) => {
  const builder = await getPostGraphQLBuilder(pgConfig, schemas, options);
  return builder.buildSchema();
};

/*
 * Unless an error occurs, `onNewSchema` is guaranteed to be called before this promise resolves
 */
export const watchPostGraphQLSchema = async (
  pgConfig: PgConfig,
  schemas: Array<string> | string,
  options: PostGraphQLOptions = {},
  onNewSchema: SchemaListener
) => {
  if (typeof onNewSchema !== "function") {
    throw new Error(
      "You cannot call watchPostGraphQLSchema without a function to pass new schemas to"
    );
  }
  const builder = await getPostGraphQLBuilder(pgConfig, schemas, options);
  let released = false;
  await builder.watchSchema(onNewSchema);

  return async function release() {
    if (released) return;
    released = true;
    await builder.unwatchSchema();
  };
};
