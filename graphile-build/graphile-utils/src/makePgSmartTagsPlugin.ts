import type { Stats } from "node:fs";
import { unwatchFile, watchFile } from "node:fs";
import { readFile } from "node:fs/promises";
import { inspect } from "node:util";

import { gatherConfig } from "graphile-build";
import type {} from "graphile-build-pg";
import type {
  PgAttribute,
  PgClass,
  PgConstraint,
  PgNamespace,
  PgProc,
  PgType,
} from "graphile-build-pg/pg-introspection";
import type {} from "graphile-config";
import JSON5 from "json5";

import { parseIdentifierParts } from "./parseIdentifierParts.js";

type PromiseOrDirect<T> = Promise<T> | T;
type ThunkOrDirect<T> = (() => T) | T;

type PgEntityByKind = {
  class: PgClass;
  attribute: PgAttribute;
  constraint: PgConstraint;
  procedure: PgProc;
  type: PgType;
  namespace: PgNamespace;
};

type PgSmartTagSupportedKinds = keyof PgEntityByKind;
type PgEntity = PgEntityByKind[PgSmartTagSupportedKinds];

// NOTE: we might add more arguments here as necessary
export type PgSmartTagFilterFunction<TEntity extends PgEntity> = (
  input: TEntity,
) => boolean;

export type PgSmartTagTags = {
  [tagName: string]: null | true | string | string[];
};

export interface PgSmartTagRule<
  TKind extends PgSmartTagSupportedKinds = PgSmartTagSupportedKinds,
> {
  serviceName?: string;
  kind: TKind;
  match: string | PgSmartTagFilterFunction<PgEntityByKind[TKind]>;
  tags?: PgSmartTagTags;
  description?: string;
}

interface CompiledPgSmartTagRule<TKind extends PgSmartTagSupportedKinds> {
  serviceName?: string;
  kind: TKind;
  match: PgSmartTagFilterFunction<PgEntityByKind[TKind]>;
  tags?: PgSmartTagTags;
  description?: string;
}

const meaningByKind: {
  [kind in PgSmartTagSupportedKinds]: string;
} = {
  ["class"]: "for tables, composite types, views and materialized views",
  ["attribute"]: "for columns/attributes (of any 'class' type)",
  ["constraint"]: "for table constraints",
  ["procedure"]: "for functions/procedures",
  ["type"]: "for types",
  ["namespace"]: "for schemas",
};

const validKinds = Object.entries(meaningByKind)
  .map(([kind, meaning]) => `'${kind}' (${meaning})`)
  .join(", ");

