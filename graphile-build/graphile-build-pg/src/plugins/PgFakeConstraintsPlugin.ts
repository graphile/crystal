import type { PromiseOrDirect } from "grafast";
import type { GatherPluginContext } from "graphile-build";
import { gatherConfig } from "graphile-build";
import type {
  Introspection,
  IntrospectionPolicy,
  IntrospectionPolicyDetails,
  IntrospectionRow,
  PgAttribute,
  PgClass,
  PgConstraint,
  PgSmartTagsDict,
} from "pg-introspection";
import { parseSmartComment } from "pg-introspection";

import { version } from "../version.ts";
import { isEnumTag } from "./PgEnumTablesPlugin.ts";

declare global {
  namespace GraphileConfig {
    interface Plugins {
      PgFakeConstraintsPlugin: true;
    }

    interface GatherHelpers {
      pgFakeConstraints: Record<string, never>;
    }
    interface GatherHooks {
      pgFakeConstraints_constraint(event: {
        introspection: Introspection;
        serviceName: string;
        entity: PgConstraint;
      }): PromiseOrDirect<void>;
    }
  }
  namespace GraphileBuild {
    interface GatherOptions {
      /** @deprecated We strongly recommend that you fix the uniqueness yourself. */
      pgFakeConstraintsAutofixForeignKeyUniqueness?: boolean;
    }
  }
}

interface State {
  fakeId: number;
}
const EMPTY_OBJECT = Object.freeze({});
type Cache = typeof EMPTY_OBJECT;

export const PgFakeConstraintsPlugin: GraphileConfig.Plugin = {
  name: "PgFakeConstraintsPlugin",
  description:
    "Looks for the @primaryKey, @foreignKey, @unique and @nonNull smart comments and changes the introspection results such that it's as if these were concrete constraints",
  version: version,
  after: ["smart-tags"],

  gather: gatherConfig({
    namespace: "pgFakeConstraints",
    helpers: {},
    initialCache(): Cache {
      return EMPTY_OBJECT;
    },
    initialState: (): State => ({
      fakeId: 0,
    }),
    hooks: {
      pgIntrospection_options(info, { options, serviceName }) {
        if (options.multipass) {
          const service = info.resolvedPreset.pgServices?.find(
            (service) => service.name === serviceName,
          );
          options.multipass.policies = [
            ...(options.multipass.policies ?? []),
            foreignKeyTargets(service?.schemas ?? ["public"]),
          ];
        }
      },
      // TODO:v6: build these fake constraints inside pg-introspection via a
      // multipass policy, so discovery follows them like real constraints
      // (making `foreignKeyEnumTargets` unnecessary), rather than here after
      // introspection.
      // We detect "fake" foreign key constraints during the "introspection"
      // phase (which runs first) because we need it to already be established
      // for _all_ classes by the time pgTables_PgResourceOptions_relations is
      // called (otherwise we may get race conditions and relations only being
      // defined in one direction).
      async pgIntrospection_introspection(info, event) {
        const { introspection } = event;

        for (const pgClass of introspection.classes) {
          const { tags } = pgClass.getTagsAndDescription();

          if (tags.primaryKey) {
            await processUnique(info, event, pgClass, tags.primaryKey, true);
          }

          if (tags.unique) {
            if (Array.isArray(tags.unique)) {
              for (const uniq of tags.unique) {
                await processUnique(info, event, pgClass, uniq);
              }
            } else {
              await processUnique(info, event, pgClass, tags.unique);
            }
          }
        }

        // For us to reference fake primary keys, we need to complete adding
        // primary keys/uniques before we try adding foreign keys.
        for (const pgClass of introspection.classes) {
          const { tags } = pgClass.getTagsAndDescription();

          if (tags.foreignKey) {
            if (Array.isArray(tags.foreignKey)) {
              for (const fk of tags.foreignKey) {
                await processFk(info, event, pgClass, fk);
              }
            } else {
              await processFk(info, event, pgClass, tags.foreignKey);
            }
          }
        }

        for (const pgAttr of introspection.attributes) {
          const tags = pgAttr.getTags();
          if (tags?.notNull) {
            pgAttr.attnotnull = true;
          }
        }
      },
    },
  }),
};

export function parseConstraintSpec(rawSpec: string) {
  const [spec, ...tagComponents] = rawSpec.split(/\|/);
  return [spec, tagComponents.join("\n")];
}

