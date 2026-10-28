import {
  ENTITY_TYPES,
  type EntityTypeConfig,
  type Options,
} from "./introspection.ts";

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
  const onlyEntities = rawOptions.onlyEntities ?? [...defaultEntities];
  const options: Required<Options> = { onlyEntities };
  const withs: string[] = [];
  const jsons: string[] = [];

  function add(entityType: EntityTypeConfig) {
    const {
      tableName: tbl,
      alias,
      oids,
      order,
      singular,
      columns,
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
      typeof entityType.where === "function"
        ? entityType.where(options)
        : entityType.where;
    if (baseWhere != null) wheres.push(baseWhere);

    if (alias === "procs" && !onlyEntities.includes("triggers")) {
      // Exclude triggers
      wheres.push("prorettype operator(pg_catalog.<>) 2279");
    }

    withs.push(`\
  ${alias} as (
    select ${oids ? `${tbl}.oid as _id, ` : ""}${
      columns ? columns.join(", ") : "*"
    }${additionalSelect}
    from pg_catalog.${tbl}${
      wheres.length > 0
        ? `
    where (${wheres.join(") and (")})`
        : ""
    }
  )`);
    const val = singular
      ? `(select row_to_json(${alias}) from ${alias})`
      : `(select coalesce((select json_agg(row_to_json(${alias}) ${
          order ? `order by ${order}` : ""
        }) from ${alias}), '[]'::json))`;
    jsons.push(`\
  '${alias}',
  ${val}`);
  }

  for (const config of Object.values(ENTITY_TYPES)) {
    if (onlyEntities.includes(config.alias)) {
      if (
        config.requires &&
        !config.requires.every((alias) => onlyEntities.includes(alias))
      ) {
        throw new Error(
          `Entity type '${config.alias}' requires entity type(s) '${config.requires.join("', '")}' to be included`,
        );
      }
      add(config);
    }
  }

  return `${withs.length > 0 ? `with\n${withs.join(",\n\n")}\n` : ""}\
select json_build_object(
${jsons.length > 0 ? `${jsons.join(",\n\n")},\n\n` : ""}\
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
  1
)::text as introspection
`;
}