function compileRule<TKind extends PgSmartTagSupportedKinds>(
  rule: PgSmartTagRule<TKind>,
): CompiledPgSmartTagRule<TKind> {
  const { kind, match: incomingMatch, ...rest } = rule;
  if (!Object.prototype.hasOwnProperty.call(meaningByKind, kind)) {
    throw new Error(
      `makePgSmartTagsPlugin rule has invalid kind '${kind}'; valid kinds are: ${validKinds}`,
    );
  }

  const match: PgSmartTagFilterFunction<PgEntityByKind[TKind]> = (obj) => {
    if (typeof incomingMatch === "function") {
      // User supplied a match function; delegate to that:
      return incomingMatch(obj);
    } else if (typeof incomingMatch === "string") {
      const parts = parseIdentifierParts(incomingMatch);
      switch (rule.kind) {
        case "class": {
          const rel = obj as PgClass;
          if (parts.length === 0) return true;

          const tableName = parts.pop();
          if (rel.relname !== tableName) return false;
          else if (parts.length === 0) return true;

          const schemaName = parts.pop();
          const nsp = rel.getNamespace()!;
          if (nsp.nspname !== schemaName) return false;
          else if (parts.length === 0) return true;

          throw new Error(`Too many parts for a table name '${incomingMatch}'`);
        }
        case "attribute": {
          const attr = obj as PgAttribute;
          if (parts.length === 0) return true;

          const colName = parts.pop();
          if (attr.attname !== colName) return false;
          else if (parts.length === 0) return true;

          const tableName = parts.pop();
          const rel = attr.getClass()!;
          if (rel.relname !== tableName) return false;
          else if (parts.length === 0) return true;

          const schemaName = parts.pop();
          const nsp = rel.getNamespace()!;
          if (nsp.nspname !== schemaName) return false;
          else if (parts.length === 0) return true;

          throw new Error(
            `Too many parts for a attribute name '${incomingMatch}'`,
          );
        }
        case "constraint": {
          const con = obj as PgConstraint;
          if (parts.length === 0) return true;

          const conName = parts.pop();
          if (con.conname !== conName) return false;
          else if (parts.length === 0) return true;

          const tableName = parts.pop();
          const rel = con.getClass()!;
          if (rel.relname !== tableName) return false;
          else if (parts.length === 0) return true;

          const schemaName = parts.pop();
          const nsp = rel.getNamespace()!;
          if (nsp.nspname !== schemaName) return false;
          else if (parts.length === 0) return true;

          throw new Error(
            `Too many parts for a constraint name '${incomingMatch}'`,
          );
        }
        case "procedure": {
          const proc = obj as PgProc;
          if (parts.length === 0) return true;

          const procName = parts.pop();
          if (proc.proname !== procName) return false;
          else if (parts.length === 0) return true;

          const schemaName = parts.pop();
          const nsp = proc.getNamespace()!;
          if (nsp.nspname !== schemaName) return false;
          else if (parts.length === 0) return true;

          throw new Error(`Too many parts for a proc name '${incomingMatch}'`);
        }
        case "type": {
          const type = obj as PgType;
          if (parts.length === 0) return true;

          const typeName = parts.pop();
          if (type.typname !== typeName) return false;
          else if (parts.length === 0) return true;

          const schemaName = parts.pop();
          const nsp = type.getNamespace()!;
          if (nsp.nspname !== schemaName) return false;
          else if (parts.length === 0) return true;

          throw new Error(`Too many parts for a type name '${incomingMatch}'`);
        }
        case "namespace": {
          const nsp = obj as PgNamespace;
          if (parts.length === 0) return true;

          const schemaName = parts.pop();
          if (nsp.nspname !== schemaName) return false;
          else if (parts.length === 0) return true;

          throw new Error(
            `Too many parts for a namespace name '${incomingMatch}'`,
          );
        }
        default: {
          const never: never = rule.kind;
          throw new Error(`Unknown kind '${never}'`);
        }
      }
    } else {
      throw new Error(
        "makePgSmartTagsPlugin rule 'match' is neither a string nor a function",
      );
    }
  };
  return {
    kind,
    match,
    ...rest,
  };
}

function rulesFrom(
  ruleOrRules: PgSmartTagRule | PgSmartTagRule[] | null,
): [CompiledPgSmartTagRule<PgSmartTagSupportedKinds>[], PgSmartTagRule[]] {
  const rawRules = Array.isArray(ruleOrRules)
    ? ruleOrRules
    : ruleOrRules
    ? [ruleOrRules]
    : [];
  return [rawRules.map(compileRule), rawRules];
}

export type UpdatePgSmartTagRulesCallback = (
  ruleOrRules: PgSmartTagRule | PgSmartTagRule[] | null,
) => void;

export type SubscribeToPgSmartTagUpdatesCallback = (
  cb: UpdatePgSmartTagRulesCallback | null,
) => PromiseOrDirect<void>;

interface Cache {
  rulesPromise: PromiseOrDirect<PgSmartTagRule[]>;
}
interface State {
  rules: PgSmartTagRule[];
}

