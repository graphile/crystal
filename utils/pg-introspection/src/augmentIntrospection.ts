import {
  OBJECT_COLUMN,
  OBJECT_DATABASE,
  OBJECT_FUNCTION,
  OBJECT_SCHEMA,
  OBJECT_SEQUENCE,
  OBJECT_TABLE,
  parseAcls,
  PUBLIC_ROLE,
} from "./acl.ts";
import type {
  Introspection,
  PgAttribute,
  PgClass,
  PgConstraint,
  PgDescription,
  PgEnum,
  PgIndex,
  PgNamespace,
  PgProcArgument,
  PgRange,
  PgRoles,
  PgType,
} from "./introspection.ts";
import type { PgSmartTagsAndDescription } from "./smartComments.ts";
import { parseSmartComment } from "./smartComments.ts";

/**
 * Only suitable for functions that accept no arguments.
 */
function memo<T>(fn: () => T): () => T {
  let cache: T;
  let called = false;
  return () => {
    if (!called) {
      cache = fn();
      called = true;
    }
    return cache!;
  };
}

function del<T extends Record<string, any>, TKey extends keyof T>(
  toDelete: Set<string>,
  collection: T[],
  attr: TKey,
) {
  for (let i = collection.length - 1; i >= 0; i--) {
    const entry = collection[i];
    if (entry[attr] != null && toDelete.has(entry[attr])) {
      collection.splice(i, 1);
    }
  }
}

function descriptionKey(
  spec: Pick<PgDescription, "classoid" | "objoid" | "objsubid">,
) {
  return `${spec.classoid}|${spec.objoid}|${spec.objsubid}`;
}

function namespaceNameKey(namespaceId: string, name: string | null) {
  return `${namespaceId}|${name}`;
}

function attributeRelNumKey(relid: string, attnum: number) {
  return `${relid}|${attnum}`;
}

