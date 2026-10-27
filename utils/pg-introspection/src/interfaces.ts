import type {
  EntityType,
  IntrospectionData,
  PgEntityData,
  PgAmData,
  PgAttributeData,
  PgAuthMembersData,
  PgClassData,
  PgConstraintData,
  PgDatabaseData,
  PgDependData,
  PgDescriptionData,
  PgEnumData,
  PgExtensionData,
  PgIndexData,
  PgInheritsData,
  PgLanguageData,
  PgNamespaceData,
  PgProcData,
  PgRangeData,
  PgRolesData,
  PgTypeData,
} from "./introspection.ts";
import type { defaultEntities } from "./query.ts";
import type { AclObject } from "./acl.ts";
import type {
  PgSmartTagsAndDescription,
  PgSmartTagsDict,
} from "./smartComments.ts";

export type DefaultEntities = (typeof defaultEntities)[number];

export interface IntrospectOptions<
  TEntities extends EntityType = DefaultEntities,
> {
  onlyEntities?: TEntities[];
  schemas?: string[];
  includeExtensionResources?: boolean;
}

export type IntrospectionDataForEntities<
  TEntities extends EntityType = DefaultEntities,
> = Partial<IntrospectionData> &
  Pick<IntrospectionData, TEntities | FixedIntrospectionKeys>;

type FixedIntrospectionKeys =
  | "catalog_by_oid"
  | "current_user"
  | "pg_version"
  | "introspection_version";

export type Introspection<TEntities extends EntityType = DefaultEntities> =
  Partial<AugmentedIntrospectionData> &
    Pick<AugmentedIntrospectionData, TEntities | FixedIntrospectionKeys> & {
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
      getType(by: { id: string }): PgType | undefined;
      getEnum(by: { id: string }): PgEnum | undefined;
      getExtension(by: { id: string }): PgExtension | undefined;
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

export type PgAm = PgAmData;
export type PgAuthMembers = PgAuthMembersData;
export type PgDepend = PgDependData;
export type PgDescription = PgDescriptionData;
export type PgExtension = PgExtensionData;
export type PgLanguage = PgLanguageData;
export type PgRoles = PgRolesData;

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
