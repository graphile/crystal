import type { AclObject } from "./acl.ts";
import type {
  EntityType,
  IntrospectionData,
  PgAttributeData,
  PgClassData,
  PgConstraintData,
  PgDatabaseData,
  PgEntityData,
  PgEnumData,
  PgIndexData,
  PgInheritsData,
  PgNamespaceData,
  PgProcData,
  PgRangeData,
  PgTypeData,
} from "./introspection.ts";
import type { DESCRIBED_ENTITIES } from "./introspectionConstants.ts";
import type { defaultEntities } from "./query.ts";
import type {
  PgSmartTagsAndDescription,
  PgSmartTagsDict,
} from "./smartComments.ts";

export type DefaultEntities = (typeof defaultEntities)[number];

export type PurposeList = readonly [
  PgIntrospection.Purpose,
  ...PgIntrospection.Purpose[],
];

type IntrospectionRowType = {
  [K in keyof Omit<
    IntrospectionData,
    FixedIntrospectionKeys
  >]: IntrospectionData[K] extends readonly (infer U)[]
    ? U
    : IntrospectionData[K];
};

/** A catalogue row, including rows from singular collections. */
export type IntrospectionRow<TEntity extends EntityType = EntityType> =
  IntrospectionRowType[TEntity];

export type IntrospectionMatch<TEntity extends EntityType> =
  TEntity extends EntityType
    ? Partial<{
        [TColumn in keyof IntrospectionRow<TEntity>]: NonNullable<
          IntrospectionRow<TEntity>[TColumn]
        >;
      }>
    : never;

/** Keep each entity paired with its own selector when entities form a union. */
export type IntrospectionRequest<TEntity extends EntityType = EntityType> =
  TEntity extends EntityType
    ? {
        entity: TEntity;
        match: IntrospectionMatch<TEntity>;
        purposes: PurposeList;
      }
    : never;

export interface IntrospectionPolicyDetails {
  /**
   * Queue a dependency immediately; repeated selectors are merged.
   * Zero selectors for columns that always identify an object are ignored.
   */
  request<TEntity extends EntityType>(
    entity: TEntity,
    match: IntrospectionMatch<NoInfer<TEntity>>,
    purposes: PurposeList,
  ): void;
  /**
   * As `request`, but returns every matching row once they are all known, so
   * the policy can inspect them; every purpose must start with `_`. Until the
   * rows are known it returns `undefined`, and this policy will be selected
   * again for the current row once they have been fetched. Collections that
   * are not selected, and zero selectors, return no rows.
   */
  peek<TEntity extends EntityType>(
    entity: TEntity,
    match: IntrospectionMatch<NoInfer<TEntity>>,
    purposes: PurposeList,
  ): ReadonlyArray<IntrospectionRow<TEntity>> | undefined;
  /**
   * Request the objects with the given identity, such as `app.users` for a
   * class or `app.users.id` for an attribute; pass the parts as an array to
   * avoid quoting. Every procedure overload matches. Namespaces and classes
   * fetched only to resolve the identity get the `_resolveName` purpose, so
   * are hidden unless another purpose needs them.
   */
  requestByName(
    entity: NamedEntity,
    identity: string | readonly string[],
    purposes: PurposeList,
  ): void;
  /**
   * As `requestByName`, but peeks at the named object, so every purpose must
   * start with `_`. Returns the object once it is known, `null` if it does not
   * exist, and `undefined` until then (selecting this policy again once it is
   * known). Procedures are excluded since overloads share a name.
   */
  peekByName<TEntity extends Exclude<NamedEntity, "procs">>(
    entity: TEntity,
    identity: string | readonly string[],
    purposes: PurposeList,
  ): IntrospectionRow<TEntity> | null | undefined;
  /**
   * False results subscribe this policy to run again when the purpose is
   * added. Throws in policies with `entity: null`, which have no row.
   */
  hasPurpose(purpose: PgIntrospection.Purpose): boolean;
  /**
   * The smart tags and description of `row`. Peeks at its descriptions (with
   * the `_smartTags` purpose) like `peek`, returning `undefined` until they
   * have been fetched. The result is shared by every policy for the rest of
   * this introspection run, so a policy's `preview` may merge additional tags
   * into it; every `preview` in a round runs before any `select`, so selects
   * that read the tags see those merges. Selects should not merge tags.
   *
   * Merged tags are ephemeral: they only guide discovery and are discarded
   * when the run ends. Entities in the resulting introspection parse their
   * tags afresh from the database comments, so anything that should affect
   * the schema must also be merged after introspection (as `pgSmartTags`
   * does).
   */
  getTagsAndDescription<TEntity extends TaggedEntity>(
    entity: TEntity,
    row: IntrospectionRow<TEntity>,
  ): PgSmartTagsAndDescription | undefined;
  /** Immutable metadata captured before dependency discovery begins. */
  catalogByOid: Readonly<Record<string, string>>;
}

