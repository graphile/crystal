import type {
  IntrospectionContinuationDetails,
  IntrospectionPolicy,
  IntrospectionPolicyDetails,
  IntrospectOptions,
  MultipassOptions,
} from "pg-introspection";
import { pruneExtensionResources, requestByName } from "pg-introspection";

import { invertKeyAndValue } from "../utils.ts";
import { parseForeignKeyTag } from "./PgFakeConstraintsPlugin.ts";

type Entity = IntrospectionPolicy["entity"];
type TemplateIntrospectionPolicy = Readonly<IntrospectionPolicy<any>>;

/**
 * The policies PostGraphile needs to satisfy its builtin plugins. More
 * policies can be added via the `pgIntrospection_options` gather hook
 */
const DEFAULT_POLICIES = (() => {
  const policies: TemplateIntrospectionPolicy[] = [];

  function rule<TEntity extends Entity>(
    name: string,
    entity: TEntity,
    select: IntrospectionPolicy<TEntity>["select"],
  ) {
    policies.push(
      Object.freeze({
        name,
        entity,
        select,
      }),
    );
  }

  rule("attributesDependencies", "attributes", (row, details) => {
    details.request("types", { _id: row.atttypid }, ["registryCodec"]);
  });
  rule("procsDependencies", "procs", (row, details) => {
    details.request("namespaces", { _id: row.pronamespace }, [
      "catalogNavigation",
    ]);
    details.request("types", { _id: row.prorettype }, ["registryCodec"]);
    for (const id of row.proallargtypes ?? row.proargtypes ?? []) {
      details.request("types", { _id: id }, ["registryCodec"]);
    }
  });
  rule("typeDependencies", "types", (row, details) => {
    details.request("namespaces", { _id: row.typnamespace }, [
      "catalogNavigation",
    ]);
    const codec = details.hasPurpose("registryCodec");
    const purpose = codec ? "registryCodec" : "completeTypeNavigation";
    for (const id of [row.typelem, row.typarray, row.typbasetype]) {
      if (id != null) {
        details.request("types", { _id: id }, [purpose]);
      }
    }
    if (codec && row.typrelid != null) {
      details.request("classes", { _id: row.typrelid }, [purpose]);
    }
    if (row.typtype === "e") {
      details.request("enums", { enumtypid: row._id }, ["registryEnumCodec"]);
    } else if (row.typtype === "r") {
      details.request("ranges", { rngtypid: row._id }, [purpose]);
    } else if (row.typtype === "d") {
      details.request("constraints", { contypid: row._id }, [
        "catalogNavigation",
      ]);
    }
  });
  rule("rangesDependencies", "ranges", (row, details) => {
    if (row.rngsubtype != null) {
      details.request("types", { _id: row.rngsubtype }, [
        details.hasPurpose("registryCodec")
          ? "registryCodec"
          : "completeTypeNavigation",
      ]);
    }
  });
  rule("indexesDependencies", "indexes", (row, details) => {
    details.request("classes", { _id: row.indexrelid }, ["catalogNavigation"]);
  });
  rule("inheritsDependencies", "inherits", (row, details) => {
    details.request("classes", { _id: row.inhparent }, ["registryCodec"]);
  });
  const catalogs = {
    namespaces: "pg_namespace",
    classes: "pg_class",
    procs: "pg_proc",
    types: "pg_type",
    constraints: "pg_constraint",
    enums: "pg_enum",
    extensions: "pg_extension",
  } satisfies Partial<Record<Entity, string>>;
  for (const [entity, catalog] of Object.entries(catalogs) as Array<
    [keyof typeof catalogs, string]
  >) {
    rule(
      `${entity}DescriptionsAndOwnership`,
      entity,
      (row: { _id: string }, details: IntrospectionPolicyDetails) => {
        const catalogId = invertKeyAndValue(details.catalogByOid)[catalog];
        if (catalogId == null || !row._id) {
          return;
        }
        details.request(
          "descriptions",
          { classoid: catalogId, objoid: row._id },
          ["smartTagsAndDescriptions"],
        );
        details.request("depends", { classid: catalogId, objid: row._id }, [
          "pruneExtensionResources",
        ]);
      },
    );
  }
  rule("classDependencies", "classes", (row, details) => {
    details.request("namespaces", { _id: row.relnamespace }, [
      "catalogNavigation",
    ]);
    const exposed = details.hasPurpose("initial");
    const full = exposed || details.hasPurpose("registryCodec");
    const target =
      details.hasPurpose("registryRelation") ||
      details.hasPurpose("enumTables");
    if (full || target) {
      const purpose = exposed
        ? "discoverResourceRelations"
        : "registryResourceUnique";
      details.request("types", { _id: row.reltype }, [
        "completeTypeNavigation",
      ]);
      if (row.reloftype != null) {
        details.request("types", { _id: row.reloftype }, [
          "completeTypeNavigation",
        ]);
      }
      if (!["i", "I"].includes(row.relkind)) {
        details.request("attributes", { attrelid: row._id }, ["registryCodec"]);
        if (full) {
          details.request("constraints", { conrelid: row._id }, [purpose]);
        } else {
          for (const contype of ["c", "n", "p", "u", "t", "x"]) {
            details.request("constraints", { conrelid: row._id, contype }, [
              purpose,
            ]);
          }
        }
        details.request("indexes", { indrelid: row._id }, [
          "catalogNavigation",
        ]);
        details.request("inherits", { inhrelid: row._id }, ["registryCodec"]);
        details.request("policies", { polrelid: row._id }, [
          "inferRowSecurityBehaviour",
        ]);
      }
    }
  });
  rule("constraintDependencies", "constraints", (row, details) => {
    details.request("namespaces", { _id: row.connamespace }, [
      "catalogNavigation",
    ]);
    if (
      row.contype === "f" &&
      (details.hasPurpose("initial") ||
        details.hasPurpose("discoverResourceRelations"))
    ) {
      details.request("classes", { _id: row.confrelid }, ["registryRelation"]);
      details.request("classes", { _id: row.confrelid }, ["enumTables"]);
    }
  });
  return Object.freeze(policies);
})();

