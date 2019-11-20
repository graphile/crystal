import { Build, Plugin } from "graphile-build";
import { PgEntityKind, PgEntity } from "graphile-build-pg";
import { inspect } from "util";
import { entityIsIdentifiedBy } from "./introspectionHelpers";

export type PgSmartTagFilterFunction<T> = (input: T) => boolean;

export type PgSmartTagTags = {
  [tagName: string]: null | true | string | string[];
};

export interface PgSmartTagRule<T extends PgEntity = PgEntity> {
  kind: PgEntityKind;
  match: string | PgSmartTagFilterFunction<T>;
  tags?: PgSmartTagTags;
  description?: string;
}

interface CompiledPgSmartTagRule<T extends PgEntity> {
  kind: T["kind"];
  match: PgSmartTagFilterFunction<T>;
  tags?: PgSmartTagTags;
  description?: string;
}

export type PgSmartTagSupportedKinds =
  | PgEntityKind.CLASS
  | PgEntityKind.ATTRIBUTE
  | PgEntityKind.CONSTRAINT
  | PgEntityKind.PROCEDURE;

const meaningByKind: {
  [kind in PgSmartTagSupportedKinds]: string;
} = {
  [PgEntityKind.CLASS]:
    "for tables, composite types, views and materialized views",
  [PgEntityKind.ATTRIBUTE]: "for columns/attributes (of any 'class' type)",
  [PgEntityKind.CONSTRAINT]: "for table constraints",
  [PgEntityKind.PROCEDURE]: "for functions/procedures",
};

const validKinds = Object.entries(meaningByKind)
  .map(([kind, meaning]) => `'${kind}' (${meaning})`)
  .join(", ");