function attributesByNames(
  pgClass: PgClass,
  names: string[] | null,
  identity: () => string,
): PgAttribute[] {
  const allAttrs = pgClass.getAttributes();
  if (!names) {
    const pk = pgClass.getConstraints().find((con) => con.contype === "p");
    if (pk) {
      return pk.conkey!.map((n) => allAttrs.find((a) => a.attnum === n)!);
    } else {
      throw new Error(
        `No attributes specified for '${pgClass.getNamespace()!.nspname}.${
          pgClass.relname
        }' (oid: ${pgClass._id}) and no PK found.`,
      );
    }
  } else {
    const attrs = names.map(
      (col) => allAttrs.find((attr) => attr.attname === col)!,
    );
    for (let i = 0, l = attrs.length; i < l; i++) {
      const attr = attrs[i];
      const col = names[i];
      if (!attr) {
        throw new Error(
          `${identity()} referenced non-existent attribute '${col}'; known attributes: ${allAttrs
            .filter((a) => a.attnum >= 0)
            .map((attr) => attr.attname)
            .join(", ")}`,
        );
      }
    }

    return attrs;
  }
}

async function processUnique(
  info: GatherPluginContext<State, Cache>,
  event: {
    serviceName: string;
    introspection: Introspection;
  },
  pgClass: PgClass,
  rawSpec: string | true | (string | true)[],
  primaryKey = false,
) {
  const identity = () =>
    `${pgClass.getNamespace()!.nspname}.${pgClass.relname}`;
  const { introspection, serviceName } = event;
  const tag = primaryKey ? "primaryKey" : "unique";
  if (typeof rawSpec !== "string") {
    throw new Error(
      `Invalid '@${tag}' smart tag on ${identity()}; expected a string`,
    );
  }
  const [spec, extraDescription] = parseConstraintSpec(rawSpec);
  const attributes = spec.split(",");
  const attrs = attributesByNames(
    pgClass,
    attributes,
    () => `'@${tag}' smart tag on ${identity()}`,
  );

  if (primaryKey) {
    // All primary key attributes are non-null
    for (const attr of attrs) {
      attr.attnotnull = true;
    }
  }

  const tagsAndDescription = parseSmartComment(extraDescription);

  const id = `FAKE_${pgClass.getNamespace()!.nspname}_${
    pgClass.relname
  }_${tag}_${info.state.fakeId++}`;

  // Now we fake the constraint
  const pgConstraint: PgConstraint = {
    _id: id,
    conname: id,
    connamespace: pgClass.relnamespace,
    contype: primaryKey ? "p" : "u",
    condeferrable: false,
    condeferred: false,
    convalidated: true,
    conrelid: pgClass._id,
    contypid: "0",
    conindid: "0",
    confrelid: "0",
    confupdtype: null,
    confdeltype: null,
    confmatchtype: null,
    conislocal: true,
    coninhcount: 0,
    connoinherit: null,
    conkey: attrs.map((c) => c.attnum),
    confkey: null,
    conpfeqop: null,
    conppeqop: null,
    conffeqop: null,
    conexclop: null,
    conbin: null,
    _type: "PgConstraint",
    getClass: () => pgClass,
    getAttributes: () => attrs,
    getDescription: () => extraDescription,
    getTagsAndDescription: () => tagsAndDescription,
    getTags: () => tagsAndDescription.tags,
    getForeignClass: () => undefined,
    getForeignAttributes: () => undefined,
    getNamespace: () => pgClass.getNamespace(),
    getType: () => undefined,
  };

  await addConstraint(info, introspection, serviceName, pgConstraint);
}

const removeQuotes = (str: string) => {
  const trimmed = str.trim();
  if (trimmed[0] === '"') {
    if (trimmed[trimmed.length - 1] !== '"') {
      throw new Error(
        `We failed to parse a quoted identifier '${str}'. Please avoid putting quotes or commas in smart comment identifiers (or file a PR to fix the parser).`,
      );
    }
    return trimmed.slice(1, -1);
  } else {
    // PostgreSQL lower-cases unquoted attributes, so we should too.
    return trimmed.toLowerCase();
  }
};

const parseSqlAttributeArray = (str: string) => {
  if (!str) {
    throw new Error(`Cannot parse '${str}'`);
  }
  const parts = str.split(",");
  return parts.map(removeQuotes);
};

const parseSqlAttributeString = (str: string) => {
  if (!str) {
    throw new Error(`Cannot parse '${str}'`);
  }
  return removeQuotes(str);
};

/**
 * Parses an `@foreignKey` smart tag value, returning null if its syntax is
 * invalid. A null `foreignSchema` refers to the tagged table's schema.
 */