function createLookups(introspection: Omit<Introspection, `_${string}`>) {
  const lookups: Introspection["_lookups"] = {
    oidByCatalog: Object.create(null),
    roleById: new Map(),
    roleByName: Object.create(null),
    authMembersByMemberId: new Map(),
    namespaceById: new Map(),
    namespaceByName: new Map(),
    typeById: new Map(),
    classById: new Map(),
    classByNamespaceName: new Map(),
    rangeByTypid: new Map(),
    attributesByRelId: new Map(),
    attributeByRelIdAndNum: new Map(),
    constraintById: new Map(),
    constraintsByRelid: new Map(),
    constraintByNamespaceName: new Map(),
    foreignConstraintsByRelid: new Map(),
    enumById: new Map(),
    enumsByTypid: new Map(),
    indexById: new Map(),
    indexesByRelid: new Map(),
    descriptionByDescriptionKey: new Map(),
    procById: new Map(),
    procsByNamespaceName: new Map(),
    extensionById: new Map(),
    languageById: new Map(),
    accessMethodById: new Map(),
  };

  const {
    oidByCatalog,
    authMembersByMemberId,
    roleById,
    roleByName,
    namespaceById,
    namespaceByName,
    typeById,
    classById,
    classByNamespaceName,
    rangeByTypid,
    attributesByRelId,
    attributeByRelIdAndNum,
    constraintById,
    constraintsByRelid,
    constraintByNamespaceName,
    foreignConstraintsByRelid,
    enumById,
    enumsByTypid,
    indexById,
    indexesByRelid,
    descriptionByDescriptionKey,
    procById,
    procsByNamespaceName,
    extensionById,
    languageById,
    accessMethodById,
  } = lookups;

  for (const [oid, catalog] of Object.entries(introspection.catalog_by_oid)) {
    oidByCatalog[catalog] = oid;
  }
  for (const entity of introspection.namespaces) {
    namespaceById.set(entity._id, entity);
    namespaceByName.set(entity.nspname, entity);
  }
  for (const entity of introspection.types) {
    typeById.set(entity._id, entity);
  }
  for (const entity of introspection.classes) {
    classById.set(entity._id, entity);
    classByNamespaceName.set(
      namespaceNameKey(entity.relnamespace, entity.relname),
      entity,
    );
  }
  for (const entity of introspection.procs) {
    procById.set(entity._id, entity);
    addListItem(
      procsByNamespaceName,
      namespaceNameKey(entity.pronamespace, entity.proname),
      entity,
    );
  }
  for (const entity of introspection.extensions) {
    extensionById.set(entity._id, entity);
  }
  for (const entity of introspection.languages) {
    languageById.set(entity._id, entity);
  }
  for (const entity of introspection.am) {
    accessMethodById.set(entity._id, entity);
  }
  for (const entity of introspection.ranges) {
    if (entity.rngtypid == null) continue;
    rangeByTypid.set(entity.rngtypid, entity);
  }
  for (const entity of introspection.descriptions) {
    descriptionByDescriptionKey.set(descriptionKey(entity), entity);
  }

  function addListItem<T>(
    cache: Map<string, T[]>,
    cacheKey: string,
    entity: T,
  ): void {
    const list = cache.get(cacheKey);
    if (list) {
      list.push(entity);
    } else {
      cache.set(cacheKey, [entity]);
    }
  }

  // Constraints (sorted)
  for (const entity of introspection.constraints) {
    constraintById.set(entity._id, entity);
    constraintByNamespaceName.set(
      namespaceNameKey(entity.connamespace, entity.conname),
      entity,
    );
    if (entity.conrelid !== "0") {
      addListItem(constraintsByRelid, entity.conrelid, entity);
    }
    if (entity.confrelid !== "0") {
      addListItem(foreignConstraintsByRelid, entity.confrelid, entity);
    }
  }
  for (const list of constraintsByRelid.values()) {
    list.sort((a, z) => a.conname.localeCompare(z.conname, "en-US"));
  }

  // Attributes (sorted)
  for (const entity of introspection.attributes) {
    addListItem(attributesByRelId, entity.attrelid, entity);
    attributeByRelIdAndNum.set(
      attributeRelNumKey(entity.attrelid, entity.attnum),
      entity,
    );
  }
  for (const list of attributesByRelId.values()) {
    list.sort((a, z) => a.attnum - z.attnum);
  }

  // Enums (sorted)
  for (const entity of introspection.enums) {
    enumById.set(entity._id, entity);
    addListItem(enumsByTypid, entity.enumtypid, entity);
  }
  for (const list of enumsByTypid.values()) {
    list.sort((a, z) => a.enumsortorder - z.enumsortorder);
  }

  for (const entity of introspection.indexes) {
    indexById.set(entity.indexrelid, entity);
    addListItem(indexesByRelid, entity.indrelid, entity);
  }

  roleById.set(PUBLIC_ROLE._id, PUBLIC_ROLE);
  roleByName[PUBLIC_ROLE.rolname] = PUBLIC_ROLE;
  authMembersByMemberId.set(PUBLIC_ROLE._id, new Set());
  for (const role of introspection.roles) {
    roleById.set(role._id, role);
    roleByName[role.rolname] = role;
    authMembersByMemberId.set(role._id, new Set());
  }

  for (const am of introspection.auth_members) {
    const set = authMembersByMemberId.get(am.member);
    if (!set) {
      // This should never happen
      console.warn(
        `Introspection has membership for role with id '${am.member}', but there is no such role`,
      );
      continue;
    }
    set.add(am);
  }

  return lookups;
}

function createCaches(): Introspection["_caches"] {
  return {
    expandRoles: new Map(),
  };
}

/**
 * Adds helpers to the introspection results.
 */
export function augmentIntrospection(
  introspectionResultsString: string,
  includeExtensionResources = false,
): Introspection {
  const introspection = JSON.parse(introspectionResultsString) as Introspection;
  return augmentIntrospectionParsed(introspection, includeExtensionResources);
}