function compileRule<T extends PgEntity>(
  rule: PgSmartTagRule<T>
): CompiledPgSmartTagRule<T> {
  const { kind, match: incomingMatch, ...rest } = rule;
  if (!Object.prototype.hasOwnProperty.call(meaningByKind, kind)) {
    throw new Error(
      `makePgSmartTagsPlugin rule has invalid kind '${kind}'; valid kinds are: ${validKinds}`
    );
  }

  const match: PgSmartTagFilterFunction<T> = obj => {
    if (obj.kind !== kind) {
      return false;
    }

    if (typeof incomingMatch === "function") {
      // User supplied a match function; delegate to that:
      return incomingMatch(obj);
    } else if (typeof incomingMatch === "string") {
      // It's a fully-qualified case-sensitive name of the thing.
      return entityIsIdentifiedBy(obj, incomingMatch);
    } else {
      throw new Error(
        "makePgSmartTagsPlugin rule 'match' is neither a string nor a function"
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
  ruleOrRules: PgSmartTagRule | PgSmartTagRule[] | null
): [CompiledPgSmartTagRule<PgEntity>[], PgSmartTagRule[]] {
  const rawRules = Array.isArray(ruleOrRules)
    ? ruleOrRules
    : ruleOrRules
    ? [ruleOrRules]
    : [];
  return [rawRules.map(compileRule), rawRules];
}

export type UpdatePgSmartTagRulesCallback = (
  ruleOrRules: PgSmartTagRule | PgSmartTagRule[] | null
) => void;

export type SubscribeToPgSmartTagUpdatesCallback = (
  cb: UpdatePgSmartTagRulesCallback | null
) => void | Promise<void>;

export function makePgSmartTagsPlugin(
  ruleOrRules: PgSmartTagRule | PgSmartTagRule[] | null,
  subscribeToUpdatesCallback?: SubscribeToPgSmartTagUpdatesCallback | null
): Plugin {
  let [rules, rawRules] = rulesFrom(ruleOrRules);
  const plugin: Plugin = (builder, _options) => {
    if (subscribeToUpdatesCallback) {
      builder.registerWatcher(
        async triggerRebuild => {
          await subscribeToUpdatesCallback(newRuleOrRules => {
            [rules, rawRules] = rulesFrom(newRuleOrRules);
            triggerRebuild();
          });
        },
        async () => {
          await subscribeToUpdatesCallback(null);
        }
      );
    }

    builder.hook("build", (build: Build) => {
      const { pgIntrospectionResultsByKind } = build;
      rules.forEach((rule, idx) => {
        const relevantIntrospectionResults: PgEntity[] =
          pgIntrospectionResultsByKind[rule.kind];

        let hits = 0;
        relevantIntrospectionResults.forEach(entity => {
          if (!rule.match(entity)) {
            return;
          }
          hits++;
          if (rule.tags) {
            // Overwrite relevant tags
            Object.assign(entity.tags, rule.tags);
          }
          if (rule.description != null) {
            // Overwrite comment if specified
            entity.description = rule.description;
          }
        });

        // Let people know if their rules don't match; it's probably a mistake.
        if (hits === 0) {
          console.warn(
            `WARNING: there were no matches for makePgSmartTagsPlugin rule ${idx} - ${inspect(
              rawRules[idx]
            )}`
          );
        }
      });
      return build;
    });
  };
  return plugin;
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
    [kind in PgSmartTagSupportedKinds]: {
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

function pgSmartTagRulesFromJSON(
  json: JSONPgSmartTags | null
): PgSmartTagRule[] {
  if (!json) {
    return [];
  }
  if (json.version !== 1) {
    throw new Error(
      'This version of graphile-utils only supports the version 1 smart tags JSON format; e.g. `{version: 1, config: { class: { my_table: { tags: { omit: "create,update,delete" } } } } }`'
    );
  }
  const specByIdentifierByKind = json.config;
  const rules: PgSmartTagRule[] = [];

  function process(
    kind: PgEntityKind,
    identifier: string,
    subKind: PgEntityKind,
    obj: unknown,
    key: string,
    deprecated = false
  ): void {
    if (kind !== PgEntityKind.CLASS) {
      throw new Error(
        `makeJSONPgSmartTagsPlugin: '${key}' is only valid on a class; you tried to set it on a '${kind}' at 'config.${kind}.${identifier}.${key}'`
      );
    }
    const path = `config.${kind}.${identifier}.${key}`;
    if (deprecated) {
      console.warn(
        `Tags JSON path '${path}' is deprecated, please use 'config.${kind}.${identifier}.attribute' instead`
      );
    }
    if (typeof obj !== "object" || obj == null) {
      throw new Error(`Invalid value for '${path}'`);
    }
    const entities: object = obj;
    for (const entityName of Object.keys(entities)) {
      if (entityName.includes(".")) {
        throw new Error(
          `${key} '${entityName}' should not contain a period at '${path}'. This nested entry does not need further description.`
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
            entityRest
          ).join(
            "', '"
          )}' at '${path}.${entityName}'. Perhaps you forgot to add a "tags" entry containing these keys?`
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
        `makeJSONPgSmartTagsPlugin JSON rule has invalid kind '${rawKind}'; valid kinds are: ${validKinds}`
      );
    }
    const kind: PgEntityKind = rawKind as any;
    const specByIdentifier = specByIdentifierByKind[kind];

    for (const identifier of Object.keys(specByIdentifier)) {
      const spec = specByIdentifier[identifier];
      const {
        tags,
        description,
        columns,
        attribute,
        constraint,
        ...rest
      } = spec;
      if (Object.keys(rest).length > 0) {
        console.warn(
          `WARNING: makeJSONPgSmartTagsPlugin identifier spec only supports 'tags', 'description', 'attribute' and 'constraint' currently, you have also set '${Object.keys(
            rest
          ).join("', '")}' at 'config.${kind}.${identifier}'`
        );
      }

      rules.push({
        kind,
        match: identifier,
        tags,
        description,
      });

      if (columns) {
        // This was in graphile-utils 4.0.0 but was deprecated in 4.0.1 for consistency reasons.
        process(
          kind,
          identifier,
          PgEntityKind.ATTRIBUTE,
          columns,
          "columns",
          true
        );
      }
      if (attribute) {
        process(
          kind,
          identifier,
          PgEntityKind.ATTRIBUTE,
          attribute,
          "attribute"
        );
      }
      if (constraint) {
        process(
          kind,
          identifier,
          PgEntityKind.CONSTRAINT,
          constraint,
          "constraint"
        );
      }
    }
  }

  return rules;
}

export type UpdateJSONPgSmartTagsCallback = (
  json: JSONPgSmartTags | null
) => void;

export type SubscribeToJSONPgSmartTagsUpdatesCallback = (
  cb: UpdateJSONPgSmartTagsCallback | null
) => void | Promise<void>;

export function makeJSONPgSmartTagsPlugin(
  json: JSONPgSmartTags | null,
  subscribeToJSONUpdatesCallback?: SubscribeToJSONPgSmartTagsUpdatesCallback | null
): Plugin {
  // Get rules from JSON
  let rules = pgSmartTagRulesFromJSON(json);

  // Wrap listener callback with JSON conversion
  const subscribeToUpdatesCallback: SubscribeToPgSmartTagUpdatesCallback | null = subscribeToJSONUpdatesCallback
    ? cb => {
        if (!cb) {
          return subscribeToJSONUpdatesCallback(cb);
        } else {
          return subscribeToJSONUpdatesCallback(json => {
            try {
              rules = pgSmartTagRulesFromJSON(json);
              return cb(rules);
            } catch (e) {
              console.error(e);
            }
          });
        }
      }
    : null;

  return makePgSmartTagsPlugin(rules, subscribeToUpdatesCallback);
}