export function parseForeignKeyTag(rawSpec: string, fallbackSchema: string) {
  const [spec, extraDescription] = parseConstraintSpec(rawSpec);
  const matches = spec.match(
    /^\(([^()]+)\) references ([^().]+)(?:\.([^().]+))?(?:\s*\(([^()]+)\))?$/i,
  );
  if (!matches) {
    return null;
  }
  const [
    ,
    rawAttributes,
    rawSchemaOrTable,
    rawTableOnly,
    rawForeignAttributes,
  ] = matches;
  const rawSchema = rawTableOnly ? rawSchemaOrTable : null;
  const rawTable = rawTableOnly || rawSchemaOrTable;
  const attributes: string[] = parseSqlAttributeArray(rawAttributes);
  const foreignSchema: string =
    rawSchema != null ? parseSqlAttributeString(rawSchema) : fallbackSchema;
  const foreignTable: string = parseSqlAttributeString(rawTable);
  const foreignAttributes: string[] | null = rawForeignAttributes
    ? parseSqlAttributeArray(rawForeignAttributes)
    : null;

  return {
    attributes,
    foreignSchema,
    foreignTable,
    foreignAttributes,
    extraDescription,
  };
}

/** Invalid specs are reported when gathering fake constraints. */
export function parseForeignKeyTarget(rawSpec: unknown, schemaName: string) {
  if (typeof rawSpec !== "string") {
    return null;
  }
  try {
    return parseForeignKeyTag(rawSpec, schemaName);
  } catch {
    return null;
  }
}

async function processFk(
  info: GatherPluginContext<State, Cache>,
  event: {
    serviceName: string;
    introspection: Introspection;
  },
  pgClass: PgClass,
  rawSpec: string | true | (string | true)[],
) {
  const { escapeSqlIdentifier } = info.lib.sql;

  const identity = () =>
    `${pgClass.getNamespace()!.nspname}.${pgClass.relname}`;
  const { serviceName, introspection } = event;
  if (typeof rawSpec !== "string") {
    throw new Error(
      `Invalid '@foreignKey' smart tag on ${identity()}; expected a string`,
    );
  }

  const parsed = parseForeignKeyTag(rawSpec, pgClass.getNamespace()!.nspname);
  if (!parsed) {
    throw new Error(
      `Invalid @foreignKey syntax on '${identity()}'; expected something like "(col1,col2) references schema.table (c1, c2)", you passed '${parseConstraintSpec(rawSpec)[0]}'`,
    );
  }
  const {
    attributes,
    foreignTable,
    foreignAttributes,
    extraDescription,
    foreignSchema,
  } = parsed;

  const foreignPgClass = await info.helpers.pgIntrospection.getClassByName(
    serviceName,
    foreignSchema,
    foreignTable,
  );
  const multipass = !!info.options.pgMultipassIntrospection;
  // Discovery-only tables can have attributes in the lookup, but constraints
  // can only be added to tables retained in the introspection collections.
  if (
    multipass &&
    foreignPgClass &&
    (!introspection.classes.includes(foreignPgClass) ||
      foreignPgClass.getAttributes().length === 0)
  ) {
    return;
  }
  if (!foreignPgClass) {
    if (multipass) {
      const pgService = info.resolvedPreset.pgServices?.find(
        (service) => service.name === serviceName,
      );
      if (!pgService) {
        throw new Error(`Could not find '${serviceName}' in 'pgServices'`);
      }
      if (!(pgService.schemas ?? ["public"]).includes(foreignSchema)) {
        return;
      }
      console.error(
        `Invalid @foreignKey on '${identity()}'; table/view '${foreignSchema}.${foreignTable}' was not found in the introspection results. Check the database names and permissions. (${rawSpec})`,
      );
      return;
    }
    throw new Error(
      `Invalid @foreignKey on '${identity()}'; referenced non-existent table/view '${foreignSchema}.${foreignTable}'. Note that this reference must use *database names* (i.e. it does not respect @name). (${rawSpec})`,
    );
  }
  const keyAttibutes = attributesByNames(
    pgClass,
    attributes,
    () => `'@foreignKey' smart tag on ${identity()} local attributes`,
  );
  const foreignKeyAttibutes = attributesByNames(
    foreignPgClass,
    foreignAttributes,
    () => `'@foreignKey' smart tag on ${identity()} remote attributes`,
  );

  // Check that this is unique
  const isUnique = foreignPgClass.getConstraints().some((foreignConstraint) => {
    if (
      foreignConstraint.contype !== "p" &&
      foreignConstraint.contype !== "u"
    ) {
      return false;
    }
    const attrs = foreignConstraint.getAttributes();
    return (
      attrs &&
      attrs.length === foreignKeyAttibutes.length &&
      attrs.every((attr) => foreignKeyAttibutes.includes(attr))
    );
  });

  if (!isUnique) {
    if (
      info.resolvedPreset.gather?.pgFakeConstraintsAutofixForeignKeyUniqueness
    ) {
      // Auto-add unique
      await processUnique(
        info,
        event,
        foreignPgClass,
        `${foreignKeyAttibutes
          .map((attr) => attr.attname)
          .join(",")}|@behavior -single -update -delete`,
        false,
      );
    } else {
      throw new Error(
        `Invalid @foreignKey on '${identity()}'; referenced non-unique combination of attributes '${foreignSchema}.${foreignTable}' (${foreignKeyAttibutes
          .map((k) => k.attname)
          .join(
            ", ",
          )}). If this list of attributes is truly unique you should add a unique constraint to the table:

ALTER TABLE ${escapeSqlIdentifier(foreignSchema)}.${escapeSqlIdentifier(
          foreignTable,
        )}
  ADD UNIQUE (${foreignKeyAttibutes
    .map((k) => escapeSqlIdentifier(k.attname))
    .join(", ")});

or use a '@unique ${foreignKeyAttibutes
          .map((k) => k.attname)
          .join(
            ",",
          )}' smart tag to emulate this. (Original spec: ${JSON.stringify(
          rawSpec,
        )}).\nTo temporarily fix this you can set 'preset.gather.pgFakeConstraintsAutofixForeignKeyUniqueness' to 'true', but we strongly recommend against using this long term.'`,
      );
    }
  }

  const tagsAndDescription = parseSmartComment(extraDescription);

  const id = `FAKE_${pgClass.getNamespace()!.nspname}_${
    pgClass.relname
  }_foreignKey_${info.state.fakeId++}`;

  // Now we fake the constraint
  const pgConstraint: PgConstraint = {
    _id: id,
    conname: id,
    connamespace: pgClass.relnamespace,
    contype: "f",
    condeferrable: false,
    condeferred: false,
    convalidated: true,
    conrelid: pgClass._id,
    contypid: "0",
    conindid: "0",
    confrelid: foreignPgClass._id,
    confupdtype: "a",
    confdeltype: "a",
    confmatchtype: "s",
    conislocal: true,
    coninhcount: 0,
    connoinherit: null,
    conkey: keyAttibutes.map((c) => c.attnum),
    confkey: foreignKeyAttibutes.map((c) => c.attnum),
    conpfeqop: null,
    conppeqop: null,
    conffeqop: null,
    conexclop: null,
    conbin: null,
    _type: "PgConstraint",
    getClass: () => pgClass,
    getAttributes: () => keyAttibutes,
    getDescription: () => extraDescription,
    getTagsAndDescription: () => tagsAndDescription,
    getTags: () => tagsAndDescription.tags,
    getForeignClass: () => foreignPgClass,
    getForeignAttributes: () => foreignKeyAttibutes,
    getNamespace: () => pgClass.getNamespace(),
    getType: () => undefined,
  };

  await addConstraint(info, introspection, serviceName, pgConstraint);
}

