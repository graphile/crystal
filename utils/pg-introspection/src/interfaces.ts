import type {
  EntityType,
  IntrospectionData,
  PgAm,
  PgAttribute,
  PgAuthMembers,
  PgClass,
  PgConstraint,
  PgDescription,
  PgEnum,
  PgExtension,
  PgIndex,
  PgLanguage,
  PgNamespace,
  PgProc,
  PgRange,
  PgRoles,
  PgType,
} from "./introspection";
import type { defaultEntities } from "./query";

export type DefaultEntities = (typeof defaultEntities)[number];

export interface IntrospectOptions<
  TEntities extends EntityType = DefaultEntities,
> {
  onlyEntities?: TEntities[];
  schemas?: string[];
  includeExtensionResources?: boolean;
}

// TODO: represent introspection data and augmented introspection separately
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
  IntrospectionDataForEntities<TEntities> & {
    /**
     * Use Record/Map to turn O(N) lookups into O(1) lookups. Populated at
     * startup.
     *
     * @internal
     */
    _lookups: IntrospectionLookups;

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

interface IntrospectionLookups {
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
interface IntrospectionCaches {
  expandRoles: Map<string, PgRoles[]>;
}
