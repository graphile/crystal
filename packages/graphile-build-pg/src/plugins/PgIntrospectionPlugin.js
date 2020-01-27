// @flow
import type { Plugin } from "graphile-build";
import type { Client } from "pg";
import withPgClient, {
  getPgClientAndReleaserFromConfig,
} from "../withPgClient";
import { parseTags } from "../utils";
import { readFile as rawReadFile } from "fs";
import debugFactory from "debug";
import chalk from "chalk";
import throttle from "lodash/throttle";
import flatMap from "lodash/flatMap";
import { makeIntrospectionQuery } from "./introspectionQuery";

import { version } from "../../package.json";
import queryFromResolveDataFactory from "../queryFromResolveDataFactory";

const debug = debugFactory("graphile-build-pg");
const WATCH_FIXTURES_PATH = `${__dirname}/../../res/watch-fixtures.sql`;

// Ref: https://github.com/graphile/postgraphile/tree/master/src/postgres/introspection/object

export type PgNamespace = {
  kind: "namespace",
  id: string,
  name: string,
  comment: ?string,
  description: ?string,
  tags: { [string]: string },
};

export type PgProc = {
  kind: "procedure",
  id: string,
  name: string,
  comment: ?string,
  description: ?string,
  namespaceId: string,
  namespaceName: string,
  isStrict: boolean,
  returnsSet: boolean,
  isStable: boolean,
  returnTypeId: string,
  argTypeIds: Array<string>,
  argNames: Array<string>,
  argModes: Array<"i" | "o" | "b" | "v" | "t">,
  inputArgsCount: number,
  argDefaultsNum: number,
  namespace: PgNamespace,
  tags: { [string]: string },
  cost: number,
  aclExecutable: boolean,
  language: string,
};

export type PgClass = {
  kind: "class",
  id: string,
  name: string,
  comment: ?string,
  description: ?string,
  classKind: string,
  namespaceId: string,
  namespaceName: string,
  typeId: string,
  isSelectable: boolean,
  isInsertable: boolean,
  isUpdatable: boolean,
  isDeletable: boolean,
  isExtensionConfigurationTable: boolean,
  namespace: PgNamespace,
  type: PgType,
  tags: { [string]: string },
  attributes: Array<PgAttribute>,
  constraints: Array<PgConstraint>,
  foreignConstraints: Array<PgConstraint>,
  primaryKeyConstraint: ?PgConstraint,
  aclSelectable: boolean,
  aclInsertable: boolean,
  aclUpdatable: boolean,
  aclDeletable: boolean,
  canUseAsterisk: boolean,
};

export type PgType = {
  kind: "type",
  id: string,
  name: string,
  comment: ?string,
  description: ?string,
  namespaceId: string,
  namespaceName: string,
  type: string,
  category: string,
  domainIsNotNull: boolean,
  arrayItemTypeId: ?string,
  arrayItemType: ?PgType,
  arrayType: ?PgType,
  typeLength: ?number,
  isPgArray: boolean,
  classId: ?string,
  class: ?PgClass,
  domainBaseTypeId: ?string,
  domainBaseType: ?PgType,
  domainTypeModifier: ?number,
  tags: { [string]: string },
};

export type PgAttribute = {
  kind: "attribute",
  classId: string,
  num: number,
  name: string,
  comment: ?string,
  description: ?string,
  typeId: string,
  typeModifier: number,
  isNotNull: boolean,
  hasDefault: boolean,
  identity: "" | "a" | "d",
  class: PgClass,
  type: PgType,
  namespace: PgNamespace,
  tags: { [string]: string },
  aclSelectable: boolean,
  aclInsertable: boolean,
  aclUpdatable: boolean,
  isIndexed: ?boolean,
  isUnique: ?boolean,
  columnLevelSelectGrant: boolean,
};

