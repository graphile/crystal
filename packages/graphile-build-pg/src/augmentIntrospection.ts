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
} from "./introspection";

declare module "./introspection" {
  interface PgDatabase {
    getDba(): PgRoles | undefined;
  }
  interface PgNamespace {
    getOwner(): PgRoles | undefined;
  }
  interface PgClass {
    getNamespace(): PgNamespace | undefined;
    getType(): PgType | undefined;
    getOfType(): PgType | undefined;
    getOwner(): PgRoles | undefined;
    getAttributes(): PgAttribute[];
    getConstraints(): PgConstraint[];
    getForeignConstraints(): PgConstraint[];
    getIndexes(): PgIndex[];
  }
  interface PgAttribute {
    getClass(): PgClass | undefined;
    getType(): PgType | undefined;
  }
  interface PgConstraint {
    getNamespace(): PgNamespace | undefined;
    getClass(): PgClass | undefined;
    getType(): PgType | undefined;
    getForeignClass(): PgClass | undefined;
  }
  interface PgProc {
    getNamespace(): PgNamespace | undefined;
    getOwner(): PgRoles | undefined;
    getReturnType(): PgType | undefined;
  }
  interface PgType {
    getNamespace(): PgNamespace | undefined;
    getOwner(): PgRoles | undefined;
    getClass(): PgClass | undefined;
    getElemType(): PgType | undefined;
    getArrayType(): PgType | undefined;
    getEnumValues(): PgEnum[] | undefined;
    getRange(): PgRange | undefined;
  }
  interface PgEnum {
    getType(): PgType | undefined;
  }
  interface PgRange {
    getType(): PgType | undefined;
    getSubType(): PgType | undefined;
  }
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

  introspection.database.getDba = () => getRole(introspection.database.datdba);
  introspection.namespaces.forEach((nsp) => {
    nsp.getOwner = () => getRole(nsp.nspowner);
  });
  introspection.classes.forEach((entity) => {
    entity.getNamespace = () => getNamespace(entity.relnamespace);
    entity.getType = () => getType(entity.reltype);
    entity.getOfType = () => getType(entity.reloftype);
    entity.getOwner = () => getRole(entity.relowner);
    entity.getAttributes = () => getAttributes(entity._id);
    entity.getConstraints = () => getConstraints(entity._id);
    entity.getForeignConstraints = () => getForeignConstraints(entity._id);
    entity.getIndexes = () => getIndexes(entity._id);
  });
  introspection.attributes.forEach((entity) => {
    entity.getClass = () => getClass(entity.attrelid);
    entity.getType = () => getType(entity.atttypid);
  });
  introspection.constraints.forEach((entity) => {
    entity.getNamespace = () => getNamespace(entity.connamespace);
    entity.getClass = () => getClass(entity.conrelid);
    entity.getType = () => getType(entity.contypid);
    entity.getForeignClass = () => getClass(entity.confrelid);
  });
  introspection.procs.forEach((entity) => {
    entity.getNamespace = () => getNamespace(entity.pronamespace);
    entity.getOwner = () => getRole(entity.proowner);
    entity.getReturnType = () => getType(entity.prorettype);
  });
  introspection.types.forEach((entity) => {
    entity.getNamespace = () => getNamespace(entity.typnamespace);
    entity.getOwner = () => getRole(entity.typowner);
    entity.getClass = () => getClass(entity.typrelid);
    entity.getElemType = () => getType(entity.typelem);
    entity.getArrayType = () => getType(entity.typarray);
    entity.getEnumValues = () => getEnums(entity._id);
    entity.getRange = () => getRange(entity._id);
  });
  introspection.enums.forEach((entity) => {
    entity.getType = () => getType(entity.enumtypid);
  });
  introspection.ranges.forEach((entity) => {
    entity.getType = () => getType(entity.rngtypid);
    entity.getSubType = () => getType(entity.rngsubtype);
  });

  return introspection;
}