/** @internal */
export function augmentIntrospectionParsed(
  introspection: Introspection,
  includeExtensionResources = false,
): Introspection {
  introspection._lookups = createLookups(introspection);
  introspection._caches = createCaches();

  const {
    oidByCatalog,
    // authMembersByMemberId,
    roleById,
    // roleByName,
    namespaceById,
    namespaceByName,
    typeById,
    classById,
    classByNamespaceName,
    rangeByTypid,
    attributesByRelId,
    attributeByRelIdAndNum,
    constraintById,
    constraintsByRelid,
    constraintByNamespaceName,
    foreignConstraintsByRelid,
    enumById,
    enumsByTypid,
    indexById,
    indexesByRelid,
    descriptionByDescriptionKey,
    procById,
    procsByNamespaceName,
    extensionById,
    languageById,
    accessMethodById,
  } = introspection._lookups;

  if (!includeExtensionResources) {
    // Go through and delete things from the extensions
    const extensionProcOids = new Set<string>();
    const extensionClassOids = new Set<string>();
    for (const pg_depend of introspection.depends) {
      if (
        pg_depend.refclassid === oidByCatalog["pg_extension"] &&
        pg_depend.deptype === "e" &&
        pg_depend.classid === oidByCatalog["pg_proc"]
      ) {
        extensionProcOids.add(pg_depend.objid);
      }

      if (
        pg_depend.refclassid === oidByCatalog["pg_extension"] &&
        pg_depend.deptype === "e" &&
        pg_depend.classid === oidByCatalog["pg_class"]
      ) {
        extensionClassOids.add(pg_depend.objid);
      }
    }

    del(extensionProcOids, introspection.procs, "_id");
    del(extensionClassOids, introspection.classes, "_id");
    del(extensionClassOids, introspection.attributes, "attrelid");
    del(extensionClassOids, introspection.constraints, "conrelid");
    del(extensionClassOids, introspection.constraints, "confrelid");
    del(extensionClassOids, introspection.types, "typrelid");
  }

  const getRole = (id: string | null): PgRoles | undefined =>
    id != null ? roleById.get(id) : undefined;
  const getNamespace = (id: string | null): PgNamespace | undefined =>
    id != null ? namespaceById.get(id) : undefined;
  const getType = (id: string | null): PgType | undefined =>
    id != null ? typeById.get(id) : undefined;
  const getClass = (id: string | null): PgClass | undefined =>
    id != null ? classById.get(id) : undefined;
  const getRange = (id: string | null): PgRange | undefined =>
    id != null ? rangeByTypid.get(id) : undefined;
  const getAttributes = (id: string | null): PgAttribute[] =>
    id != null ? (attributesByRelId.get(id) ?? []) : [];
  const getConstraints = (id: string | null): PgConstraint[] =>
    id != null ? (constraintsByRelid.get(id) ?? []) : [];
  const getForeignConstraints = (id: string | null): PgConstraint[] =>
    id != null ? (foreignConstraintsByRelid.get(id) ?? []) : [];
  const getEnums = (id: string | null): PgEnum[] =>
    id != null ? (enumsByTypid.get(id) ?? []) : [];
  const getIndexes = (id: string | null): PgIndex[] =>
    id != null ? (indexesByRelid.get(id) ?? []) : [];

  const PG_NAMESPACE = oidByCatalog["pg_namespace"];
  const PG_CLASS = oidByCatalog["pg_class"];
  const PG_PROC = oidByCatalog["pg_proc"];
  const PG_TYPE = oidByCatalog["pg_type"];
  const PG_CONSTRAINT = oidByCatalog["pg_constraint"];
  const PG_EXTENSION = oidByCatalog["pg_extension"];

  if (
    !PG_NAMESPACE ||
    !PG_CLASS ||
    !PG_PROC ||
    !PG_TYPE ||
    !PG_CONSTRAINT ||
    !PG_EXTENSION
  ) {
    throw new Error(
      `Invalid introspection results; could not determine the ids of the system catalogs`,
    );
  }

  const getDescription = (
    classoid: string,
    objoid: string,
    objsubid = 0,
  ): string | undefined =>
    descriptionByDescriptionKey.get(
      descriptionKey({ classoid, objoid, objsubid }),
    )?.description;

  const getTagsAndDescription = (
    classoid: string,
    objoid: string,
    objsubid?: number,
    fallback?: {
      classoid: string;
      objoid: string;
      objsubid?: number;
    },
  ): PgSmartTagsAndDescription => {
    let description = getDescription(classoid, objoid, objsubid);
    if (description == null && fallback) {
      description = getDescription(
        fallback.classoid,
        fallback.objoid,
        fallback.objsubid,
      );
    }
    return parseSmartComment(description);
  };

  const currentUser =
    introspection._lookups.roleByName[introspection.current_user];
  introspection.getCurrentUser = () => currentUser;

  introspection.getNamespace = (by) => {
    if ("id" in by && by.id) {
      return namespaceById.get(by.id);
    } else if ("name" in by && by.name) {
      return namespaceByName.get(by.name);
    }
  };
  introspection.getClass = (by) => classById.get(by.id);
  introspection.getConstraint = (by) => constraintById.get(by.id);
  introspection.getProc = (by) => procById.get(by.id);
  introspection.getRoles = (by) => roleById.get(by.id);
  introspection.getType = (by) => typeById.get(by.id);
  introspection.getEnum = (by) => enumById.get(by.id);
  introspection.getExtension = (by) => extensionById.get(by.id);
  introspection.getIndex = (by) => indexById.get(by.id);
  introspection.getLanguage = (by) => languageById.get(by.id);

  introspection.database._type = "PgDatabase";
  introspection.database.getOwner = memo(() =>
    getRole(introspection.database.datdba),
  );
  introspection.database.getDba = introspection.database.getOwner;
  introspection.database.getACL = memo(() =>
    parseAcls(
      introspection,
      introspection.database.datacl,
      introspection.database.datdba,
      OBJECT_DATABASE,
    ),
  );

  introspection.namespaces.forEach((entity) => {
    entity._type = "PgNamespace";
    entity.getOwner = memo(() => getRole(entity.nspowner));
    entity.getDescription = memo(() =>
      getDescription(PG_NAMESPACE, entity._id),
    );
    entity.getTagsAndDescription = memo(() =>
      getTagsAndDescription(PG_NAMESPACE, entity._id),
    );
    entity.getTags = memo(() => entity.getTagsAndDescription().tags);
    entity.getACL = memo(() =>
      parseAcls(introspection, entity.nspacl, entity.nspowner, OBJECT_SCHEMA),
    );

    entity.getClass = (by) =>
      classByNamespaceName.get(namespaceNameKey(entity._id, by.name));
    entity.getConstraint = (by) =>
      constraintByNamespaceName.get(namespaceNameKey(entity._id, by.name));
    entity.getProcs = (by) =>
      procsByNamespaceName.get(namespaceNameKey(entity._id, by.name)) ?? [];
  });

  introspection.classes.forEach((entity) => {
    entity._type = "PgClass";
    entity.getNamespace = memo(() => getNamespace(entity.relnamespace));
    entity.getType = memo(() => getType(entity.reltype));
    entity.getOfType = memo(() => getType(entity.reloftype));
    entity.getOwner = memo(() => getRole(entity.relowner));
    entity.getAttributes = memo(() => getAttributes(entity._id));
    entity.getConstraints = memo(() => getConstraints(entity._id));
    entity.getForeignConstraints = memo(() =>
      getForeignConstraints(entity._id),
    );
    entity.getIndexes = memo(() => getIndexes(entity._id));
    entity.getDescription = memo(() => getDescription(PG_CLASS, entity._id, 0));
    entity.getTagsAndDescription = memo(() =>
      getTagsAndDescription(PG_CLASS, entity._id, 0, {
        classoid: PG_TYPE,
        objoid: entity.reltype,
      }),
    );
    entity.getTags = memo(() => entity.getTagsAndDescription().tags);
    entity.getACL = memo(() =>
      parseAcls(
        introspection,
        entity.relacl,
        entity.relowner,
        entity.relkind === "S" ? OBJECT_SEQUENCE : OBJECT_TABLE,
      ),
    );

    entity.getAttribute = (by) => {
      const attributes = entity.getAttributes();
      return attributes.find((att) =>
        "number" in by && by.number
          ? att.attnum === by.number
          : "name" in by && by.name
            ? att.attname === by.name
            : false,
      );
    };
    entity.getInherited = memo(() =>
      introspection.inherits.filter((inh) => inh.inhrelid === entity._id),
    );
    entity.getAccessMethod = memo(() =>
      entity.relam != null ? accessMethodById.get(entity.relam) : undefined,
    );
  });
  introspection.indexes.forEach((entity) => {
    entity._type = "PgIndex";
    entity.getIndexClass = memo(() => getClass(entity.indexrelid));
    entity.getClass = memo(() => getClass(entity.indrelid));
    entity.getKeys = memo(() => {
      const owner = getClass(entity.indrelid);
      const keys = entity.indkey;
      return keys.map((key) =>
        key === 0
          ? null
          : attributeByRelIdAndNum.get(attributeRelNumKey(owner!._id, key))!,
      );
    });
    entity.getDescription = memo(() =>
      entity.getIndexClass()?.getDescription(),
    );
    entity.getTagsAndDescription = memo(
      () =>
        entity.getIndexClass()?.getTagsAndDescription() ?? {
          tags: Object.create(null),
          description: undefined,
        },
    );
    entity.getTags = memo(() => entity.getTagsAndDescription().tags);
  });
  introspection.attributes.forEach((entity) => {
    entity._type = "PgAttribute";
    entity.getClass = memo(() => getClass(entity.attrelid));
    entity.getType = memo(() => getType(entity.atttypid));
    entity.getDescription = memo(() =>
      getDescription(PG_CLASS, entity.attrelid, entity.attnum),
    );
    entity.getTagsAndDescription = memo(() =>
      getTagsAndDescription(PG_CLASS, entity.attrelid, entity.attnum),
    );
    entity.getTags = memo(() => entity.getTagsAndDescription().tags);
    entity.getACL = memo(() =>
      parseAcls(
        introspection,
        entity.attacl,
        entity.getClass()!.relowner,
        OBJECT_COLUMN,
      ),
    );
  });
  introspection.constraints.forEach((entity) => {
    entity._type = "PgConstraint";
    entity.getNamespace = memo(() => getNamespace(entity.connamespace));
    entity.getClass = memo(() => getClass(entity.conrelid));
    entity.getAttributes = memo(() => {
      const klass = getClass(entity.conrelid);
      if (!klass) {
        console.error(
          `getAttributes() called on constraint '${entity.conname}' (type = '${entity.contype}'), but we could not find the constraint's table (oid = '${entity.conrelid}') in the introspection results; returning empty array`,
        );
        return [];
      }
      if (!entity.conkey) {
        if (entity.contype === "f") {
          console.error(
            `getAttributes() called on constraint '${entity.conname}' (type = '${entity.contype}'), but that constraint has no 'conkey'; returning empty array`,
          );
          return [];
        } else {
          return;
        }
      }
      return entity.conkey.map(
        (key) =>
          attributeByRelIdAndNum.get(attributeRelNumKey(klass._id, key))!,
      );
    });
    entity.getType = memo(() => getType(entity.contypid));
    entity.getForeignClass = memo(() => getClass(entity.confrelid));
    entity.getForeignAttributes = memo(() => {
      if (entity.confrelid == null) {
        if (entity.contype === "f") {
          console.error(
            `getForeignAttributes() called on constraint '${entity.conname}' (type = '${entity.contype}'), but that constraint has no 'confrelid'; returning empty array`,
          );
          return [];
        } else {
          return;
        }
      }
      const klass = getClass(entity.confrelid);
      if (!klass) {
        console.error(
          `getForeignAttributes() called on constraint '${entity.conname}' (type = '${entity.contype}'), but we could not find the constraint's foreign table (oid = '${entity.confrelid}') in the introspection results; returning empty array`,
        );
        return [];
      }
      if (!entity.confkey) {
        if (entity.contype === "f") {
          console.error(
            `getForeignAttributes() called on constraint '${entity.conname}' (type = '${entity.contype}'), but that constraint has no 'confkey'; returning empty array`,
          );
          return [];
        } else {
          return;
        }
      }
      return entity.confkey.map(
        (key) =>
          attributeByRelIdAndNum.get(attributeRelNumKey(klass._id, key))!,
      );
    });
    entity.getDescription = memo(() =>
      getDescription(PG_CONSTRAINT, entity._id),
    );
    entity.getTagsAndDescription = memo(() =>
      getTagsAndDescription(PG_CONSTRAINT, entity._id),
    );
    entity.getTags = memo(() => entity.getTagsAndDescription().tags);
  });
  introspection.procs.forEach((entity) => {
    entity._type = "PgProc";
    entity.getNamespace = memo(() => getNamespace(entity.pronamespace));
    entity.getOwner = memo(() => getRole(entity.proowner));
    entity.getReturnType = memo(() => getType(entity.prorettype));
    entity.getDescription = memo(() => getDescription(PG_PROC, entity._id));
    entity.getTagsAndDescription = memo(() =>
      getTagsAndDescription(PG_PROC, entity._id),
    );
    entity.getTags = memo(() => entity.getTagsAndDescription().tags);
    entity.getArguments = memo(() => {
      const args: PgProcArgument[] = [];
      const {
        // Null if everything 'in'. i: IN, o: OUT, b: INOUT, v: VARIADIC, t: TABLE
        proargmodes,
        // Null if no names
        proargnames,
        // Only input types
        proargtypes,
        // Null if no arg defaults, length = pronargdefaults
        // proargdefaults,
        // Number of inpart args
        // pronargs,
        // All args, null if all args are input
        proallargtypes,
        // Number of arguments with defaults
        pronargdefaults,
      } = entity;
      if (proallargtypes) {
        for (let i = 0, l = proallargtypes.length; i < l; i++) {
          const typeId = proallargtypes[i];
          const type = typeById.get(typeId);
          if (!type) {
            throw new Error("Corrupted introspection data");
          }
          const mode = proargmodes?.[i] ?? "i";
          const isIn = mode === "i" || mode === "b" || mode === "v";
          const isOut = mode === "o" || mode === "b" || mode === "t";
          const isVariadic = mode === "v";
          const hasDefault = pronargdefaults ? i >= l - pronargdefaults : false;
          const name = proargnames?.[i] ?? null;

          args.push({
            isIn,
            isOut,
            isVariadic,
            hasDefault,
            type,
            name,
          });
        }
      } else if (proargtypes) {
        for (let i = 0, l = proargtypes.length; i < l; i++) {
          const typeId = proargtypes[i];
          const type = typeById.get(typeId);
          if (!type) {
            throw new Error("Corrupted introspection data");
          }
          const mode = proargmodes?.[i] ?? "i";
          const isIn = mode === "i" || mode === "b" || mode === "v";
          const isOut = mode === "o" || mode === "b" || mode === "t";
          const isVariadic = mode === "v";
          const hasDefault = pronargdefaults ? i >= l - pronargdefaults : false;
          const name = proargnames?.[i] ?? null;

          args.push({
            isIn,
            isOut,
            isVariadic,
            hasDefault,
            type,
            name,
          });
        }
      }

      return args;
    });
    entity.getACL = memo(() =>
      parseAcls(introspection, entity.proacl, entity.proowner, OBJECT_FUNCTION),
    );
  });
  introspection.types.forEach((entity) => {
    entity._type = "PgType";
    entity.getNamespace = memo(() => getNamespace(entity.typnamespace));
    entity.getOwner = memo(() => getRole(entity.typowner));
    entity.getClass = memo(() => getClass(entity.typrelid));
    entity.getElemType = memo(() => getType(entity.typelem));
    entity.getArrayType = memo(() => getType(entity.typarray));
    entity.getEnumValues = memo(() => getEnums(entity._id));
    entity.getRange = memo(() => getRange(entity._id));
    entity.getDescription = memo(() => getDescription(PG_TYPE, entity._id));
    entity.getTagsAndDescription = memo(() =>
      getTagsAndDescription(PG_TYPE, entity._id),
    );
    entity.getTags = memo(() => entity.getTagsAndDescription().tags);
  });
  introspection.enums.forEach((entity) => {
    entity._type = "PgEnum";
    entity.getType = memo(() => getType(entity.enumtypid));
    // Postgres doesn't support comments on enum values right now, but we still
    // want to be able to add tags/description so we fake it.
    entity.getTagsAndDescription = memo(() => ({
      tags: Object.create(null),
      description: "",
    }));
    entity.getTags = memo(() => entity.getTagsAndDescription().tags);
  });
  introspection.ranges.forEach((entity) => {
    entity._type = "PgRange";
    entity.getType = memo(() => getType(entity.rngtypid));
    entity.getSubType = memo(() => getType(entity.rngsubtype));
  });

  introspection.inherits.forEach((entity) => {
    entity.getParent = () => classById.get(entity.inhparent);
    entity.getChild = () => classById.get(entity.inhrelid);
  });
  return introspection;
}