async function resolveRules(
  initialRules: ThunkOrDirect<
    PromiseOrDirect<
      | PgSmartTagRule<keyof PgEntityByKind>
      | PgSmartTagRule<keyof PgEntityByKind>[]
      | null
    >
  >,
): Promise<PgSmartTagRule[]> {
  const resolved = await (typeof initialRules === "function"
    ? initialRules()
    : initialRules);
  return Array.isArray(resolved) ? resolved : resolved ? [resolved] : [];
}

let counter = 0;
export function makePgSmartTagsPlugin(
  initialRules: ThunkOrDirect<
    PromiseOrDirect<PgSmartTagRule | PgSmartTagRule[] | null>
  >,
  subscribeToUpdatesCallback?: SubscribeToPgSmartTagUpdatesCallback | null,
  details?: { name?: string; description?: string; version?: string },
): GraphileConfig.Plugin {
  const id = ++counter;
  return {
    name: details?.name ?? `PgSmartTagsPlugin_${id}`,
    description: details?.description,
    version: details?.version ?? "0.0.0",
    before: ["smart-tags"],

    gather: gatherConfig<any, State, Cache>({
      namespace:
        `pgSmartTags_${id}` as any /* Cannot make type safe because dynamic */,
      helpers: {},
      initialCache() {
        return { rulesPromise: resolveRules(initialRules) };
      },
      async initialState(cache) {
        return {
          rules: await cache.rulesPromise,
        };
      },
      hooks: {
        // Run in the 'introspection' phase before anything uses the tags
        pgIntrospection_introspection(info, event) {
          const { introspection, serviceName } = event;

          const [rules, rawRules] = rulesFrom(info.state.rules);

          rules.forEach((rule, idx) => {
            if (rule.serviceName != null && rule.serviceName !== serviceName) {
              return;
            }

            const relevantIntrospectionResults = (() => {
              switch (rule.kind) {
                case "class":
                  return introspection.classes;
                case "attribute":
                  return introspection.attributes;
                case "constraint":
                  return introspection.constraints;
                case "procedure":
                  return introspection.procs;
                case "type":
                  return introspection.types;
                case "namespace":
                  return introspection.namespaces;
                default: {
                  const never: never = rule.kind;
                  throw new Error(`Unhandled kind ${never}`);
                }
              }
            })();

            let hits = 0;
            relevantIntrospectionResults.forEach((entity) => {
              if (!rule.match(entity)) {
                return;
              }
              hits++;
              // Note the code here relies on the fact that `getTagsAndDescription`
              // memoizes because it mutates the return result; if this changes then
              // the code will no longer achieve its goal.
              const obj = entity.getTagsAndDescription();
              if (rule.tags) {
                // Overwrite relevant tags
                Object.assign(obj.tags, rule.tags);
              }
              if (rule.description != null) {
                // Overwrite comment if specified
                obj.description = rule.description;
              }
            });

            // Let people know if their rules don't match; it's probably a mistake.
            if (hits === 0) {
              console.warn(
                `WARNING: there were no matches for makePgSmartTagsPlugin rule ${idx} - ${inspect(
                  rawRules[idx],
                )}`,
              );
            }
          });
        },
      },

      ...(subscribeToUpdatesCallback
        ? {
            async watch(info, callback) {
              await subscribeToUpdatesCallback((newRuleOrRules) => {
                const promise = resolveRules(newRuleOrRules);
                promise.then(
                  () => {
                    info.cache.rulesPromise = promise;
                    callback();
                  },
                  (e) => {
                    console.error(
                      `Error occurred during makePgSmartTagsPlugin watch mode: `,
                      e,
                    );
                  },
                );
              });
              return () => subscribeToUpdatesCallback(null);
            },
          }
        : null),
    }),
  };
}

