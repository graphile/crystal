import type {
  Introspection,
  PgAttribute,
  PgClass,
  PgConstraint,
  PgEnum,
  PgIndex,
  PgNamespace,
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

/**
 * Adds helpers to the introspection results.
 */
export function augmentIntrospection(
  introspectionResults: unknown,
): Introspection {
  const introspection = introspectionResults as Introspection;

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
      // TODO: do NOT use localeCompare here; it's unstable across different machines
      .sort((a, z) => a.conname.localeCompare(z.conname));
  const getForeignConstraints = (id: string | null): PgConstraint[] =>
    introspection.constraints.filter((entity) => entity.confrelid === id);
  const getEnums = (id: string | null): PgEnum[] =>
    introspection.enums
      .filter((entity) => entity.enumtypid === id)
      .sort((a, z) => a.enumsortorder - z.enumsortorder);
  const getIndexes = (id: string | null): PgIndex[] =>
    introspection.indexes.filter((entity) => entity.indrelid === id);

  const oidByCatalog: { [catalog: string]: string } = {};
  for (const [oid, catalog] of Object.entries(introspection.catalog_by_oid)) {
    oidByCatalog[catalog] = oid;
  }
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
  ): PgSmartTagsAndDescription => {
    const description = getDescription(classoid, objoid, objsubid);
    return parseSmartComment(description);
  };

  introspection.database.getDba = memo(() =>
    getRole(introspection.database.datdba),
  );
  introspection.namespaces.forEach((entity) => {
    entity.getOwner = memo(() => getRole(entity.nspowner));
    entity.getDescription = memo(() =>
      getDescription(PG_NAMESPACE, entity._id),
    );
    entity.getTagsAndDescription = memo(() =>
      getTagsAndDescription(PG_NAMESPACE, entity._id),
    );
  });
  introspection.classes.forEach((entity) => {
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
      getTagsAndDescription(PG_CLASS, entity._id, 0),
    );
  });
  introspection.attributes.forEach((entity) => {
    entity.getClass = memo(() => getClass(entity.attrelid));
    entity.getType = memo(() => getType(entity.atttypid));
    entity.getDescription = memo(() =>
      getDescription(PG_CLASS, entity.attrelid, entity.attnum),
    );
    entity.getTagsAndDescription = memo(() =>
      getTagsAndDescription(PG_CLASS, entity.attrelid, entity.attnum),
    );
  });
  introspection.constraints.forEach((entity) => {
    entity.getNamespace = memo(() => getNamespace(entity.connamespace));
    entity.getClass = memo(() => getClass(entity.conrelid));
    entity.getType = memo(() => getType(entity.contypid));
    entity.getForeignClass = memo(() => getClass(entity.confrelid));
    entity.getDescription = memo(() =>
      getDescription(PG_CONSTRAINT, entity._id),
    );
    entity.getTagsAndDescription = memo(() =>
      getTagsAndDescription(PG_CONSTRAINT, entity._id),
    );
  });
  introspection.procs.forEach((entity) => {
    entity.getNamespace = memo(() => getNamespace(entity.pronamespace));
    entity.getOwner = memo(() => getRole(entity.proowner));
    entity.getReturnType = memo(() => getType(entity.prorettype));
    entity.getDescription = memo(() => getDescription(PG_PROC, entity._id));
    entity.getTagsAndDescription = memo(() =>
      getTagsAndDescription(PG_PROC, entity._id),
    );
  });
  introspection.types.forEach((entity) => {
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
  });
  introspection.enums.forEach((entity) => {
    entity.getType = memo(() => getType(entity.enumtypid));
  });
  introspection.ranges.forEach((entity) => {
    entity.getType = memo(() => getType(entity.rngtypid));
    entity.getSubType = memo(() => getType(entity.rngsubtype));
  });

  return introspection;
}
