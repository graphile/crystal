import {
  ENTITY_TYPES,
  type EntityTypeConfig,
  type Options,
} from "./introspection.ts";
import { catalogProjection } from "./introspectionHelpers.ts";

export const defaultEntities = Object.freeze([
  "database",
  "namespaces",
  "classes",
  "attributes",
  "constraints",
  "procs",
  "roles",
  "auth_members",
  "types",
  "enums",
  "extensions",
  "indexes",
  "languages",
  "ranges",
  "depends",
  "descriptions",
  "inherits",
  "policies",
  "am",
] as const);

export function makeIntrospectionQuery(rawOptions: Options = {}) {
  return buildIntrospectionQuery(rawOptions);
}

/** Builds a query with per-collection predicates for multipass introspection. */
export function buildIntrospectionQuery(
  rawOptions: Options,
  overrides: Partial<Record<string, string>> = {},
  filters: Partial<Record<string, string>> = {},
  prefix = "",
  metadata = true,
  validateRequires = true,
  outputEntities?: ReadonlySet<string>,
  includeTriggerFunctions?: boolean,
) {
  const onlyEntities = rawOptions.onlyEntities ?? [...defaultEntities];
  const options: Required<Options> = {
    onlyEntities: outputEntities
      ? onlyEntities.filter((entity) => outputEntities.has(entity))
      : onlyEntities,
  };
  const withs: string[] = [];
  if (prefix) {
    withs.push(prefix);
  }
  const jsons: string[] = [];

  function add(entityType: EntityTypeConfig) {
    const {
      tableName: tbl,
      alias,
      oids,
      order,
      singular,
      attributes,
      extraColumns,
    } = entityType;
    let additionalSelect = "";
    if (extraColumns != null) {
      for (const colName in extraColumns) {
        const { sql } = extraColumns[colName];
        additionalSelect += `,\n      ${sql} as "${colName}"`;
      }
    }
    const wheres: string[] = [];

    const baseWhere =
      overrides[alias] ??
      (typeof entityType.where === "function"
        ? entityType.where(options)
        : entityType.where);
    if (baseWhere != null) wheres.push(baseWhere);

    if (
      alias === "procs" &&
      !(includeTriggerFunctions ?? onlyEntities.includes("triggers"))
    ) {
      // Exclude triggers
      wheres.push("prorettype operator(pg_catalog.<>) 2279");
    }

    const filter = filters[alias];
    if (filter) {
      wheres.push(filter);
    }

    const { select, fallback } = catalogProjection(attributes);

    withs.push(`\
  ${alias} as (
    select projected.*
    from (select
        ${fallback}
    ) fallback
    cross join lateral (
      select ${
        oids ? `oid::pg_catalog.oid as _id, ` : ""
      }${select}${additionalSelect}
      from pg_catalog.${tbl}${
        wheres.length > 0
          ? `
    where (${wheres.join(") and (")})`
          : ""
      }
    ) projected
  )`);
    if (outputEntities && !outputEntities.has(alias)) return;
    const val = singular
      ? `(select row_to_json(${alias}) from ${alias})`
      : `(select coalesce((select json_agg(row_to_json(${alias}) ${
          order ? `order by ${order}${oids ? `, ${alias}._id` : ""}` : ""
        }) from ${alias}), '[]'::json))`;
    jsons.push(`\
  '${alias}',
  ${val}`);
  }

  for (const config of Object.values(ENTITY_TYPES)) {
    if (onlyEntities.includes(config.alias)) {
      if (
        validateRequires &&
        config.requires &&
        !config.requires.every((alias) => onlyEntities.includes(alias))
      ) {
        throw new Error(
          `Entity type '${
            config.alias
          }' requires entity type(s) '${config.requires.join(
            "', '",
          )}' to be included`,
        );
      }
      add(config);
    }
  }

  return `${withs.length > 0 ? `with\n${withs.join(",\n\n")}\n` : ""}\
select json_build_object(
${jsons.length > 0 ? `${jsons.join(",\n\n")}` : ""}${
    metadata
      ? `${jsons.length > 0 ? ",\n\n" : ""}\
  'catalog_by_oid',
  (
    select json_object_agg(oid::text, relname order by relname asc)
    from pg_class
    where relnamespace = (
      select oid
      from pg_namespace
      where nspname = 'pg_catalog'
    )
    and relkind = 'r'
  ),

  'current_user',
  current_user,

  'pg_version',
  version(),

  'introspection_version',
  1`
      : ""
  }
)::text as introspection
`;
}