/**
 * JSON (or JSON5) description of the tags to add to various entities, e.g.
 *
 * ```js
 * {
 *   version: 1,
 *   tags: {
 *     class: {
 *       my_table: {
 *         tags: {omit: "create,update,delete"},
 *         description: "You can overwrite the description too",
 *         attribute: {
 *           my_private_field: {tags: {omit: true}}
 *         },
 *         constraint: {
 *           my_constraint: {tags: {omit: true}}
 *         }
 *       },
 *       "my_schema.myOtherTable": {
 *         description: "If necessary, add your schema to the table name to prevent multiple being matched"
 *       }
 *     },
 *     procedure: {
 *       "my_schema.my_function_name": {
 *         tags: {sortable: true, filterable: true}
 *       }
 *     }
 *   }
 * }
 * ```
 */
export type JSONPgSmartTags = {
  version: 1;
  config: {
    [kind in PgSmartTagSupportedKinds]?: {
      [identifier: string]: {
        tags?: PgSmartTagTags;
        description?: string;
        attribute?: {
          [attributeName: string]: {
            tags?: PgSmartTagTags;
            description?: string;
          };
        };
        constraint?: {
          [constraintName: string]: {
            tags?: PgSmartTagTags;
            description?: string;
          };
        };
      };
    };
  };
};

export function pgSmartTagRulesFromJSON(
  json: JSONPgSmartTags | null,
): PgSmartTagRule[] {
  if (!json) {
    return [];
  }
  if (json.version !== 1) {
    throw new Error(
      'This version of graphile-utils only supports the version 1 smart tags JSON format; e.g. `{version: 1, config: { class: { my_table: { tags: { omit: "create,update,delete" } } } } }`',
    );
  }
  const specByIdentifierByKind = json.config;
  const rules: PgSmartTagRule[] = [];

  function processEntity(
    kind: PgSmartTagSupportedKinds,
    identifier: string,
    subKind: PgSmartTagSupportedKinds,
    obj: unknown,
    key: string = subKind,
    deprecated = false,
  ): void {
    if (kind !== "class") {
      throw new Error(
        `makeJSONPgSmartTagsPlugin: '${key}' is only valid on a class; you tried to set it on a '${kind}' at 'config.${kind}.${identifier}.${key}'`,
      );
    }
    const path = `config.${kind}.${identifier}.${key}`;
    if (deprecated) {
      console.warn(
        `Tags JSON path '${path}' is deprecated, please use 'config.${kind}.${identifier}.attribute' instead`,
      );
    }
    if (typeof obj !== "object" || obj == null) {
      throw new Error(`Invalid value for '${path}'`);
    }
    const entities: Record<string, any> = obj;
    for (const entityName of Object.keys(entities)) {
      if (entityName.includes(".")) {
        throw new Error(
          `${key} '${entityName}' should not contain a period at '${path}'. This nested entry does not need further description.`,
        );
      }
      const entitySpec = entities[entityName];
      const {
        tags: entityTags,
        description: entityDescription,
        ...entityRest
      } = entitySpec;
      if (Object.keys(entityRest).length > 0) {
        console.warn(
          `WARNING: makeJSONPgSmartTagsPlugin '${key}' only supports 'tags' and 'description' currently, you have also set '${Object.keys(
            entityRest,
          ).join(
            "', '",
          )}' at '${path}.${entityName}'. Perhaps you forgot to add a "tags" entry containing these keys?`,
        );
      }
      rules.push({
        kind: subKind,
        match: `${identifier}.${entityName}`,
        tags: entityTags,
        description: entityDescription,
      });
    }
  }

  for (const rawKind of Object.keys(specByIdentifierByKind)) {
    if (!Object.prototype.hasOwnProperty.call(meaningByKind, rawKind)) {
      throw new Error(
        `makeJSONPgSmartTagsPlugin JSON rule has invalid kind '${rawKind}'; valid kinds are: ${validKinds}`,
      );
    }
    const kind: PgSmartTagSupportedKinds = rawKind as any;
    const specByIdentifier = specByIdentifierByKind[kind];
    if (specByIdentifier) {
      for (const identifier of Object.keys(specByIdentifier)) {
        const spec = specByIdentifier[identifier];
        const { tags, description, attribute, constraint, ...rest } = spec;
        if (Object.keys(rest).length > 0) {
          console.warn(
            `WARNING: makeJSONPgSmartTagsPlugin identifier spec only supports 'tags', 'description', 'attribute' and 'constraint' currently, you have also set '${Object.keys(
              rest,
            ).join("', '")}' at 'config.${kind}.${identifier}'`,
          );
        }

        rules.push({
          kind,
          match: identifier,
          tags,
          description,
        });

        if (attribute) {
          processEntity(kind, identifier, "attribute", attribute);
        }
        if (constraint) {
          processEntity(kind, identifier, "constraint", constraint);
        }
      }
    }
  }

  return rules;
}

