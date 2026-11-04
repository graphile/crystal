import type {
  IntrospectionPolicy,
  IntrospectionRequest,
  IntrospectOptions,
  MultipassOptions,
} from "pg-introspection";
import { pruneExtensionResources } from "pg-introspection";
import sql from "pg-sql2";

declare global {
  namespace PgIntrospection {
    interface PurposeRegistry {
      /** Build codecs for column, function, array, domain and composite values. */
      registryResourceCodec: true;
      /** Build relations from foreign keys on exposed resources. */
      registryResourceRelation: true;
      /** Discover foreign keys from the initially exposed resources. */
      discoverResourceRelations: true;
      /** Populate catalog metadata navigation without requesting a codec. */
      catalogNavigation: true;
      /** Populate type navigation without requesting another resource codec. */
      completeTypeNavigation: true;
      /** Supply constraint information needed to construct a resource. */
      registryResourceUnique: true;
      /** Infer resource behaviour from row security. */
      inferRowSecurityBehaviour: true;
      /** Build the allowed values of a PostgreSQL enum codec. */
      registryEnumCodec: true;
      /** Apply smart tags and GraphQL descriptions. */
      smartTagsAndDescriptions: true;
      /** Exclude extension-owned resources and identify automatic dependencies. */
      pruneExtensionResources: true;
      /** Detect and build codecs from tables or unique constraints tagged `@enum`. */
      enumTables: true;
    }
  }
}

type Entity = IntrospectionPolicy["entity"];

const request = (
  entity: Entity,
  field: string,
  value: string | number | null | undefined,
  purpose: PgIntrospection.Purpose,
): IntrospectionRequest[] =>
  value == null || value === "0" || value === 0
    ? []
    : [{ entity, match: { [field]: value }, purposes: [purpose] }];

const classRequests = (row: any, constraints: IntrospectionRequest[]) => [
  ...request("namespaces", "_id", row.relnamespace, "catalogNavigation"),
  ...request("types", "_id", row.reltype, "completeTypeNavigation"),
  ...request("types", "_id", row.reloftype, "completeTypeNavigation"),
  ...(!["i", "I"].includes(row.relkind)
    ? [
        ...request("attributes", "attrelid", row._id, "registryResourceCodec"),
        ...constraints,
        ...request("indexes", "indrelid", row._id, "catalogNavigation"),
        ...request("inherits", "inhrelid", row._id, "registryResourceCodec"),
        ...request(
          "policies",
          "polrelid",
          row._id,
          "inferRowSecurityBehaviour",
        ),
      ]
    : []),
];

/**
 * The policies PostGraphile needs to satisfy its builtin plugins. More
 * policies can be added via the `pgIntrospection_options` gather hook
 */
const policies = (() => {
  const policies: Readonly<IntrospectionPolicy>[] = [];

  function rule(
    name: string,
    entity: Entity,
    purposes: readonly PgIntrospection.Purpose[],
    select: IntrospectionPolicy["select"],
  ) {
    policies.push(
      Object.freeze({
        name,
        entity,
        purposes: Object.freeze([...purposes]),
        select,
      }),
    );
  }

  rule(
    "attributesDependencies",
    "attributes",
    ["registryResourceCodec"],
    (row) => request("types", "_id", row.atttypid, "registryResourceCodec"),
  );
  rule(
    "procsDependencies",
    "procs",
    ["registryResourceCodec", "catalogNavigation"],
    (row) => [
      ...request("namespaces", "_id", row.pronamespace, "catalogNavigation"),
      ...request("types", "_id", row.prorettype, "registryResourceCodec"),
      ...(row.proallargtypes ?? row.proargtypes ?? []).flatMap((id: string) =>
        request("types", "_id", id, "registryResourceCodec"),
      ),
    ],
  );
  rule(
    "typeDependencies",
    "types",
    [
      "initial",
      "registryResourceCodec",
      "completeTypeNavigation",
      "registryEnumCodec",
      "catalogNavigation",
    ],
    (row, details) => {
      // Only types reached as resources expand their related types as resources.
      // Initial type USAGE does not imply access to its table: PostgreSQL grants
      // PUBLIC usage of table row types by default.
      const purpose = details.hasPurpose("registryResourceCodec")
        ? "registryResourceCodec"
        : "completeTypeNavigation";
      return [
        ...request("namespaces", "_id", row.typnamespace, "catalogNavigation"),
        ...request("types", "_id", row.typelem, purpose),
        ...request("types", "_id", row.typarray, purpose),
        ...request("types", "_id", row.typbasetype, purpose),
        ...(purpose === "registryResourceCodec"
          ? request("classes", "_id", row.typrelid, purpose)
          : []),
        ...(row.typtype === "e"
          ? request("enums", "enumtypid", row._id, "registryEnumCodec")
          : []),
        ...(row.typtype === "r"
          ? request("ranges", "rngtypid", row._id, purpose)
          : []),
        ...(row.typtype === "d"
          ? request("constraints", "contypid", row._id, "catalogNavigation")
          : []),
      ];
    },
  );
  rule(
    "rangesDependencies",
    "ranges",
    ["registryResourceCodec", "completeTypeNavigation"],
    (row, details) =>
      request(
        "types",
        "_id",
        row.rngsubtype,
        details.hasPurpose("registryResourceCodec")
          ? "registryResourceCodec"
          : "completeTypeNavigation",
      ),
  );
  rule("indexesDependencies", "indexes", ["catalogNavigation"], (row) =>
    request("classes", "_id", row.indexrelid, "catalogNavigation"),
  );
  rule("inheritsDependencies", "inherits", ["registryResourceCodec"], (row) =>
    request("classes", "_id", row.inhparent, "registryResourceCodec"),
  );

  const catalogs: Partial<Record<Entity, string>> = {
    namespaces: "pg_namespace",
    classes: "pg_class",
    procs: "pg_proc",
    types: "pg_type",
    constraints: "pg_constraint",
    enums: "pg_enum",
    extensions: "pg_extension",
  };
  for (const [entity, catalog] of Object.entries(catalogs) as Array<
    [Entity, string]
  >) {
    rule(
      `${entity}DescriptionsAndOwnership`,
      entity,
      ["smartTagsAndDescriptions", "pruneExtensionResources"],
      (row, data) => {
        const catalogId = Object.entries(data.catalogByOid ?? {}).find(
          ([, name]) => name === catalog,
        )?.[0];
        if (!catalogId || !row._id) return [];
        const requests: IntrospectionRequest[] = [
          {
            entity: "descriptions",
            match: { classoid: catalogId, objoid: row._id },
            purposes: ["smartTagsAndDescriptions"],
          },
          {
            entity: "depends",
            match: { classid: catalogId, objid: row._id },
            purposes: ["pruneExtensionResources"],
          },
        ];
        return requests;
      },
    );
  }
  return Object.freeze(policies);
})();