export type PgConstraint = {
  kind: "constraint",
  id: string,
  name: string,
  type: string,
  classId: string,
  class: PgClass,
  foreignClassId: ?string,
  foreignClass: ?PgClass,
  comment: ?string,
  description: ?string,
  keyAttributeNums: Array<number>,
  keyAttributes: Array<PgAttribute>,
  foreignKeyAttributeNums: Array<number>,
  foreignKeyAttributes: Array<PgAttribute>,
  namespace: PgNamespace,
  isIndexed: ?boolean,
  tags: { [string]: string },
};

export type PgExtension = {
  kind: "extension",
  id: string,
  name: string,
  namespaceId: string,
  namespaceName: string,
  relocatable: boolean,
  version: string,
  configurationClassIds?: Array<string>,
  comment: ?string,
  description: ?string,
  tags: { [string]: string },
};

export type PgIndex = {
  kind: "index",
  id: string,
  name: string,
  namespaceName: string,
  classId: string,
  numberOfAttributes: number,
  indexType: string,
  isUnique: boolean,
  isPrimary: boolean,
  /*
  Though these exist, we don't want to officially
  support them yet.

  isImmediate: boolean,
  isReplicaIdentity: boolean,
  isValid: boolean,
  */
  isPartial: boolean,
  attributeNums: Array<number>,
  attributePropertiesAsc: ?Array<boolean>,
  attributePropertiesNullsFirst: ?Array<boolean>,
  description: ?string,
  tags: { [string]: string },
};

export type PgEntity =
  | PgNamespace
  | PgProc
  | PgClass
  | PgType
  | PgAttribute
  | PgConstraint
  | PgExtension
  | PgIndex;

export type PgIntrospectionResultsByKind = {
  __pgVersion: number,
  attribute: PgAttribute[],
  attributeByClassIdAndNum: {
    [classId: string]: { [num: string]: PgAttribute },
  },
  class: PgClass[],
  classById: { [classId: string]: PgClass },
  constraint: PgConstraint[],
  extension: PgExtension[],
  extensionById: { [extId: string]: PgExtension },
  index: PgIndex[],
  namespace: PgNamespace[],
  namespaceById: { [namespaceId: string]: PgNamespace },
  procedure: PgProc[],
  type: PgType[],
  typeById: { [typeId: string]: PgType },
};