async function addConstraint(
  info: GatherPluginContext<State, Cache>,
  introspection: Introspection,
  serviceName: string,
  pgConstraint: PgConstraint,
) {
  introspection.constraints.push(pgConstraint);
  addConstraintToClass(introspection, pgConstraint, pgConstraint.conrelid);
  addConstraintToClass(
    introspection,
    pgConstraint,
    pgConstraint.confrelid,
    true,
  );
  await info.process("pgFakeConstraints_constraint", {
    introspection,
    serviceName,
    entity: pgConstraint,
  });
}

function addConstraintToClass(
  introspection: Introspection,
  pgConstraint: PgConstraint,
  oid: string | null | undefined,
  foreign = false,
) {
  if (oid != null && oid != "0") {
    const pgClass = introspection.classes.find((rel) => rel._id === oid);
    if (!pgClass) {
      throw new Error(
        `Broken foreign constraint, class '${oid}' doesn't exist?`,
      );
    }
    const constraints = foreign
      ? pgClass.getForeignConstraints()
      : pgClass.getConstraints();
    if (!constraints.includes(pgConstraint)) {
      constraints.push(pgConstraint);
    }
  }
}

export function foreignKeyTargets(
  schemas: readonly string[],
): IntrospectionPolicy<"classes"> {
  return {
    name: "foreignKeyEnumTargets",
    entity: "classes",
    select(row, details) {
      const foreignKey = details.getTagsAndDescription("classes", row)?.tags
        .foreignKey;
      if (foreignKey == null) {
        return;
      }
      const [namespace] =
        details.peek("namespaces", { _id: row.relnamespace }, [
          "_foreignKeyTarget",
        ]) ?? [];
      if (!namespace) {
        return;
      }
      const specs = Array.isArray(foreignKey) ? foreignKey : [foreignKey];
      for (const rawSpec of specs) {
        const target = parseForeignKeyTarget(rawSpec, namespace.nspname);
        if (!target) {
          continue;
        }
        const targetClass = details.peekByName(
          "classes",
          [target.foreignSchema, target.foreignTable],
          ["_foreignKeyTarget"],
        );
        if (!targetClass) {
          continue;
        }
        // A smart FK on an entrypoint discovers its in-schema target just like
        // a catalog FK. Outside those schemas we only need enum dependencies.
        if (
          schemas.includes(target.foreignSchema) &&
          details.hasPurpose("initial")
        ) {
          details.request("classes", { _id: targetClass._id }, [
            "registryRelation",
            "enumTables",
          ]);
          continue;
        }
        const targetTags = details.getTagsAndDescription(
          "classes",
          targetClass,
        );
        if (
          isEnumTag(targetTags?.tags.enum) ||
          (target.attributes.length === 1 &&
            (target.foreignAttributes == null ||
              target.foreignAttributes.length === 1) &&
            hasEnumKey(
              details,
              targetClass,
              targetTags?.tags,
              target.foreignAttributes?.[0],
            ))
        ) {
          details.request("classes", { _id: targetClass._id }, ["enumTables"]);
        }
      }
    },
  };
}