// Exclude extension resources from initial discovery, but retain dependencies
// referenced by user resources.
const notExtension = (catalog: string, oid: string) =>
  `not exists (select 1 from pg_catalog.pg_depend d where d.classid = 'pg_catalog.${catalog}'::regclass and d.objid = ${oid} and d.refclassid = 'pg_catalog.pg_extension'::regclass and d.deptype = 'e')`;

export function postgraphileMultipass(
  schemas: readonly string[] = ["public"],
): MultipassOptions {
  return {
    policies: [
      ...policies.map((policy) => ({
        ...policy,
        purposes: [...policy.purposes],
      })),
      {
        name: "classDependencies",
        entity: "classes",
        purposes: [
          "initial",
          "catalogNavigation",
          "registryResourceCodec",
          "registryResourceRelation",
          "enumTables",
          "discoverResourceRelations",
          "completeTypeNavigation",
          "inferRowSecurityBehaviour",
          "registryResourceUnique",
        ],
        select(row, details) {
          const exposed = details.hasPurpose("initial");
          const full = exposed || details.hasPurpose("registryResourceCodec");
          const target =
            details.hasPurpose("registryResourceRelation") ||
            details.hasPurpose("enumTables");
          if (!full && !target) {
            return request(
              "namespaces",
              "_id",
              row.relnamespace,
              "catalogNavigation",
            );
          }
          const purpose = exposed
            ? "discoverResourceRelations"
            : "registryResourceUnique";
          const constraints: IntrospectionRequest[] = full
            ? request("constraints", "conrelid", row._id, purpose)
            : ["c", "n", "p", "u", "t", "x"].map((contype) => ({
                entity: "constraints",
                match: { conrelid: row._id, contype },
                purposes: [purpose],
              }));
          return classRequests(row, constraints);
        },
      },
      {
        name: "constraintDependencies",
        entity: "constraints",
        purposes: [
          "initial",
          "catalogNavigation",
          "discoverResourceRelations",
          "registryResourceCodec",
          "registryResourceRelation",
          "enumTables",
        ],
        select(row, details) {
          const requests = request(
            "namespaces",
            "_id",
            row.connamespace,
            "catalogNavigation",
          );
          if (
            row.contype === "f" &&
            (details.hasPurpose("initial") ||
              details.hasPurpose("discoverResourceRelations"))
          ) {
            requests.push(
              ...request(
                "classes",
                "_id",
                row.confrelid,
                "registryResourceRelation",
              ),
              ...request("classes", "_id", row.confrelid, "enumTables"),
            );
          }
          return requests;
        },
      },
    ],
    entrypointFilters: {
      namespaces: `nspname in (${schemas.length ? schemas.map((schema) => sql.compile(sql.literal(schema)).text).join(", ") : "null"})`,
      classes: notExtension("pg_class", "pg_class.oid"),
      procs: notExtension("pg_proc", "pg_proc.oid"),
      types: `(typrelid = 0 or ${notExtension("pg_class", "typrelid")})`,
    },
  };
}

export const postgraphilePrune: NonNullable<IntrospectOptions["prune"]> = (
  data,
  details,
) => {
  const classes = new Set(
    [...(data.classes ?? []), ...(data.hidden?.classes ?? [])].map(
      (row) => row._id,
    ),
  );
  const attributes = new Set(
    [...(data.attributes ?? []), ...(data.hidden?.attributes ?? [])].map(
      (row) => `${row.attrelid}:${row.attnum}`,
    ),
  );
  if (data.constraints) {
    data.constraints = data.constraints.filter((constraint) => {
      if (constraint.contype !== "f") {
        return true;
      }
      return (
        classes.has(constraint.conrelid) &&
        classes.has(constraint.confrelid) &&
        constraint.conkey != null &&
        constraint.confkey != null &&
        constraint.conkey.length > 0 &&
        constraint.conkey.length === constraint.confkey.length &&
        constraint.conkey.every((n) =>
          attributes.has(`${constraint.conrelid}:${n}`),
        ) &&
        constraint.confkey.every((n) =>
          attributes.has(`${constraint.confrelid}:${n}`),
        )
      );
    });
  }
  if (data.indexes) {
    data.indexes = data.indexes.filter(
      (index) =>
        classes.has(index.indrelid) &&
        index.indkey.every(
          (number) =>
            number === 0 || attributes.has(`${index.indrelid}:${number}`),
        ),
    );
  }
  pruneExtensionResources(data, details);
};