function requestForeignKeyTagTargets(
  details: IntrospectionContinuationDetails,
  introspectedSchemas: readonly string[],
  schemaName: string,
  foreignKey: unknown,
): void {
  for (const rawSpec of Array.isArray(foreignKey) ? foreignKey : [foreignKey]) {
    if (typeof rawSpec !== "string") continue;
    let parsed: ReturnType<typeof parseForeignKeyTag>;
    try {
      parsed = parseForeignKeyTag(rawSpec);
    } catch {
      // PgFakeConstraintsPlugin reports invalid specs.
      continue;
    }
    if (!parsed) continue;
    const foreignSchema = parsed.foreignSchema ?? schemaName;
    // Initial discovery covers the accessible tables in these schemas.
    if (introspectedSchemas.includes(foreignSchema)) continue;
    requestByName(details, "classes", foreignSchema, parsed.foreignTable, [
      "smartForeignKeyTarget",
    ]);
  }
}

/**
 * Smart tags matter to discovery for exposed tables and for the targets of
 * their `@foreignKey` tags. Policies that merge extra tags into
 * `getTagsAndDescription` must do so in a continuation awaiting only the
 * table's descriptions and namespace; `smartTags` is added after those
 * continuations have run.
 */
const classSmartTags: IntrospectionPolicy<"classes"> = {
  name: "classSmartTags",
  entity: "classes",
  select(row, details) {
    if (
      !details.hasPurpose("initial") &&
      !details.hasPurpose("smartForeignKeyTarget")
    ) {
      return;
    }
    const catalogId = invertKeyAndValue(details.catalogByOid)["pg_class"];
    if (catalogId == null) {
      return;
    }
    const descriptions = details.request(
      "descriptions",
      { classoid: catalogId, objoid: row._id },
      ["smartTagsAndDescriptions"],
    );
    const namespace = details.request("namespaces", { _id: row.relnamespace }, [
      "catalogNavigation",
    ]);
    details.after([descriptions, namespace], (_rows, next) => {
      next.after([], (_rows, last) => {
        last.request("classes", { _id: row._id }, ["smartTags"]);
      });
    });
  },
};