/** Catalog keys identify their columns by number; smart keys use names. */
export function primaryKeyColumns(
  details: IntrospectionPolicyDetails,
  table: IntrospectionRow<"classes">,
  primaryKeys: readonly IntrospectionRow<"constraints">[] | undefined,
) {
  if (primaryKeys === undefined) return undefined;
  const columns = primaryKeys[0]?.conkey;
  if (columns != null) return columns;
  const spec = details.getTagsAndDescription("classes", table)?.tags.primaryKey;
  return typeof spec === "string"
    ? parseConstraintSpec(spec)[0].split(",")
    : undefined;
}

/** Without a target column, any single-column smart key can match. */
export function isSmartEnumKey(
  rawSpec: PgSmartTagsDict[string] | undefined,
  column?: string,
  enumTable = false,
) {
  if (typeof rawSpec !== "string") return false;
  const [spec, description] = parseConstraintSpec(rawSpec);
  return (
    (column === undefined ? !spec.includes(",") : spec === column) &&
    (enumTable || isEnumTag(parseSmartComment(description).tags.enum))
  );
}

/** Match the referenced column against both catalog keys and smart keys. */
function hasEnumKey(
  details: IntrospectionPolicyDetails,
  target: IntrospectionRow<"classes">,
  tags: PgSmartTagsDict | undefined,
  explicitColumn: string | undefined,
) {
  const primaryKeys = details.peek(
    "constraints",
    { conrelid: target._id, contype: "p" },
    ["_foreignKeyTarget"],
  );
  const uniqueKeys = details.peek(
    "constraints",
    { conrelid: target._id, contype: "u" },
    ["_foreignKeyTarget"],
  );
  const columns =
    explicitColumn === undefined
      ? primaryKeyColumns(details, target, primaryKeys)
      : [explicitColumn];
  if (columns?.length !== 1) {
    return false;
  }
  const column = columns[0];
  const attnum =
    typeof column === "number"
      ? column
      : details.peek("attributes", { attrelid: target._id, attname: column }, [
          "_foreignKeyTarget",
        ])?.[0]?.attnum;
  for (const keys of [primaryKeys, uniqueKeys]) {
    if (
      keys?.some((key) => {
        if (key.conkey?.length !== 1 || key.conkey[0] !== attnum) {
          return false;
        }
        const tag = details.getTagsAndDescription("constraints", key)?.tags
          .enum;
        return isEnumTag(tag);
      })
    ) {
      return true;
    }
  }
  if (!tags || (tags.primaryKey == null && tags.unique == null)) {
    return false;
  }
  const attname =
    typeof column === "string"
      ? column
      : details.peek("attributes", { attrelid: target._id, attnum: column }, [
          "_foreignKeyTarget",
        ])?.[0]?.attname;
  const unique = tags.unique;
  const specs = [
    tags.primaryKey,
    ...(Array.isArray(unique) ? unique : [unique]),
  ];
  return (
    attname !== undefined && specs.some((spec) => isSmartEnumKey(spec, attname))
  );
}
