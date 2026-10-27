import { PUBLIC_ROLE } from "./acl.ts";
import { createEntityMethods } from "./entityMethods.ts";
import type {
  DefaultEntities,
  Introspection,
  IntrospectionDataForEntities,
  IntrospectionLookups,
  IntrospectOptions,
} from "./interfaces.ts";
import type { PgDescription } from "./interfaces.ts";
import type { EntityType } from "./introspection.ts";
import { defaultEntities } from "./query.ts";

function del<T extends Record<string, any>, TKey extends keyof T>(
  toDelete: Set<string>,
  collection: T[] | undefined,
  attr: TKey,
) {
  if (collection == null) return;
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

function createEmptyLookups(): IntrospectionLookups {
  return {
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
}

function createLookups<TEntities extends EntityType = DefaultEntities>(
  introspection: Introspection<TEntities>,
  lookups: IntrospectionLookups,
) {
  const {
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

  if (introspection.namespaces) {
    for (const entity of introspection.namespaces) {
      namespaceById.set(entity._id, entity);
      namespaceByName.set(entity.nspname, entity);
    }
  }
  if (introspection.types) {
    for (const entity of introspection.types) {
      typeById.set(entity._id, entity);
    }
  }
  if (introspection.classes) {
    for (const entity of introspection.classes) {
      classById.set(entity._id, entity);
      classByNamespaceName.set(
        namespaceNameKey(entity.relnamespace, entity.relname),
        entity,
      );
    }
  }
  if (introspection.procs) {
    for (const entity of introspection.procs) {
      procById.set(entity._id, entity);
      addListItem(
        procsByNamespaceName,
        namespaceNameKey(entity.pronamespace, entity.proname),
        entity,
      );
    }
  }
  if (introspection.extensions) {
    for (const entity of introspection.extensions) {
      extensionById.set(entity._id, entity);
    }
  }
  if (introspection.languages) {
    for (const entity of introspection.languages) {
      languageById.set(entity._id, entity);
    }
  }
  if (introspection.am) {
    for (const entity of introspection.am) {
      accessMethodById.set(entity._id, entity);
    }
  }
  if (introspection.ranges) {
    for (const entity of introspection.ranges) {
      if (entity.rngtypid == null) continue;
      rangeByTypid.set(entity.rngtypid, entity);
    }
  }
  if (introspection.descriptions) {
    for (const entity of introspection.descriptions) {
      descriptionByDescriptionKey.set(descriptionKey(entity), entity);
    }
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
  if (introspection.constraints) {
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
  }
  for (const list of constraintsByRelid.values()) {
    list.sort((a, z) => a.conname.localeCompare(z.conname, "en-US"));
  }

  // Attributes (sorted)
  if (introspection.attributes) {
    for (const entity of introspection.attributes) {
      addListItem(attributesByRelId, entity.attrelid, entity);
      attributeByRelIdAndNum.set(
        attributeRelNumKey(entity.attrelid, entity.attnum),
        entity,
      );
    }
  }
  for (const list of attributesByRelId.values()) {
    list.sort((a, z) => a.attnum - z.attnum);
  }

  // Enums (sorted)
  if (introspection.enums) {
    for (const entity of introspection.enums) {
      enumById.set(entity._id, entity);
      addListItem(enumsByTypid, entity.enumtypid, entity);
    }
  }
  for (const list of enumsByTypid.values()) {
    list.sort((a, z) => a.enumsortorder - z.enumsortorder);
  }

  if (introspection.indexes) {
    for (const entity of introspection.indexes) {
      indexById.set(entity.indexrelid, entity);
      addListItem(indexesByRelid, entity.indrelid, entity);
    }
  }

  roleById.set(PUBLIC_ROLE._id, PUBLIC_ROLE);
  roleByName[PUBLIC_ROLE.rolname] = PUBLIC_ROLE;
  authMembersByMemberId.set(PUBLIC_ROLE._id, new Set());
  if (introspection.roles) {
    for (const role of introspection.roles) {
      roleById.set(role._id, role);
      roleByName[role.rolname] = role;
      authMembersByMemberId.set(role._id, new Set());
    }
  }

  if (introspection.auth_members) {
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
  }

  return lookups;
}

function createCaches<TEntities extends EntityType = DefaultEntities>(
  _options: IntrospectOptions<TEntities>,
): Introspection["_caches"] {
  return {
    expandRoles: new Map(),
  };
}

/**
 * Adds helpers to the introspection results.
 *
 * @deprecated Use `introspect` function instead
 */
export function augmentIntrospection(
  introspectionResultsString: string,
  includeExtensionResources = false,
): Introspection<DefaultEntities> {
  const introspection: IntrospectionDataForEntities = JSON.parse(
    introspectionResultsString,
  );
  return augmentIntrospectionData<DefaultEntities>(
    { onlyEntities: [...defaultEntities], includeExtensionResources },
    introspection,
  );
}

export function augmentIntrospectionData<
  TEntities extends EntityType = DefaultEntities,
>(
  options: IntrospectOptions<TEntities>,
  introspectionData: IntrospectionDataForEntities<TEntities>,
): Introspection<TEntities> {
  const { includeExtensionResources } = options;
  const lookups = createEmptyLookups();
  for (const [oid, catalog] of Object.entries(
    introspectionData.catalog_by_oid,
  )) {
    lookups.oidByCatalog[catalog] = oid;
  }

  let result: Introspection<TEntities>;
  const methods = createEntityMethods(() => result, lookups);
  const {
    database,
    namespaces,
    classes,
    attributes,
    constraints,
    procs,
    types,
    enums,
    indexes,
    inherits,
    ranges,
    ...rest
  } = introspectionData;
  const augmented = {
    ...rest,
    ...(database && {
      database: Object.assign(database, methods.PgDatabaseMethods()),
    }),
    ...(namespaces && {
      namespaces: namespaces.map((row) =>
        Object.assign(row, methods.PgNamespaceMethods()),
      ),
    }),
    ...(classes && {
      classes: classes.map((row) =>
        Object.assign(row, methods.PgClassMethods()),
      ),
    }),
    ...(attributes && {
      attributes: attributes.map((row) =>
        Object.assign(row, methods.PgAttributeMethods()),
      ),
    }),
    ...(constraints && {
      constraints: constraints.map((row) =>
        Object.assign(row, methods.PgConstraintMethods()),
      ),
    }),
    ...(procs && {
      procs: procs.map((row) => Object.assign(row, methods.PgProcMethods())),
    }),
    ...(types && {
      types: types.map((row) => Object.assign(row, methods.PgTypeMethods())),
    }),
    ...(enums && {
      enums: enums.map((row) => Object.assign(row, methods.PgEnumMethods())),
    }),
    ...(indexes && {
      indexes: indexes.map((row) =>
        Object.assign(row, methods.PgIndexMethods()),
      ),
    }),
    ...(inherits && {
      inherits: inherits.map((row) =>
        Object.assign(row, methods.PgInheritsMethods()),
      ),
    }),
    ...(ranges && {
      ranges: ranges.map((row) => Object.assign(row, methods.PgRangeMethods())),
    }),
    _lookups: lookups,
    _caches: createCaches(options),
    getCurrentUser: () => lookups.roleByName[introspectionData.current_user],
    getNamespace: (by: { id: string } | { name: string }) =>
      "id" in by && by.id
        ? lookups.namespaceById.get(by.id)
        : "name" in by && by.name
          ? lookups.namespaceByName.get(by.name)
          : undefined,
    getClass: (by: { id: string }) => lookups.classById.get(by.id),
    getConstraint: (by: { id: string }) => lookups.constraintById.get(by.id),
    getProc: (by: { id: string }) => lookups.procById.get(by.id),
    getRoles: (by: { id: string }) => lookups.roleById.get(by.id),
    getType: (by: { id: string }) => lookups.typeById.get(by.id),
    getEnum: (by: { id: string }) => lookups.enumById.get(by.id),
    getExtension: (by: { id: string }) => lookups.extensionById.get(by.id),
    getIndex: (by: { id: string }) => lookups.indexById.get(by.id),
    getLanguage: (by: { id: string }) => lookups.languageById.get(by.id),
  } satisfies Introspection<never>;
  // Each selected collection is present in the input and retained above, but
  // TypeScript cannot follow that relationship through generic object spreads.
  result = Object.assign(
    introspectionData,
    augmented,
  ) as Introspection<TEntities>;
  const introspection = result;
  createLookups(introspection, lookups);
  const { oidByCatalog } = lookups;

  if (!includeExtensionResources) {
    // Go through and delete things from the extensions
    const extensionProcOids = new Set<string>();
    const extensionClassOids = new Set<string>();
    if (introspection.depends) {
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
    }

    del(extensionProcOids, introspection.procs, "_id");
    del(extensionClassOids, introspection.classes, "_id");
    del(extensionClassOids, introspection.attributes, "attrelid");
    del(extensionClassOids, introspection.constraints, "conrelid");
    del(extensionClassOids, introspection.constraints, "confrelid");
    del(extensionClassOids, introspection.types, "typrelid");
  }

  return introspection;
}