function smartForeignKeyTargets(
  schemas: readonly string[],
): IntrospectionPolicy<"classes"> {
  return {
    name: "smartForeignKeyTargets",
    entity: "classes",
    select(row, details) {
      if (!details.hasPurpose("initial") || !details.hasPurpose("smartTags")) {
        return;
      }
      const { foreignKey } = details.getTagsAndDescription("classes", row).tags;
      if (foreignKey == null) {
        return;
      }
      const namespace = details.request(
        "namespaces",
        { _id: row.relnamespace },
        ["catalogNavigation"],
      );
      details.after([namespace], ([[namespaceRow]], next) => {
        if (namespaceRow) {
          requestForeignKeyTagTargets(
            next,
            schemas,
            namespaceRow.nspname,
            foreignKey,
          );
        }
      });
    },
  };
}

const smartEnumTargets: IntrospectionPolicy<"classes"> = {
  name: "smartEnumTargets",
  entity: "classes",
  select(row, details) {
    if (
      details.hasPurpose("smartForeignKeyTarget") &&
      details.hasPurpose("smartTags") &&
      details.getTagsAndDescription("classes", row).tags.enum
    ) {
      details.request("classes", { _id: row._id }, ["enumTables"]);
    }
  },
};

// Exclude extension resources from initial discovery, but retain dependencies
// referenced by user resources.
const notExtension = (catalog: string, oid: string) =>
  `not exists (select 1 from pg_catalog.pg_depend d where d.classid = 'pg_catalog.${
    catalog
  }'::regclass and d.objid = ${
    oid
  } and d.refclassid = 'pg_catalog.pg_extension'::regclass and d.deptype = 'e')`;

// Takes a template policy and returns a read/write clone.
function clonePolicy<TEntity extends Entity>(
  policy: Readonly<IntrospectionPolicy<TEntity>>,
): IntrospectionPolicy<TEntity> {
  return { ...policy };
}

/**
 * Escapes a string literal for inclusion in SQL without enabling SQL injection.
 *
 * @remarks
 * Due to the "standard_conforming_strings" setting (which could be
 * `false`), we can't just use simple `.replace(/'/g, "''")`; instead we
 * need to look out for backslashes which force us into using `E`-strings.
 *
 * This function is optimized for usage with database identifiers: using
 * String.prototype.replace is _generally_ faster than character-by-character
 * processing because in most cases for our database identifiers there will be
 * no matches at all, so the happy path does no additional function calls
 * (our callback never gets called). For general
 * arbitrary text you should probably use a character-by-character loop though,
 * otherwise a string like `\\\\\\\\\\` will cause a LOT of function calls.
 */
const escapeLiteral = (str: string) => {
  let hasBackslashes = false;
  const result = str.replace(/[\\'\0]/g, (char) => {
    switch (char) {
      case "\\":
        hasBackslashes = true;
        return "\\\\";
      case "'":
        return "''";
      default:
        throw new Error(`Forbidden character`);
    }
  });
  return hasBackslashes ? ` E'${result}'` : `'${result}'`;
};

export function postgraphileMultipass(options: {
  schemas?: readonly string[];
}): MultipassOptions {
  const { schemas = ["public"] } = options;
  return {
    policies: [
      ...DEFAULT_POLICIES.map(clonePolicy),
      classSmartTags,
      smartForeignKeyTargets(schemas),
      smartEnumTargets,
    ],
    entrypointFilters: {
      namespaces:
        schemas.length > 0
          ? `nspname in (${schemas.map(escapeLiteral).join(", ")})`
          : `false`,
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