/** Collections whose rows can be described with `comment on`. */
export type TaggedEntity = (typeof DESCRIBED_ENTITIES)[number] | "attributes";

/** Collections whose objects can be requested by name. */
export type NamedEntity =
  | "namespaces"
  | "classes"
  | "attributes"
  | "procs"
  | "types";

export type Maybe<T> = T | null | undefined;
export type ReadonlyArrayOrDirect<T> = T | readonly T[];

/**
 * Policies must depend only on the row, inspected purposes and fixed configuration.
 * Requests are additive: later purposes cannot retract requests already issued.
 * A policy defines `select`, `preview` or both.
 */
export interface IntrospectionPolicy<
  TEntity extends EntityType | null = EntityType,
> {
  name: string;
  /**
   * The collection whose rows this policy is selected for. With `null`, the
   * policy is selected once at the start with `null` in place of a row (and
   * again once rows it peeked at have been fetched).
   */
  entity: TEntity;
  /**
   * Selected for rows with at least one purpose that does not start with `_`,
   * that is, rows that will be exposed.
   */
  select?: (
    row: PolicyRow<TEntity>,
    details: IntrospectionPolicyDetails,
  ) => void;
  /**
   * Selected for every row, including those fetched only to guide discovery.
   * It may only request and peek with purposes starting with `_`. In each
   * round, every `preview` runs before any `select`.
   */
  preview?: (
    row: PolicyRow<TEntity>,
    details: IntrospectionPolicyDetails,
  ) => void;
}

/** The row a policy receives; `null` for policies with `entity: null`. */
type PolicyRow<TEntity extends EntityType | null> = TEntity extends EntityType
  ? IntrospectionRow<TEntity>
  : null;

/** Infer a policy's row type from its source collection. */
export function defineIntrospectionPolicy<TEntity extends EntityType | null>(
  policy: IntrospectionPolicy<TEntity>,
): IntrospectionPolicy<TEntity> {
  return policy;
}

export interface MultipassOptions {
  onlyAccessible?: { role?: string; includeNoInherit?: boolean };
  policies?: readonly (
    | { [TEntity in EntityType]: IntrospectionPolicy<TEntity> }[EntityType]
    | IntrospectionPolicy<null>
  )[];
  /** Trusted SQL predicates applied only to initial discovery, not dependencies. */
  entrypointFilters?: Partial<Record<EntityType, string>>;
}
export type PruneCallback = (
  data: PrunableIntrospectionData,
  details: IntrospectionPruneDetails,
) => void;

export type SQLVal = string | string[] | null;
export type RunQuery = (
  text: string,
  values?: Array<SQLVal>,
) => Promise<string>;

export interface IntrospectionOptions<
  TEntities extends EntityType = DefaultEntities,
> {
  /** @experimental */
  onlyEntities?: TEntities[];
  /** Additional trusted SQL predicates applied to every query in either mode. */
  filters?: Partial<Record<EntityType, string>>;
  /** Remove or hide raw objects before augmentation, in either mode, until stable. */
  prune?: null | PruneCallback;
  multipass?: false | MultipassOptions;
}

export interface IntrospectOptions<
  TEntities extends EntityType = DefaultEntities,
> extends IntrospectionOptions<TEntities> {
  /** Executes SQL and returns the single result row's `introspection` string. */
  runQuery: RunQuery;
}

/** @internal */
export interface MultipassIntrospectOptions<TEntities extends EntityType>
  extends IntrospectOptions<TEntities> {
  multipass: MultipassOptions;
}

export type CollectionEntity = {
  [T in EntityType]: IntrospectionData[T] extends readonly unknown[]
    ? T
    : never;
}[EntityType];

