import {
  OBJECT_COLUMN,
  OBJECT_DATABASE,
  OBJECT_FUNCTION,
  OBJECT_SCHEMA,
  OBJECT_SEQUENCE,
  OBJECT_TABLE,
  parseAcls,
} from "./acl.js";
import type {
  Introspection,
  PgAttribute,
  PgClass,
  PgConstraint,
  PgEnum,
  PgIndex,
  PgNamespace,
  PgProcArgument,
  PgRange,
  PgRoles,
  PgType,
} from "./introspection.js";
import type { PgSmartTagsAndDescription } from "./smartComments.js";
import { parseSmartComment } from "./smartComments.js";

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
    if (toDelete.has(entry[attr])) {
      collection.splice(i, 1);
    }
  }
}

/**
 * Adds helpers to the introspection results.
 */
export function augmentIntrospection(
  introspectionResultsString: string,
  includeExtensionResources = false,
): Introspection {
  const introspectionResults = JSON.parse(introspectionResultsString);
  const introspection = introspectionResults as Introspection;

  const oidByCatalog: { [catalog: string]: string } = Object.create(null);
  for (const [oid, catalog] of Object.entries(introspection.catalog_by_oid)) {
    oidByCatalog[catalog] = oid;
  }

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
    introspection.roles.find((entity) => entity._id === id);
  const getNamespace = (id: string | null): PgNamespace | undefined =>
    introspection.namespaces.find((entity) => entity._id === id);
  const getType = (id: string | null): PgType | undefined =>
    introspection.types.find((entity) => entity._id === id);
  const getClass = (id: string | null): PgClass | undefined =>
    introspection.classes.find((entity) => entity._id === id);
  const getRange = (id: string | null): PgRange | undefined =>
    introspection.ranges.find((entity) => entity.rngtypid === id);
  const getAttributes = (id: string | null): PgAttribute[] =>
    introspection.attributes
      .filter((entity) => entity.attrelid === id)
      .sort((a, z) => a.attnum - z.attnum);
  const getConstraints = (id: string | null): PgConstraint[] =>
    introspection.constraints
      .filter((entity) => entity.conrelid === id)
      .sort((a, z) => a.conname.localeCompare(z.conname, "en-US"));
  const getForeignConstraints = (id: string | null): PgConstraint[] =>
    introspection.constraints.filter((entity) => entity.confrelid === id);
  const getEnums = (id: string | null): PgEnum[] =>
    introspection.enums
      .filter((entity) => entity.enumtypid === id)
      .sort((a, z) => a.enumsortorder - z.enumsortorder);
  const getIndexes = (id: string | null): PgIndex[] =>
    introspection.indexes.filter((entity) => entity.indrelid === id);

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
    objsubid?: number,
  ): string | undefined =>
    objsubid == null
      ? introspection.descriptions.find(
          (d) => d.classoid === classoid && d.objoid === objoid,
        )?.description ?? undefined
      : introspection.descriptions.find(
          (d) =>
            d.classoid === classoid &&
            d.objoid === objoid &&
            d.objsubid === objsubid,
        )?.description ?? undefined;

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

  introspection.getCurrentUser = memo(() =>
    introspection.roles.find((r) => r.rolname === introspection.current_user),
  );

  introspection.getNamespace = (by) => {
    if ("id" in by && by.id) {
      return getNamespace(by.id);
    } else if ("name" in by && by.name) {
      return introspection.namespaces.find(
        (entity) => entity.nspname === by.name,
      );
    }
  };
  introspection.getClass = (by) => getClass(by.id);
  introspection.getConstraint = (by) =>
    introspection.constraints.find((c) => c._id === by.id);
  introspection.getProc = (by) =>
    introspection.procs.find((c) => c._id === by.id);
  introspection.getRoles = (by) =>
    introspection.roles.find((c) => c._id === by.id);
  introspection.getType = (by) =>
    introspection.types.find((c) => c._id === by.id);
  introspection.getEnum = (by) =>
    introspection.enums.find((c) => c._id === by.id);
  introspection.getExtension = (by) =>
    introspection.extensions.find((c) => c._id === by.id);
  introspection.getIndex = (by) =>
    introspection.indexes.find((c) => c.indexrelid === by.id);
  introspection.getLanguage = (by) =>
    introspection.languages.find((c) => c._id === by.id);

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
      introspection.classes.find(
        (child) =>
          child.relnamespace === entity._id && child.relname === by.name,
      );
    entity.getConstraint = (by) =>
      introspection.constraints.find(
        (child) =>
          child.connamespace === entity._id && child.conname === by.name,
      );
    entity.getProcs = (by) => {
      return introspection.procs.filter(
        (child) =>
          child.pronamespace === entity._id && child.proname === by.name,
      );
    };
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
      entity.relam != null
        ? introspection.am.find((am) => am._id === entity.relam)
        : undefined,
    );
  });
  introspection.indexes.forEach((entity) => {
    entity._type = "PgIndex";
    entity.getIndexClass = memo(() => getClass(entity.indexrelid));
    entity.getClass = memo(() => getClass(entity.indrelid));
    entity.getKeys = memo(() => {
      const owner = getClass(entity.indrelid);
      const attrs = owner!.getAttributes();
      const keys = entity.indkey;
      return keys.map((key) =>
        key === 0 ? null : attrs.find((a) => a.attnum === key)!,
      );
    });
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
      const attrs = klass.getAttributes();
      return entity.conkey.map(
        (key) => attrs.find((att) => att.attnum === key)!,
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
      const attrs = klass.getAttributes();
      return entity.confkey.map(
        (key) => attrs.find((att) => att.attnum === key)!,
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
          const type = introspection.types.find((t) => t._id === typeId);
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
          const type = introspection.types.find((t) => t._id === typeId);
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

  return introspection;
}
