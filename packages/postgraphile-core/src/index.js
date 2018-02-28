// @flow
import fs from "fs";
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
  graphileBuildOptions?: Options,
  graphqlBuildOptions?: Options, // DEPRECATED!
  replaceAllPlugins?: Array<Plugin>,
  appendPlugins?: Array<Plugin>,
  prependPlugins?: Array<Plugin>,
  skipPlugins?: Array<Plugin>,
  jwtPgTypeIdentifier?: string,
  jwtSecret?: string,
  inflector?: Inflector,
  pgColumnFilter?: (mixed, Build, Context) => boolean,
  viewUniqueKey?: string,
  enableTags?: boolean,
  readCache?: string,
  writeCache?: string,
  setWriteCacheCallback?: (fn: () => Promise<void>) => void,
  legacyRelations?: "only" | "deprecated",
  setofFunctionsContainNulls?: boolean,
  legacyJsonUuid?: boolean,
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

const awaitKeys = async obj => {
  const result = {};
  for (const k in obj) {
    result[k] = await obj[k];
  }
  return result;
};

const getPostGraphQLBuilder = async (
  pgConfig,
  schemas,
  options: PostGraphQLOptions = {}
) => {
  const {
    dynamicJson,
    classicIds,
    nodeIdFieldName,
    replaceAllPlugins,
    appendPlugins = [],
    prependPlugins = [],
    skipPlugins = [],
    jwtPgTypeIdentifier,
    jwtSecret,
    disableDefaultMutations,
    graphileBuildOptions,
    graphqlBuildOptions, // DEPRECATED!
    inflector,
    pgColumnFilter,
    viewUniqueKey,
    enableTags = true,
    readCache,
    writeCache,
    setWriteCacheCallback,
    legacyRelations = "deprecated", // TODO: Change to 'omit' in v5
    setofFunctionsContainNulls = true,
    legacyJsonUuid = false,
  } = options;

  if (
    legacyRelations &&
    ["only", "deprecated", "omit"].indexOf(legacyRelations) < 0
  ) {
    throw new Error(
      "Invalid configuration for legacy relations: " +
        JSON.stringify(legacyRelations)
    );
  }
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
  if (readCache && writeCache) {
    throw new Error("Use `readCache` or `writeCache` - not both.");
  }

  let persistentMemoizeWithKey = undefined; // NOT null, otherwise it won't default correctly.
  let memoizeCache = {};

  if (readCache) {
    memoizeCache = JSON.parse(
      await new Promise((resolve, reject) => {
        fs.readFile(readCache, "utf8", (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      })
    );
  }
  if (readCache || writeCache) {
    persistentMemoizeWithKey = (key, fn) => {
      if (!(key in memoizeCache)) {
        if (readCache) {
          throw new Error(`Expected cache to contain key: ${key}`);
        }
        memoizeCache[key] = fn();
        if (memoizeCache[key] === undefined) {
          throw new Error(`Cannot memoize 'undefined' - use 'null' instead`);
        }
      }
      return memoizeCache[key];
    };
  }

  if (writeCache && setWriteCacheCallback) {
    setWriteCacheCallback(() =>
      awaitKeys(memoizeCache).then(
        obj =>
          new Promise((resolve, reject) => {
            fs.writeFile(writeCache, JSON.stringify(obj), err => {
              memoizeCache = {};
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          })
      )
    );
  } else if (writeCache) {
    throw new Error("Cannot write cache without 'setWriteCacheCallback'");
  } else if (setWriteCacheCallback) {
    setWriteCacheCallback(() => Promise.resolve());
  }

  ensureValidPlugins("prependPlugins", prependPlugins);
  ensureValidPlugins("appendPlugins", appendPlugins);
  ensureValidPlugins("skipPlugins", skipPlugins);
  return getBuilder(
    (replaceAllPlugins
      ? [...prependPlugins, ...replaceAllPlugins, ...appendPlugins]
      : [
          ...prependPlugins,
          ...defaultPlugins,
          ...pgDefaultPlugins,
          ...appendPlugins,
        ]
    ).filter(p => skipPlugins.indexOf(p) === -1),
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
        pgEnableTags: enableTags,
        pgLegacyRelations: legacyRelations,
        pgLegacyJsonUuid: legacyJsonUuid,
        persistentMemoizeWithKey,
        pgForbidSetofFunctionsToReturnNull: !setofFunctionsContainNulls,
      },
      graphileBuildOptions,
      graphqlBuildOptions // DEPRECATED!
    )
  );
};

function abort(e) {
  /* eslint-disable no-console */
  console.error("Error occured whilst writing cache");
  console.error(e);
  process.exit(1);
  /* eslint-enable */
}

export const createPostGraphQLSchema = async (
  pgConfig: PgConfig,
  schemas: Array<string> | string,
  options: PostGraphQLOptions = {}
) => {
  let writeCache;
  const builder = await getPostGraphQLBuilder(
    pgConfig,
    schemas,
    Object.assign({}, options, {
      setWriteCacheCallback(fn) {
        writeCache = fn;
      },
    })
  );
  const schema = builder.buildSchema();
  if (writeCache) writeCache().catch(abort);
  return schema;
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
  if (options.readCache) {
    throw new Error("Using readCache in watch mode does not make sense.");
  }
  let writeCache;
  const builder = await getPostGraphQLBuilder(
    pgConfig,
    schemas,
    Object.assign({}, options, {
      setWriteCacheCallback(fn) {
        writeCache = fn;
      },
    })
  );
  let released = false;
  function handleNewSchema(...args) {
    if (writeCache) writeCache().catch(abort);
    onNewSchema(...args);
  }
  await builder.watchSchema(handleNewSchema);

  return async function release() {
    if (released) return;
    released = true;
    await builder.unwatchSchema();
  };
};

export const postGraphileBaseOverrides = postGraphQLBaseOverrides;
export const postGraphileClassicIdsOverrides = postGraphQLClassicIdsOverrides;
export const postGraphileInflection = postGraphQLInflection;
export const postGraphileClassicIdsInflection = postGraphQLClassicIdsInflection;
export const createPostGraphileSchema = createPostGraphQLSchema;
export const watchPostGraphileSchema = watchPostGraphQLSchema;