/** Raw collections, including objects retained solely for navigation. */
export type PrunableIntrospectionData = Partial<IntrospectionData> & {
  hidden?: Partial<Pick<IntrospectionData, CollectionEntity>>;
};

export interface IntrospectionPruneDetails {
  /** Move matching rows out of exposed collections, retaining them for navigation. */
  hide<T extends CollectionEntity>(
    entity: T,
    matches: (row: IntrospectionData[T][number]) => boolean,
  ): void;
}

export type IntrospectionDataForEntities<
  TEntities extends EntityType = DefaultEntities,
> = PrunableIntrospectionData &
  Pick<IntrospectionData, TEntities | FixedIntrospectionKeys> & {
    /** Number of database queries used to obtain this introspection. */
    introspectionPasses?: number;
  };

type FixedIntrospectionKeys =
  | "catalog_by_oid"
  | "current_user"
  | "pg_version"
  | "introspection_version";

export type Introspection<TEntities extends EntityType = DefaultEntities> =
  Partial<AugmentedIntrospectionData> &
    Pick<AugmentedIntrospectionData, TEntities | FixedIntrospectionKeys> & {
      /** Number of database queries used to obtain this introspection. */
      introspectionPasses?: number;
      /**
       * Use Record/Map to turn O(N) lookups into O(1) lookups. Populated at
       * startup.
       *
       * @internal
       */
      _lookups: IntrospectionLookups<TEntities>;

      /**
       * For calculated values that should not be pre-computed (since they may
       * not be needed), add caches here to avoid needing WeakMap.
       *
       * @internal
       */
      _caches: IntrospectionCaches;

      getCurrentUser(): PgRoles | undefined;

      getNamespace(
        by: { id: string } | { name: string },
      ): PgNamespace | undefined;
      getClass(by: { id: string }): PgClass | undefined;
      getConstraint(by: { id: string }): PgConstraint | undefined;
      getProc(by: { id: string }): PgProc | undefined;
      getRoles(by: { id: string }): PgRoles | undefined;
      getType(
        by:
          | { id: string }
          | { schemaName: string; name: string }
          | { arrayId: string },
      ): PgType | undefined;
      getEnum(by: { id: string }): PgEnum | undefined;
      getExtension(
        by: { id: string } | { name: string },
      ): PgExtension | undefined;
      getIndex(by: { id: string }): PgIndex | undefined;
      getLanguage(by: { id: string }): PgLanguage | undefined;
    };

interface AllIntrospectionLookups {
  oidByCatalog: Record<string, string>;
  roleById: Map<string, PgRoles>;
  roleByName: Record<string, PgRoles>;
  authMembersByMemberId: Map<string, Set<PgAuthMembers>>;
  namespaceById: Map<string, PgNamespace>;
  namespaceByName: Map<string, PgNamespace>;
  typeById: Map<string, PgType>;
  typeByNamespaceName: Map<string, PgType>;
  typeByArrayId: Map<string, PgType>;
  classById: Map<string, PgClass>;
  classByNamespaceName: Map<string, PgClass>;
  rangeByTypid: Map<string, PgRange>;
  attributesByRelId: Map<string, PgAttribute[]>;
  attributeByRelIdAndNum: Map<string, PgAttribute>;
  constraintById: Map<string, PgConstraint>;
  constraintsByRelid: Map<string, PgConstraint[]>;
  constraintByNamespaceName: Map<string, PgConstraint>;
  foreignConstraintsByRelid: Map<string, PgConstraint[]>;
  enumById: Map<string, PgEnum>;
  enumsByTypid: Map<string, PgEnum[]>;
  indexById: Map<string, PgIndex>;
  indexesByRelid: Map<string, PgIndex[]>;
  descriptionByDescriptionKey: Map<string, PgDescription>;
  procById: Map<string, PgProc>;
  procsByNamespaceName: Map<string, PgProc[]>;
  extensionById: Map<string, PgExtension>;
  extensionByName: Map<string, PgExtension>;
  languageById: Map<string, PgLanguage>;
  accessMethodById: Map<string, PgAm>;
}
type CheckLookupEntities<
  T extends Record<
    Exclude<keyof AllIntrospectionLookups, "oidByCatalog">,
    EntityType
  >,
