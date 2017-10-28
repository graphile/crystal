// @flow
import { defaultPlugins, getBuilder } from "graphile-build";
import {
  defaultPlugins as pgDefaultPlugins,
  inflections,
  Inflector,
} from "graphile-build-pg";
import type { Pool, Client } from "pg";
import type { Plugin, Options, SchemaListener } from "graphile-build";
import type { Build, Context } from "graphile-build";

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
  inflector?: Inflector,
  pgColumnFilter?: (mixed, Build, Context) => boolean,
  viewUniqueKey?: string,
};

type PgConfig = Client | Pool | string;

export { inflections };

export const postGraphQLBaseOverrides = {
  enumName(value: string) {
    return inflections.defaultUtils.constantCase(
      inflections.defaultInflection.enumName(value)
    );
  },
};

export const postGraphQLClassicIdsOverrides = {
  column(name: string, _table: string, _schema: ?string) {
    return name === "id" ? "rowId" : inflections.defaultUtils.camelCase(name);
  },
};

export const postGraphQLInflection = inflections.newInflector(
  postGraphQLBaseOverrides
);
export const postGraphQLClassicIdsInflection = inflections.newInflector(
  Object.assign({}, postGraphQLBaseOverrides, postGraphQLClassicIdsOverrides)
);

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
    inflector,
    pgColumnFilter,
    viewUniqueKey,
  } = options;
  if (replaceAllPlugins) {
    ensureValidPlugins("replaceAllPlugins", replaceAllPlugins);
    if (
      (prependPlugins && prependPlugins.length) ||
      (appendPlugins && appendPlugins.length)
    ) {
      throw new Error(
        "When using 'replaceAllPlugins' you must not specify 'appendPlugins'/'prependPlugins'"
      );
    }
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
        pgColumnFilter: pgColumnFilter || (() => true),
        pgInflection:
          inflector ||
          (classicIds
            ? postGraphQLClassicIdsInflection
            : postGraphQLInflection),
        nodeIdFieldName: nodeIdFieldName || (classicIds ? "id" : "nodeId"),
        pgJwtTypeIdentifier: jwtPgTypeIdentifier,
        pgJwtSecret: jwtSecret,
        pgDisableDefaultMutations: disableDefaultMutations,
        pgViewUniqueKey: viewUniqueKey,
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
