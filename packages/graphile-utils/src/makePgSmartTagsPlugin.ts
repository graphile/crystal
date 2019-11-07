import { SchemaBuilder, Build, Plugin, Options } from "graphile-build";
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
      `makePgPgSmartTagsPlugin rule has invalid kind '${kind}'; valid kinds are: ${validKinds}`
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
        "makePgPgSmartTagsPlugin rule 'match' is neither a string nor a function"
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

export function makePgPgSmartTagsPlugin(
  ruleOrRules: PgSmartTagRule | PgSmartTagRule[] | null,
  subscribeToUpdatesCallback?: SubscribeToPgSmartTagUpdatesCallback | null
): Plugin {
  let [rules, rawRules] = rulesFrom(ruleOrRules);
  return (builder: SchemaBuilder, _options: Options) => {
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
            `WARNING: there were no matches for makePgPgSmartTagsPlugin rule ${idx} - ${inspect(
              rawRules[idx]
            )}`
          );
        }
      });
      return build;
    });
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
 *         columns: {
 *           my_private_field: {tags: {omit: true}}
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
        columns?: {
          [columnName: string]: {
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
      const { tags, description, columns, ...rest } = spec;
      if (Object.keys(rest).length > 0) {
        console.warn(
          `WARNING: makeJSONPgSmartTagsPlugin only supports tags, description and columns currently, you have also set '${Object.keys(
            rest
          ).join("', '")}'`
        );
      }
      rules.push({
        kind,
        match: identifier,
        tags,
        description,
      });
      if (columns) {
        if (kind !== PgEntityKind.CLASS) {
          throw new Error(
            `makeJSONPgSmartTagsPlugin: 'columns' is only valid on a class; you tried to set it on a '${kind}'`
          );
        }
        for (const columnName of Object.keys(columns)) {
          const columnSpec = columns[columnName];
          const {
            tags: columnTags,
            description: columnDescription,
            ...columnRest
          } = columnSpec;
          if (Object.keys(columnRest).length > 0) {
            console.warn(
              `WARNING: makeJSONPgSmartTagsPlugin columns only supports tags and description currently, you have also set '${columnRest.join(
                "', '"
              )}'`
            );
          }
          rules.push({
            kind: PgEntityKind.ATTRIBUTE,
            match: `${identifier}.${columnName}`,
            tags: columnTags,
            description: columnDescription,
          });
        }
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
) {
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

  return makePgPgSmartTagsPlugin(rules, subscribeToUpdatesCallback);
}