export type UpdateJSONPgSmartTagsCallback = (
  json: JSONPgSmartTags | null,
) => void;

export type SubscribeToJSONPgSmartTagsUpdatesCallback = (
  cb: UpdateJSONPgSmartTagsCallback | null,
) => void | Promise<void>;

export function makeJSONPgSmartTagsPlugin(
  jsonOrThunk: ThunkOrDirect<PromiseOrDirect<JSONPgSmartTags | null>>,
  subscribeToJSONUpdatesCallback?: SubscribeToJSONPgSmartTagsUpdatesCallback | null,
  details?: { name?: string; description?: string; version?: string },
): GraphileConfig.Plugin {
  // Get rules from JSON

  // Wrap listener callback with JSON conversion
  const subscribeToUpdatesCallback: SubscribeToPgSmartTagUpdatesCallback | null =
    subscribeToJSONUpdatesCallback
      ? (cb) => {
          if (!cb) {
            return subscribeToJSONUpdatesCallback(cb);
          } else {
            return subscribeToJSONUpdatesCallback((json) => {
              try {
                const rules = pgSmartTagRulesFromJSON(json);
                return cb(rules);
              } catch (e) {
                console.error(e);
              }
            });
          }
        }
      : null;

  return makePgSmartTagsPlugin(
    async () => {
      const json = await (typeof jsonOrThunk === "function"
        ? jsonOrThunk()
        : jsonOrThunk);
      return pgSmartTagRulesFromJSON(json);
    },
    subscribeToUpdatesCallback,
    details,
  );
}

export const makePgSmartTagsFromFilePlugin = (
  tagsFile = process.cwd() + "/postgraphile.tags.json5",
  name?: string,
): GraphileConfig.Plugin => {
  /*
   * We're wrapping the `smartTagsPlugin` defined below with a plugin wrapper
   * so that any errors from reading the smart tags file are thrown when the
   * plugin is *loaded* rather than from when it is defined.
   */

  function handleTagsError(err: Error): void {
    console.error(
      `Failed to process smart tags file '${tagsFile}': ${err.message}`,
    );
  }
  let tagsListener: null | ((current: Stats, previous: Stats) => void) = null;
  const plugin = makeJSONPgSmartTagsPlugin(
    async () => {
      const contents = await readFile(tagsFile, "utf8");
      return JSON5.parse(contents) as JSONPgSmartTags;
    },
    (updateJSON) => {
      if (tagsListener) {
        unwatchFile(tagsFile, tagsListener);
        tagsListener = null;
      }
      if (updateJSON) {
        tagsListener = (_current, _previous): void => {
          readFile(tagsFile, "utf8").then(
            (data) => {
              try {
                updateJSON(JSON5.parse(data));
              } catch (e) {
                handleTagsError(e);
              }
            },
            (err) => {
              if (err["code"] === "ENOENT") {
                updateJSON(null);
              } else {
                handleTagsError(err);
              }
            },
          );
        };

        watchFile(tagsFile, { interval: 507 }, tagsListener);
      }
    },
    {
      name,
      description: `Loads smart tags from '${tagsFile}' if it exists`,
    },
  );

  return plugin;
};

export const TagsFilePlugin = makePgSmartTagsFromFilePlugin(
  undefined,
  "TagsFilePlugin",
);
