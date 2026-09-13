// Relations of a view, derived from the catalog instead of asserted by hand.
//
// A view has no `pg_constraint` rows, so `PgRelationsPlugin` builds no relations for
// one, and today each view states its own with a `@foreignKey` smart tag. That tag is
// an unchecked claim that a view column is the very base-table column a real foreign
// key hangs on; a wrong one is as easy to write as a wrong comment, and nothing in the
// repository would notice.
//
// This plugin replaces the claim with a derivation. It asks the planner where each
// view column comes from (`plan-origins.ts`), accepts a column whose value in every
// row is a base column's value or NULL, and then asks `pg_constraint` and `pg_index`
// whether that base column really carries the key it is about to point at
// (`derive.ts`). A materialized view is read the same way, through the plan of its
// defining query rather than of the stored copy — and because the role that may read
// the stored copy is ordinarily the one that may not read what it was copied from,
// that one plan is taken on the service's privileged connection, the rest of the
// reading staying on the surface's own. Where both answers
// agree it writes the `@foreignKey` / `@primaryKey` tag the author would have written,
// and `PgFakeConstraintsPlugin` — which already knows how to turn such a tag into a
// constraint the rest of PostGraphile understands — does the rest.
//
// `@notNull` on a column is the same derivation over one column instead of a key: the
// base column is NOT NULL in `pg_attribute` and no shape of the plan — an outer join,
// a `UNION` branch of NULLs, a `GROUPING SETS` superaggregate row — puts a NULL over
// it. That is the whole rule; no expression is read, so everything a parser would
// recover stays nullable. That is why this
// plugin runs `after: ['smart-tags']` and `before: ['PgFakeConstraintsPlugin']`, on the
// same `pgIntrospection_introspection` hook: the tag has to exist by the time fake
// constraints are built, and the view's own tags have to be readable to compare with.
//
// What a view already declares by hand is left alone: a derived relation whose
// reference the view's own `@foreignKey` already carries is not declared a second
// time, because two tags for one reference are two relations over one pair of
// columns. That is also what lets a hand tag that exists only to name the field —
// `|@fieldName currency` — stay where it is while the assertion under it becomes
// derived.
//
// `declare` is off unless asked for, so that `report` can be handed everything
// derived beside everything the view declares without either touching the schema.

import "graphile-config";
import type {} from "graphile-build-pg";
import {
  withPgClientFromPgService,
  withSuperuserPgClientFromPgService,
} from "@dataplan/pg";
import { version } from "../../version.ts";
import { collectViewConstraints } from "./collect.js";
import type { RunQuery } from "./collect.js";
import type { ViewDerivation } from "./derive.js";

export type { ViewDerivation } from "./derive.js";
export type { ColumnOrigin, ColumnSources } from "./plan-origins.js";

declare global {
  namespace GraphileConfig {
    interface Plugins {
      PgViewConstraintsPlugin: true;
    }
  }
}

/** What one view was found to declare by hand, next to what was derived for it. */
export interface ViewConstraintsComparison {
  derived: ViewDerivation;
  /** `@foreignKey` tags already on the view, from smart tags or SQL comments. */
  declaredForeignKeys: string[];
  /** The `@primaryKey` tag already on the view, if any. */
  declaredPrimaryKey: string | null;
  /** View columns already carrying `@notNull` by hand, in attribute order. */
  declaredNotNullColumns: string[];
}

/**
 * A relation that declares a key or a non-null column by hand and this plugin never
 * looked at. Reported rather than skipped silently: the diff between what
 * is derived and what is asserted is only complete if the unreachable assertions
 * are named too.
 */
export interface UnexaminedDeclaration {
  schema: string;
  relation: string;
  /** `pg_class.relkind`: `r` table, `m` materialized view, `c` composite type, … */
  relkind: string;
  /** Why it was out of reach. */
  reason: string;
  declaredForeignKeys: string[];
  declaredPrimaryKey: string | null;
  declaredNotNullColumns: string[];
}

export interface ViewConstraintsReport {
  serviceName: string;
  schemas: string[];
  views: ViewConstraintsComparison[];
  unexamined: UnexaminedDeclaration[];
  /** Views whose plan the database refused to produce, with its reason. */
  failures: {
    schema: string;
    view: string;
    relkind: "v" | "m";
    error: string;
  }[];
  /** Views this plugin did not ask the database to plan, with the reason it did not. */
  skipped: {
    schema: string;
    view: string;
    relkind: "v" | "m";
    reason: string;
  }[];
}