function readFile(filename, encoding) {
  return new Promise((resolve, reject) => {
    rawReadFile(filename, encoding, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

const removeQuotes = str => {
  const trimmed = str.trim();
  if (trimmed[0] === '"') {
    if (trimmed[trimmed.length - 1] !== '"') {
      throw new Error(
        `We failed to parse a quoted identifier '${str}'. Please avoid putting quotes or commas in smart comment identifiers (or file a PR to fix the parser).`
      );
    }
    return trimmed.substr(1, trimmed.length - 2);
  } else {
    // PostgreSQL lower-cases unquoted columns, so we should too.
    return trimmed.toLowerCase();
  }
};

const parseSqlColumnArray = str => {
  if (!str) {
    throw new Error(`Cannot parse '${str}'`);
  }
  const parts = str.split(",");
  return parts.map(removeQuotes);
};

const parseSqlColumnString = str => {
  if (!str) {
    throw new Error(`Cannot parse '${str}'`);
  }
  return removeQuotes(str);
};

function parseConstraintSpec(rawSpec) {
  const [spec, ...tagComponents] = rawSpec.split(/\|/);
  const parsed = parseTags(tagComponents.join("\n"));
  return {
    spec,
    tags: parsed.tags,
    description: parsed.text,
  };
}

function smartCommentConstraints(introspectionResults) {
  const attributesByNames = (tbl, cols, debugStr) => {
    const attributes = introspectionResults.attribute
      .filter(a => a.classId === tbl.id)
      .sort((a, b) => a.num - b.num);
    if (!cols) {
      const pk = introspectionResults.constraint.find(
        c => c.classId == tbl.id && c.type === "p"
      );
      if (pk) {
        return pk.keyAttributeNums.map(n => attributes.find(a => a.num === n));
      } else {
        throw new Error(
          `No columns specified for '${tbl.namespaceName}.${tbl.name}' (oid: ${tbl.id}) and no PK found (${debugStr}).`
        );
      }
    }
    return cols.map(colName => {
      const attr = attributes.find(a => a.name === colName);
      if (!attr) {
        throw new Error(
          `Could not find attribute '${colName}' in '${tbl.namespaceName}.${tbl.name}'`
        );
      }
      return attr;
    });
  };

  // First: primary keys
  introspectionResults.class.forEach(klass => {
    const namespace = introspectionResults.namespace.find(
      n => n.id === klass.namespaceId
    );
    if (!namespace) {
      return;
    }
    if (klass.tags.primaryKey) {
      if (typeof klass.tags.primaryKey !== "string") {
        throw new Error(
          `@primaryKey configuration of '${klass.namespaceName}.${klass.name}' is invalid; please specify just once "@primaryKey col1,col2"`
        );
      }
      const { spec: pkSpec, tags, description } = parseConstraintSpec(
        klass.tags.primaryKey
      );
      const columns: string[] = parseSqlColumnArray(pkSpec);
      const attributes = attributesByNames(
        klass,
        columns,
        `@primaryKey ${klass.tags.primaryKey}`
      );
      attributes.forEach(attr => {
        attr.tags.notNull = true;
      });
      const keyAttributeNums = attributes.map(a => a.num);
      // Now we need to fake a constraint for this:
      const fakeConstraint = {
        kind: "constraint",
        isFake: true,
        isIndexed: true, // otherwise it gets ignored by ignoreIndexes
        id: Math.random(),
        name: `FAKE_${klass.namespaceName}_${klass.name}_primaryKey`,
        type: "p", // primary key
        classId: klass.id,
        foreignClassId: null,
        comment: null,
        description,
        keyAttributeNums,
        foreignKeyAttributeNums: null,
        tags,
      };
      introspectionResults.constraint.push(fakeConstraint);
    }
  });
  // Now primary keys are in place, we can apply foreign keys
  introspectionResults.class.forEach(klass => {
    const namespace = introspectionResults.namespace.find(
      n => n.id === klass.namespaceId
    );
    if (!namespace) {
      return;
    }
    const getType = () =>
      introspectionResults.type.find(t => t.id === klass.typeId);
    const foreignKey = klass.tags.foreignKey || getType().tags.foreignKey;
    if (foreignKey) {
      const foreignKeys =
        typeof foreignKey === "string" ? [foreignKey] : foreignKey;
      if (!Array.isArray(foreignKeys)) {
        throw new Error(
          `Invalid foreign key smart comment specified on '${klass.namespaceName}.${klass.name}'`
        );
      }
      foreignKeys.forEach((fkSpecRaw, index) => {
        if (typeof fkSpecRaw !== "string") {
          throw new Error(
            `Invalid foreign key spec (${index}) on '${klass.namespaceName}.${klass.name}'`
          );
        }
        const { spec: fkSpec, tags, description } = parseConstraintSpec(
          fkSpecRaw
        );
        const matches = fkSpec.match(
          /^\(([^()]+)\) references ([^().]+)(?:\.([^().]+))?(?:\s*\(([^()]+)\))?$/i
        );
        if (!matches) {
          throw new Error(
            `Invalid foreignKey syntax for '${klass.namespaceName}.${klass.name}'; expected something like "(col1,col2) references schema.table (c1, c2)", you passed '${fkSpecRaw}'`
          );
        }
        const [
          ,
          rawColumns,
          rawSchemaOrTable,
          rawTableOnly,
          rawForeignColumns,
        ] = matches;
        const rawSchema = rawTableOnly
          ? rawSchemaOrTable
          : `"${klass.namespaceName}"`;
        const rawTable = rawTableOnly || rawSchemaOrTable;
        const columns: string[] = parseSqlColumnArray(rawColumns);
        const foreignSchema: string = parseSqlColumnString(rawSchema);
        const foreignTable: string = parseSqlColumnString(rawTable);
        const foreignColumns: string[] | null = rawForeignColumns
          ? parseSqlColumnArray(rawForeignColumns)
          : null;

        const foreignKlass = introspectionResults.class.find(
          k => k.name === foreignTable && k.namespaceName === foreignSchema
        );
        if (!foreignKlass) {
          throw new Error(
            `@foreignKey smart comment referenced non-existant table/view '${foreignSchema}'.'${foreignTable}'. Note that this reference must use *database names* (i.e. it does not respect @name). (${fkSpecRaw})`
          );
        }
        const foreignNamespace = introspectionResults.namespace.find(
          n => n.id === foreignKlass.namespaceId
        );
        if (!foreignNamespace) {
          return;
        }

        const keyAttributeNums = attributesByNames(
          klass,
          columns,
          `@foreignKey ${fkSpecRaw}`
        ).map(a => a.num);
        const foreignKeyAttributeNums = attributesByNames(
          foreignKlass,
          foreignColumns,
          `@foreignKey ${fkSpecRaw}`
        ).map(a => a.num);

        // Now we need to fake a constraint for this:
        const fakeConstraint = {
          kind: "constraint",
          isFake: true,
          isIndexed: true, // otherwise it gets ignored by ignoreIndexes
          id: Math.random(),
          name: `FAKE_${klass.namespaceName}_${klass.name}_foreignKey_${index}`,
          type: "f", // foreign key
          classId: klass.id,
          foreignClassId: foreignKlass.id,
          comment: null,
          description,
          keyAttributeNums,
          foreignKeyAttributeNums,
          tags,
        };
        introspectionResults.constraint.push(fakeConstraint);
      });
    }
  });
}

/* The argument to this must not contain cyclic references! */
const deepClone = value => {
  if (Array.isArray(value)) {
    return value.map(val => deepClone(val));
  } else if (typeof value === "object" && value) {
    return Object.keys(value).reduce((memo, k) => {
      memo[k] = deepClone(value[k]);
      return memo;
    }, {});
  } else {
    return value;
  }
};

export default (async function PgIntrospectionPlugin(
  builder,
  {
    pgConfig,
    pgSchemas: schemas,
    pgEnableTags,
    persistentMemoizeWithKey = (key, fn) => fn(),
    pgThrowOnMissingSchema = false,
    pgIncludeExtensionResources = false,
    pgLegacyFunctionsOnly = false,
    pgSkipInstallingWatchFixtures = false,
    pgOwnerConnectionString,
  }
) {
  /**
   * Introspect database and get the table/view/constraints.
   */
  async function introspect(): Promise<PgIntrospectionResultsByKind> {
    // Perform introspection
    if (!Array.isArray(schemas)) {
      throw new Error("Argument 'schemas' (array) is required");
    }
    const cacheKey = `PgIntrospectionPlugin-introspectionResultsByKind-v${version}`;
    const introspectionResultsByKind = deepClone(
      await persistentMemoizeWithKey(cacheKey, () =>
        withPgClient(pgConfig, async pgClient => {
          const versionResult = await pgClient.query(
            "show server_version_num;"
          );
          const serverVersionNum = parseInt(
            versionResult.rows[0].server_version_num,
            10
          );
          const introspectionQuery = makeIntrospectionQuery(serverVersionNum, {
            pgLegacyFunctionsOnly,
          });
          const { rows } = await pgClient.query(introspectionQuery, [
            schemas,
            pgIncludeExtensionResources,
          ]);

          const result = {
            __pgVersion: serverVersionNum,
            namespace: [],
            class: [],
            attribute: [],
            type: [],
            constraint: [],
            procedure: [],
            extension: [],
            index: [],
          };
          for (const { object } of rows) {
            result[object.kind].push(object);
          }

          // Parse tags from comments
          [
            "namespace",
            "class",
            "attribute",
            "type",
            "constraint",
            "procedure",
            "extension",
            "index",
          ].forEach(kind => {
            result[kind].forEach(object => {
              // Keep a copy of the raw comment
              object.comment = object.description;
              if (pgEnableTags && object.description) {
                const parsed = parseTags(object.description);
                object.tags = parsed.tags;
                object.description = parsed.text;
              } else {
                object.tags = {};
              }
            });
          });

          const extensionConfigurationClassIds = flatMap(
            result.extension,
            e => e.configurationClassIds
          );
          result.class.forEach(klass => {
            klass.isExtensionConfigurationTable =
              extensionConfigurationClassIds.indexOf(klass.id) >= 0;
          });

          [
            "namespace",
            "class",
            "attribute",
            "type",
            "constraint",
            "procedure",
            "extension",
            "index",
          ].forEach(k => {
            result[k].forEach(Object.freeze);
          });

          return Object.freeze(result);
        })
      )
    );

    const knownSchemas = introspectionResultsByKind.namespace.map(n => n.name);
    const missingSchemas = schemas.filter(s => knownSchemas.indexOf(s) < 0);
    if (missingSchemas.length) {
      const errorMessage = `You requested to use schema '${schemas.join(
        "', '"
      )}'; however we couldn't find some of those! Missing schemas are: '${missingSchemas.join(
        "', '"
      )}'`;
      if (pgThrowOnMissingSchema) {
        throw new Error(errorMessage);
      } else {
        console.warn("⚠️ WARNING⚠️  " + errorMessage); // eslint-disable-line no-console
      }
    }
    return introspectionResultsByKind;
  }

  function introspectionResultsFromRaw(
    rawResults,
    pgAugmentIntrospectionResults
  ) {
    const introspectionResultsByKind = deepClone(rawResults);

    const xByY = (arrayOfX, attrKey) =>
      arrayOfX.reduce((memo, x) => {
        memo[x[attrKey]] = x;
        return memo;
      }, {});
    const xByYAndZ = (arrayOfX, attrKey, attrKey2) =>
      arrayOfX.reduce((memo, x) => {
        if (!memo[x[attrKey]]) memo[x[attrKey]] = {};
        memo[x[attrKey]][x[attrKey2]] = x;
        return memo;
      }, {});
    introspectionResultsByKind.namespaceById = xByY(
      introspectionResultsByKind.namespace,
      "id"
    );
    introspectionResultsByKind.classById = xByY(
      introspectionResultsByKind.class,
      "id"
    );
    introspectionResultsByKind.typeById = xByY(
      introspectionResultsByKind.type,
      "id"
    );
    introspectionResultsByKind.attributeByClassIdAndNum = xByYAndZ(
      introspectionResultsByKind.attribute,
      "classId",
      "num"
    );
    introspectionResultsByKind.extensionById = xByY(
      introspectionResultsByKind.extension,
      "id"
    );

    const relate = (array, newAttr, lookupAttr, lookup, missingOk = false) => {
      array.forEach(entry => {
        const key = entry[lookupAttr];
        if (Array.isArray(key)) {
          entry[newAttr] = key
            .map(innerKey => {
              const result = lookup[innerKey];
              if (innerKey && !result) {
                if (missingOk) {
                  return;
                }
                throw new Error(
                  `Could not look up '${newAttr}' by '${lookupAttr}' ('${innerKey}') on '${JSON.stringify(
                    entry
                  )}'`
                );
              }
              return result;
            })
            .filter(_ => _);
        } else {
          const result = lookup[key];
          if (key && !result) {
            if (missingOk) {
              return;
            }
            throw new Error(
              `Could not look up '${newAttr}' by '${lookupAttr}' on '${JSON.stringify(
                entry
              )}'`
            );
          }
          entry[newAttr] = result;
        }
      });
    };

    const augment = introspectionResults => {
      [pgAugmentIntrospectionResults, smartCommentConstraints].forEach(fn =>
        fn ? fn(introspectionResults) : null
      );
    };
    augment(introspectionResultsByKind);

    relate(
      introspectionResultsByKind.class,
      "namespace",
      "namespaceId",
      introspectionResultsByKind.namespaceById,
      true // Because it could be a type defined in a different namespace - which is fine so long as we don't allow querying it directly
    );

    relate(
      introspectionResultsByKind.class,
      "type",
      "typeId",
      introspectionResultsByKind.typeById
    );

    relate(
      introspectionResultsByKind.attribute,
      "class",
      "classId",
      introspectionResultsByKind.classById
    );

    relate(
      introspectionResultsByKind.attribute,
      "type",
      "typeId",
      introspectionResultsByKind.typeById
    );

    relate(
      introspectionResultsByKind.procedure,
      "namespace",
      "namespaceId",
      introspectionResultsByKind.namespaceById
    );

    relate(
      introspectionResultsByKind.type,
      "class",
      "classId",
      introspectionResultsByKind.classById,
      true
    );

    relate(
      introspectionResultsByKind.type,
      "domainBaseType",
      "domainBaseTypeId",
      introspectionResultsByKind.typeById,
      true // Because not all types are domains
    );

    relate(
      introspectionResultsByKind.type,
      "arrayItemType",
      "arrayItemTypeId",
      introspectionResultsByKind.typeById,
      true // Because not all types are arrays
    );

    relate(
      introspectionResultsByKind.constraint,
      "class",
      "classId",
      introspectionResultsByKind.classById
    );

    relate(
      introspectionResultsByKind.constraint,
      "foreignClass",
      "foreignClassId",
      introspectionResultsByKind.classById,
      true // Because many constraints don't apply to foreign classes
    );

    relate(
      introspectionResultsByKind.extension,
      "namespace",
      "namespaceId",
      introspectionResultsByKind.namespaceById,
      true // Because the extension could be a defined in a different namespace
    );

    relate(
      introspectionResultsByKind.extension,
      "configurationClasses",
      "configurationClassIds",
      introspectionResultsByKind.classById,
      true // Because the configuration table could be a defined in a different namespace
    );

    relate(
      introspectionResultsByKind.index,
      "class",
      "classId",
      introspectionResultsByKind.classById
    );

    // Reverse arrayItemType -> arrayType
    introspectionResultsByKind.type.forEach(type => {
      if (type.arrayItemType) {
        type.arrayItemType.arrayType = type;
      }
    });

    // Table/type columns / constraints
    introspectionResultsByKind.class.forEach(klass => {
      klass.attributes = introspectionResultsByKind.attribute.filter(
        attr => attr.classId === klass.id
      );
      klass.canUseAsterisk = !klass.attributes.some(
        attr => attr.columnLevelSelectGrant
      );
      klass.constraints = introspectionResultsByKind.constraint.filter(
        constraint => constraint.classId === klass.id
      );
      klass.foreignConstraints = introspectionResultsByKind.constraint.filter(
        constraint => constraint.foreignClassId === klass.id
      );
      klass.primaryKeyConstraint = klass.constraints.find(
        constraint => constraint.type === "p"
      );
    });

    // Constraint attributes
    introspectionResultsByKind.constraint.forEach(constraint => {
      if (constraint.keyAttributeNums && constraint.class) {
        constraint.keyAttributes = constraint.keyAttributeNums.map(nr =>
          constraint.class.attributes.find(attr => attr.num === nr)
        );
      } else {
        constraint.keyAttributes = [];
      }
      if (constraint.foreignKeyAttributeNums && constraint.foreignClass) {
        constraint.foreignKeyAttributes = constraint.foreignKeyAttributeNums.map(
          nr => constraint.foreignClass.attributes.find(attr => attr.num === nr)
        );
      } else {
        constraint.foreignKeyAttributes = [];
      }
    });

    // Detect which columns and constraints are indexed
    introspectionResultsByKind.index.forEach(index => {
      const columns = index.attributeNums.map(nr =>
        index.class.attributes.find(attr => attr.num === nr)
      );

      // Indexed column (for orderBy / filter):
      if (columns[0]) {
        columns[0].isIndexed = true;
      }

      if (columns[0] && columns.length === 1 && index.isUnique) {
        columns[0].isUnique = true;
      }

      // Indexed constraints (for reverse relations):
      index.class.constraints
        .filter(constraint => constraint.type === "f")
        .forEach(constraint => {
          if (
            constraint.keyAttributeNums.every(
              (nr, idx) => index.attributeNums[idx] === nr
            )
          ) {
            constraint.isIndexed = true;
          }
        });
    });

    return introspectionResultsByKind;
  }

  let rawIntrospectionResultsByKind = await introspect();

  let listener;

  class Listener {
    _handleChange: () => void;
    client: Client | null;
    stopped: boolean;
    _reallyReleaseClient: (() => Promise<void>) | null;
    _haveDisplayedError: boolean;
    constructor(triggerRebuild) {
      this.stopped = false;
      this._handleChange = throttle(
        async () => {
          debug(`Schema change detected: re-inspecting schema...`);
          try {
            rawIntrospectionResultsByKind = await introspect();
            debug(`Schema change detected: re-inspecting schema complete`);
            triggerRebuild();
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error(`Schema introspection failed: ${e.message}`);
          }
        },
        750,
        {
          leading: true,
          trailing: true,
        }
      );
      this._listener = this._listener.bind(this);
      this._handleClientError = this._handleClientError.bind(this);
      this._start();
    }

    async _start(isReconnect = false) {
      if (this.stopped) {
        return;
      }
      // Connect to DB
      try {
        const {
          pgClient,
          releasePgClient,
        } = await getPgClientAndReleaserFromConfig(pgConfig);
        this.client = pgClient;
        // $FlowFixMe: hack property
        this._reallyReleaseClient = releasePgClient;
        pgClient.on("notification", this._listener);
        pgClient.on("error", this._handleClientError);
        if (this.stopped) {
          // In case watch mode was cancelled in the interrim.
          return this._releaseClient();
        } else {
          await pgClient.query("listen postgraphile_watch");

          // Install the watch fixtures.
          if (!pgSkipInstallingWatchFixtures) {
            const watchSqlInner = await readFile(WATCH_FIXTURES_PATH, "utf8");
            const sql = `begin; ${watchSqlInner};`;
            await withPgClient(
              pgOwnerConnectionString || pgConfig,
              async pgClient => {
                try {
                  await pgClient.query(sql);
                } catch (error) {
                  if (!this._haveDisplayedError) {
                    this._haveDisplayedError = true;
                    /* eslint-disable no-console */
                    console.warn(
                      `${chalk.bold.yellow(
                        "Failed to setup watch fixtures in Postgres database"
                      )} ️️⚠️`
                    );
                    console.warn(
                      chalk.yellow(
                        "This is likely because the PostgreSQL user in the connection string does not have sufficient privileges; you can solve this by passing the 'owner' connection string via '--owner-connection' / 'ownerConnectionString'. If the fixtures already exist, the watch functionality may still work."
                      )
                    );
                    console.warn(
                      chalk.yellow(
                        "Enable DEBUG='graphile-build-pg' to see the error"
                      )
                    );
                    /* eslint-enable no-console */
                  }
                  debug(error);
                } finally {
                  await pgClient.query("commit;");
                }
              }
            );
          }

          // Trigger re-introspection on server reconnect
          if (isReconnect) {
            this._handleChange();
          }
        }
      } catch (e) {
        // If something goes wrong, disconnect and try again after a short delay
        this._reconnect(e);
      }
    }

    _handleClientError: (e: Error) => void;
    _handleClientError(e) {
      // Client is already cleaned up
      this.client = null;
      this._reallyReleaseClient = null;
      this._reconnect(e);
    }
    async _reconnect(e) {
      if (this.stopped) {
        return;
      }
      // eslint-disable-next-line no-console
      console.error(
        "Error occurred for PG watching client; reconnecting in 2 seconds.",
        e.message
      );
      await this._releaseClient();
      setTimeout(() => {
        if (!this.stopped) {
          // Listen for further changes
          this._start(true);
        }
      }, 2000);
    }

    // eslint-disable-next-line flowtype/no-weak-types
    _listener: (notification: any) => void;
    // eslint-disable-next-line flowtype/no-weak-types
    async _listener(notification: any) {
      if (notification.channel !== "postgraphile_watch") {
        return;
      }
      try {
        const payload = JSON.parse(notification.payload);
        payload.payload = payload.payload || [];
        if (payload.type === "ddl") {
          const commands = payload.payload
            .filter(
              ({ schema }) => schema == null || schemas.indexOf(schema) >= 0
            )
            .map(({ command }) => command);
          if (commands.length) {
            this._handleChange();
          }
        } else if (payload.type === "drop") {
          const affectsOurSchemas = payload.payload.some(
            schemaName => schemas.indexOf(schemaName) >= 0
          );
          if (affectsOurSchemas) {
            this._handleChange();
          }
        } else if (payload.type === "manual") {
          this._handleChange();
        } else {
          throw new Error(`Payload type '${payload.type}' not recognised`);
        }
      } catch (e) {
        debug(`Error occurred parsing notification payload: ${e}`);
      }
    }

    async stop() {
      this.stopped = true;
      await this._releaseClient();
    }

    async _releaseClient() {
      // $FlowFixMe
      this._handleChange.cancel();
      const pgClient = this.client;
      const reallyReleaseClient = this._reallyReleaseClient;
      this.client = null;
      this._reallyReleaseClient = null;
      if (pgClient) {
        pgClient.query("unlisten postgraphile_watch").catch(e => {
          debug(`Error occurred trying to unlisten watch: ${e}`);
        });
        pgClient.removeListener("notification", this._listener);
        pgClient.removeListener("error", this._handleClientError);
        if (reallyReleaseClient) {
          await reallyReleaseClient();
        }
      }
    }
  }

  builder.registerWatcher(
    async triggerRebuild => {
      // In case we started listening before, clean up
      if (listener) {
        await listener.stop();
      }
      // We're not worried about a race condition here.
      // eslint-disable-next-line require-atomic-updates
      listener = new Listener(triggerRebuild);
    },
    async () => {
      const l = listener;
      listener = null;
      if (l) {
        await l.stop();
      }
    }
  );

  builder.hook(
    "build",
    build => {
      const introspectionResultsByKind = introspectionResultsFromRaw(
        rawIntrospectionResultsByKind,
        build.pgAugmentIntrospectionResults
      );
      if (introspectionResultsByKind.__pgVersion < 90500) {
        // TODO:v5: remove this workaround
        // This is a bit of a hack, but until we have plugin priorities it's the
        // easiest way to conditionally support PG9.4.
        build.pgQueryFromResolveData = queryFromResolveDataFactory({
          supportsJSONB: false,
        });
      }
      return build.extend(build, {
        pgIntrospectionResultsByKind: introspectionResultsByKind,
      });
    },
    ["PgIntrospection"],
    [],
    ["PgBasics"]
  );
}: Plugin);

// TypeScript compatibility
export const PgEntityKind = {
  NAMESPACE: "namespace",
  PROCEDURE: "procedure",
  CLASS: "class",
  TYPE: "type",
  ATTRIBUTE: "attribute",
  CONSTRAINT: "constraint",
  EXTENSION: "extension",
  INDEX: "index",
};