> = T;

type LookupEntities = CheckLookupEntities<{
  roleById: "roles";
  roleByName: "roles";
  authMembersByMemberId: "auth_members";
  namespaceById: "namespaces";
  namespaceByName: "namespaces";
  typeById: "types";
  typeByNamespaceName: "types";
  typeByArrayId: "types";
  classById: "classes";
  classByNamespaceName: "classes";
  rangeByTypid: "ranges";
  attributesByRelId: "attributes";
  attributeByRelIdAndNum: "attributes";
  constraintById: "constraints";
  constraintsByRelid: "constraints";
  constraintByNamespaceName: "constraints";
  foreignConstraintsByRelid: "constraints";
  enumById: "enums";
  enumsByTypid: "enums";
  indexById: "indexes";
  indexesByRelid: "indexes";
  descriptionByDescriptionKey: "descriptions";
  procById: "procs";
  procsByNamespaceName: "procs";
  extensionById: "extensions";
  extensionByName: "extensions";
  languageById: "languages";
  accessMethodById: "am";
}>;

type LookupKeysForEntities<TEntities extends EntityType> = {
  [K in keyof LookupEntities]: LookupEntities[K] extends TEntities ? K : never;
}[keyof LookupEntities];

export type IntrospectionLookups<TEntities extends EntityType = never> = Pick<
  AllIntrospectionLookups,
  "oidByCatalog"
> &
  Partial<Omit<AllIntrospectionLookups, "oidByCatalog">> &
  Pick<AllIntrospectionLookups, LookupKeysForEntities<TEntities>>;

interface IntrospectionCaches {
  expandRoles: Map<string, PgRoles[]>;
}

export type PgAm = IntrospectionData["am"][number];
export type PgAuthMembers = IntrospectionData["auth_members"][number];
export type PgDepend = IntrospectionData["depends"][number];
export type PgDescription = IntrospectionData["descriptions"][number];
export type PgExtension = IntrospectionData["extensions"][number];
export type PgLanguage = IntrospectionData["languages"][number];
export type PgRoles = IntrospectionData["roles"][number];

export interface PgProcArgument {
  isIn: boolean;
  isOut: boolean;
  isVariadic: boolean;
  hasDefault: boolean;
  type: PgType;
  name: string | null;
}

export interface PgDatabase extends PgDatabaseData {
  _type: "PgDatabase";
  /** @deprecated Use getOwner instead */
  getDba(): PgRoles | undefined;
  getOwner(): PgRoles | undefined;
  getACL(): AclObject[];
}
export interface PgNamespace extends PgNamespaceData {
  _type: "PgNamespace";
  getOwner(): PgRoles | undefined;
  getDescription(): string | undefined;
  getTagsAndDescription(): PgSmartTagsAndDescription;
  /** Convenience method for getTagsAndDescription().tags */
  getTags(): PgSmartTagsDict;
  getACL(): AclObject[];