export interface ViewConstraintsOptions {
  /**
   * Write the derived relations onto the view as smart tags. Off unless asked for:
   * a reporting run must leave the schema exactly as it found it.
   */
  declare?: boolean;
  /** Receives the derivation and the view's own declarations, once per service. */
  report?: (report: ViewConstraintsReport) => void | Promise<void>;
}

/**
 * The comparable half of a `@foreignKey` tag: the reference itself, without the
 * `|@fieldName …|@notNull` tail. The tail says how to publish the relation, not
 * whether it exists, and only the existence half is what this plugin derives.
 * Whitespace and quoting are levelled so that `(a) references s.t (b)` and
 * `(a) references s.t(b)` compare equal.
 *
 * Two tags for one reference would be two relations over one pair of columns, and
 * PostGraphile would publish both. So a derived relation the view already states by
 * hand is not stated a second time — which is also what lets a hand tag that exists
 * only to name the field stay where it is while the assertion under it becomes
 * derived.
 */
export function foreignKeyReference(tag: string): string {
  const [spec = ""] = tag.split("|");
  return spec
    .replaceAll('"', "")
    .replaceAll(/\s+/g, " ")
    .replaceAll(" (", "(")
    .trim()
    .toLowerCase();
}

function asStringArray(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value))
    return value.filter((entry) => typeof entry === "string");
  return [];
}

/**
 * A smart tag with no value is `true`; `jsonPgSmartTags` writes it as the boolean and
 * a SQL `COMMENT` writes it as the empty string. Either way it is the tag being there.
 */
function isSet(value: unknown): boolean {
  return value !== undefined && value !== false;
}

/** View columns whose `@notNull` a human wrote, in attribute order. */
function declaredNotNullColumnsOf(pgClass: {
  getAttributes(): { attname: string; getTags(): Record<string, unknown> }[];
}): string[] {
  return pgClass
    .getAttributes()
    .filter((attribute) => isSet(attribute.getTags()["notNull"]))
    .map((attribute) => attribute.attname);
}

/** The only thing `collect.ts` asks of a connection, over a PostGraphile client. */
function runQueryOn(client: {
  query<Row>(spec: {
    text: string;
    values?: unknown[];
  }): Promise<{ rows: readonly Row[] }>;
}): RunQuery {
  return async <Row>(text: string, values?: unknown[]) => {
    const result = await client.query<Row>({ text, values });
    return result.rows;
  };
}

/**
 * Whether this service names a connection of its own for the one statement that needs
 * more rights than the surface has: the `EXPLAIN` of a materialized view's defining
 * query. PostGraphile calls the setting `superuserConnectionString`, but no
 * superuser is wanted here — a role that may read the sources of the materialized
 * views, ordinarily the schema owner, is the whole requirement.
 *
 * The question has to be asked of the settings rather than of
 * `withSuperuserPgClientFromPgService`, which falls back to the ordinary connection
 * when nothing is configured. Taking that fall-back would plan the defining query as
 * the surface's own role and report the permission error it raises as if it were the
 * materialized view's answer.
 */
function namesPrivilegedConnection(pgService: {
  adaptorSettings?: unknown;
}): boolean {
  const settings = pgService.adaptorSettings;
  if (typeof settings !== "object" || settings === null) return false;
  const named = settings as Record<string, unknown>;
  return Boolean(
    named["superuserPool"] ??
      named["superuserPoolClient"] ??
      named["superuserConnectionString"],
  );
}

export function PgViewConstraintsPlugin(
  options: ViewConstraintsOptions = {},
): GraphileConfig.Plugin {
  return {
    name: "PgViewConstraintsPlugin",
    version,
    description:
      "Derives a view's foreign keys, primary key and non-null columns from the " +
      "planner's account of where its columns come from, confirmed against " +
      "pg_constraint, pg_index and pg_attribute, and states them as the smart tags " +
      "PgFakeConstraintsPlugin already understands.",
    after: ["smart-tags"],
    before: ["PgFakeConstraintsPlugin"],
    gather: {
      hooks: {
        async pgIntrospection_introspection(info, event) {
          const { introspection, serviceName } = event;
          const pgService = info.resolvedPreset.pgServices?.find(
            (service) => service.name === serviceName,
          );
          if (!pgService) return;
          const schemas = pgService.schemas ?? [];
          if (schemas.length === 0) return;

          const pgSettings = pgService.pgSettingsForIntrospection ?? null;
          const collected = await withPgClientFromPgService(
            pgService,
            pgSettings,
            async (client) => {
              const query = runQueryOn(client);
              if (!namesPrivilegedConnection(pgService)) {
                return collectViewConstraints(query, [...schemas], null);
              }
              return withSuperuserPgClientFromPgService(
                pgService,
                pgSettings,
                (privilegedClient) =>
                  collectViewConstraints(
                    query,
                    [...schemas],
                    runQueryOn(privilegedClient),
                  ),
              );
            },
          );

          const views: ViewConstraintsComparison[] = [];
          for (const derived of collected.derivations) {
            const pgClass = introspection.classes.find(
              (candidate) =>
                candidate.relname === derived.view &&
                candidate.getNamespace()?.nspname === derived.schema,
            );
            if (!pgClass) continue;
            const tags = pgClass.getTagsAndDescription().tags;
            views.push({
              derived,
              declaredForeignKeys: asStringArray(tags["foreignKey"]),
              declaredPrimaryKey:
                typeof tags["primaryKey"] === "string"
                  ? tags["primaryKey"]
                  : null,
              declaredNotNullColumns: declaredNotNullColumnsOf(pgClass),
            });
            if (!options.declare) continue;
            for (const column of derived.notNullColumns) {
              const attribute = pgClass.getAttribute({ name: column });
              if (attribute)
                attribute.getTagsAndDescription().tags["notNull"] = true;
            }
            const alreadyDeclared = new Set(
              asStringArray(tags["foreignKey"]).map(foreignKeyReference),
            );
            const toDeclare = derived.foreignKeys
              .map((foreignKey) => foreignKey.tag)
              .filter((tag) => !alreadyDeclared.has(foreignKeyReference(tag)));
            if (toDeclare.length > 0) {
              tags["foreignKey"] = [
                ...asStringArray(tags["foreignKey"]),
                ...toDeclare,
              ];
            }
            if (derived.primaryKey && tags["primaryKey"] === undefined) {
              tags["primaryKey"] = derived.primaryKey.tag;
            }
          }

          const examined = new Set(
            collected.derivations.map(
              (derived) => `${derived.schema}.${derived.view}`,
            ),
          );
          const refused = new Map([
            ...collected.failures.map(
              (failure) =>
                [`${failure.schema}.${failure.view}`, failure.error] as const,
            ),
            ...collected.skipped.map(
              (skip) => [`${skip.schema}.${skip.view}`, skip.reason] as const,
            ),
          ]);
          const unexamined: UnexaminedDeclaration[] = [];
          for (const pgClass of introspection.classes) {
            const namespace = pgClass.getNamespace()?.nspname;
            if (!namespace || !schemas.includes(namespace)) continue;
            if (examined.has(`${namespace}.${pgClass.relname}`)) continue;
            const tags = pgClass.getTags();
            const declaredForeignKeys = asStringArray(tags["foreignKey"]);
            const declaredPrimaryKey =
              typeof tags["primaryKey"] === "string"
                ? tags["primaryKey"]
                : null;
            const declaredNotNullColumns = declaredNotNullColumnsOf(pgClass);
            if (
              declaredForeignKeys.length === 0 &&
              declaredPrimaryKey === null &&
              declaredNotNullColumns.length === 0
            ) {
              continue;
            }
            unexamined.push({
              schema: namespace,
              relation: pgClass.relname,
              relkind: pgClass.relkind,
              reason:
                refused.get(`${namespace}.${pgClass.relname}`) ??
                (pgClass.relkind === "v"
                  ? // The collector asks for a view's whole select list and skips a view
                    // no column of which this role may read; a refusal on a view it did
                    // ask about would have arrived as a failure above.
                    "no column of it is readable by this role"
                  : "not a view or materialized view"),
              declaredForeignKeys,
              declaredPrimaryKey,
              declaredNotNullColumns,
            });
          }

          await options.report?.({
            serviceName,
            schemas: [...schemas],
            views,
            unexamined,
            failures: collected.failures,
            skipped: collected.skipped,
          });
        },
      },
    },
  };
}