  getType(by: { name: string }): PgType | undefined;
  getClass(by: { name: string }): PgClass | undefined;
  getConstraint(by: { name: string }): PgConstraint | undefined;
  getProcs(by: { name: string }): PgProc[] | undefined;
}
export interface PgClass extends PgClassData {
  _type: "PgClass";
  getNamespace(): PgNamespace | undefined;
  getType(): PgType | undefined;
  getOfType(): PgType | undefined;
  getOwner(): PgRoles | undefined;
  getAttributes(): PgAttribute[];
  getAttribute(
    by: { number: number } | { name: string },
  ): PgAttribute | undefined;
  getConstraints(): PgConstraint[];
  getForeignConstraints(): PgConstraint[];
  getIndexes(): PgIndex[];
  getDescription(): string | undefined;
  getTagsAndDescription(): PgSmartTagsAndDescription;
  /** Convenience method for getTagsAndDescription().tags */
  getTags(): PgSmartTagsDict;
  getACL(): AclObject[];
  getInherited(): PgInherits[];
  getAccessMethod(): PgAm | undefined;
}
export interface PgIndex extends PgIndexData {
  _type: "PgIndex";
  /**
   * Get the class that represents this index.
   */
  getIndexClass(): PgClass | undefined;
  /**
   * Get the class (typically table) this index is for.
   */
  getClass(): PgClass | undefined;
  /**
   * The PgAttributes that are in this index; a null indicates that the entry
   * is an expression rather than a column.
   */
  getKeys(): Array<PgAttribute | null>;
  getDescription(): string | undefined;
  getTagsAndDescription(): PgSmartTagsAndDescription;
  /** Convenience method for getTagsAndDescription().tags */
  getTags(): PgSmartTagsDict;
}
export interface PgAttribute extends PgAttributeData {
  _type: "PgAttribute";
  getClass(): PgClass | undefined;
  getType(): PgType | undefined;
  getDescription(): string | undefined;
  getTagsAndDescription(): PgSmartTagsAndDescription;
  /** Convenience method for getTagsAndDescription().tags */
  getTags(): PgSmartTagsDict;
  getACL(): AclObject[];
}
export interface PgConstraint extends PgConstraintData {
  _type: "PgConstraint";
  getNamespace(): PgNamespace | undefined;
  getClass(): PgClass | undefined;
  getAttributes(): PgAttribute[] | undefined;
  getType(): PgType | undefined;
  getForeignClass(): PgClass | undefined;
  getForeignAttributes(): PgAttribute[] | undefined;
  getDescription(): string | undefined;
  getTagsAndDescription(): PgSmartTagsAndDescription;
  /** Convenience method for getTagsAndDescription().tags */
  getTags(): PgSmartTagsDict;
}
export interface PgProc extends PgProcData {
  _type: "PgProc";
  getNamespace(): PgNamespace | undefined;
  getOwner(): PgRoles | undefined;
  getReturnType(): PgType | undefined;
  getDescription(): string | undefined;
  getTagsAndDescription(): PgSmartTagsAndDescription;
  /** Convenience method for getTagsAndDescription().tags */
  getTags(): PgSmartTagsDict;
  getArguments(): PgProcArgument[];
  getACL(): AclObject[];
}
export interface PgType extends PgTypeData {
  _type: "PgType";
  getNamespace(): PgNamespace | undefined;
  getOwner(): PgRoles | undefined;
  getClass(): PgClass | undefined;
  getElemType(): PgType | undefined;
  getArrayType(): PgType | undefined;
  getEnumValues(): PgEnum[] | undefined;
  getRange(): PgRange | undefined;
  getDescription(): string | undefined;
  getTagsAndDescription(): PgSmartTagsAndDescription;
  /** Convenience method for getTagsAndDescription().tags */
  getTags(): PgSmartTagsDict;
}
export interface PgEnum extends PgEnumData {
  _type: "PgEnum";
  getType(): PgType | undefined;
  getTagsAndDescription(): PgSmartTagsAndDescription;
  /** Convenience method for getTagsAndDescription().tags */
  getTags(): PgSmartTagsDict;
}
export interface PgRange extends PgRangeData {
  _type: "PgRange";
  getType(): PgType | undefined;
  getSubType(): PgType | undefined;
}
export interface PgInherits extends PgInheritsData {
  getParent(): PgClass | undefined;
  getChild(): PgClass | undefined;
}

interface AugmentedIntrospectionData
  extends Omit<
    IntrospectionData,
    | "database"
    | "namespaces"
    | "classes"
    | "attributes"
    | "constraints"
    | "procs"
    | "types"
    | "enums"
    | "indexes"
    | "inherits"
    | "ranges"
  > {
  database: PgDatabase;
  namespaces: PgNamespace[];
  classes: PgClass[];
  attributes: PgAttribute[];
  constraints: PgConstraint[];
  procs: PgProc[];
  types: PgType[];
  enums: PgEnum[];
  indexes: PgIndex[];
  inherits: PgInherits[];
  ranges: PgRange[];
}

export type PgEntity =
  | Exclude<
      PgEntityData,
      | PgDatabaseData
      | PgNamespaceData
      | PgClassData
      | PgIndexData
      | PgAttributeData
      | PgConstraintData
      | PgProcData
      | PgTypeData
      | PgEnumData
      | PgRangeData
      | PgInheritsData
    >
  | PgDatabase
  | PgNamespace
  | PgClass
  | PgIndex
  | PgAttribute
  | PgConstraint
  | PgProc
  | PgType
  | PgEnum
  | PgRange
  | PgInherits;
