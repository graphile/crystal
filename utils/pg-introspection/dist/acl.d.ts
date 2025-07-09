import type { Introspection, PgEntity, PgRoles } from "./introspection.js";
/**
 * A fake 'pg_roles' record representing the 'public' meta-role.
 */
export declare const PUBLIC_ROLE: PgRoles;
/**
 * Represents a single ACL entry in an ACL string, such as
 * `foo=arwdDxt/bar`
 */
export interface AclObject {
    /** Who are these permissions granted to? */
    role: string;
    /** Who granted these permissions? */
    granter: string;
    /** r */
    select?: boolean;
    /** r* */
    selectGrant?: boolean;
    /** w */
    update?: boolean;
    /** w* */
    updateGrant?: boolean;
    /** a */
    insert?: boolean;
    /** a* */
    insertGrant?: boolean;
    /** d */
    delete?: boolean;
    /** d* */
    deleteGrant?: boolean;
    /** D */
    truncate?: boolean;
    /** D* */
    truncateGrant?: boolean;
    /** x */
    references?: boolean;
    /** x* */
    referencesGrant?: boolean;
    /** t */
    trigger?: boolean;
    /** t* */
    triggerGrant?: boolean;
    /** X */
    execute?: boolean;
    /** X* */
    executeGrant?: boolean;
    /** U */
    usage?: boolean;
    /** U* */
    usageGrant?: boolean;
    /** C */
    create?: boolean;
    /** C* */
    createGrant?: boolean;
    /** c */
    connect?: boolean;
    /** c* */
    connectGrant?: boolean;
    /** T */
    temporary?: boolean;
    /** T* */
    temporaryGrant?: boolean;
    /** m */
    maintain?: boolean;
    /** m* */
    maintainGrant?: boolean;
}
export type ResolvedPermissions = Omit<AclObject, "role" | "granter">;
/**
 * Accepts an ACL string such as `foo=arwdDxt/bar` and converts it into
 * a parsed AclObject.
 */
export declare function parseAcl(aclString: string): AclObject;
/**
 * Takes an `AclObject` and converts it back into a Postgres ACL string such as
 * `foo=arwdDxt/bar`
 */
export declare function serializeAcl(acl: AclObject): string;
export declare const emptyAclObject: AclObject;
export declare const OBJECT_COLUMN = "OBJECT_COLUMN";
export declare const OBJECT_TABLE = "OBJECT_TABLE";
export declare const OBJECT_SEQUENCE = "OBJECT_SEQUENCE";
export declare const OBJECT_DATABASE = "OBJECT_DATABASE";
export declare const OBJECT_FUNCTION = "OBJECT_FUNCTION";
export declare const OBJECT_LANGUAGE = "OBJECT_LANGUAGE";
export declare const OBJECT_LARGEOBJECT = "OBJECT_LARGEOBJECT";
export declare const OBJECT_SCHEMA = "OBJECT_SCHEMA";
export declare const OBJECT_TABLESPACE = "OBJECT_TABLESPACE";
export declare const OBJECT_FDW = "OBJECT_FDW";
export declare const OBJECT_FOREIGN_SERVER = "OBJECT_FOREIGN_SERVER";
export declare const OBJECT_DOMAIN = "OBJECT_DOMAIN";
export declare const OBJECT_TYPE = "OBJECT_TYPE";
export type AclDefaultObjectType = typeof OBJECT_COLUMN | typeof OBJECT_TABLE | typeof OBJECT_SEQUENCE | typeof OBJECT_DATABASE | typeof OBJECT_FUNCTION | typeof OBJECT_LANGUAGE | typeof OBJECT_LARGEOBJECT | typeof OBJECT_SCHEMA | typeof OBJECT_TABLESPACE | typeof OBJECT_FDW | typeof OBJECT_FOREIGN_SERVER | typeof OBJECT_DOMAIN | typeof OBJECT_TYPE;
/**
 * Returns a list of AclObject by parsing the given input ACL strings. If no
 * ACL strings are present then it will return the default (implied) ACL for
 * the given `type` of entity owned by `ownerId`.
 *
 * See:
 *
 * https://github.com/postgres/postgres/blob/14aec03502302eff6c67981d8fd121175c436ce9/src/backend/utils/adt/acl.c#L748-L854
 *
 * and:
 *
 * https://github.com/postgres/postgres/blob/fb3b098fe88441f9531a5169008ea17eac01301f/src/include/utils/acl.h#L153-L167
 */
export declare function parseAcls(introspection: Introspection, inAcls: readonly string[] | null, ownerId: string, objtype: AclDefaultObjectType): AclObject[];
export declare const Permission: {
    readonly select: "select";
    readonly selectGrant: "selectGrant";
    readonly update: "update";
    readonly updateGrant: "updateGrant";
    readonly insert: "insert";
    readonly insertGrant: "insertGrant";
    readonly delete: "delete";
    readonly deleteGrant: "deleteGrant";
    readonly truncate: "truncate";
    readonly truncateGrant: "truncateGrant";
    readonly references: "references";
    readonly referencesGrant: "referencesGrant";
    readonly trigger: "trigger";
    readonly triggerGrant: "triggerGrant";
    readonly execute: "execute";
    readonly executeGrant: "executeGrant";
    readonly usage: "usage";
    readonly usageGrant: "usageGrant";
    readonly create: "create";
    readonly createGrant: "createGrant";
    readonly connect: "connect";
    readonly connectGrant: "connectGrant";
    readonly temporary: "temporary";
    readonly temporaryGrant: "temporaryGrant";
    readonly maintain: "maintain";
    readonly maintainGrant: "maintainGrant";
};
/**
 * Returns all the roles role has been granted (including PUBLIC),
 * respecting `NOINHERIT`
 */
export declare function expandRoles(introspection: Introspection, roles: PgRoles[], includeNoInherit?: boolean): PgRoles[];
/**
 * Returns true if ACL was applied to this role, or a role that this role
 * inherits from (including public).
 *
 * i.e. does this ACL grant privileges to this role (directly or indirectly)?
 *
 * In Venn diagram terms, it asks if the 'role' is contained within (or equal to)
 * the acl.role.
 */
export declare function aclContainsRole(introspection: Introspection, acl: AclObject, role: PgRoles, includeNoInherit?: boolean): boolean;
/**
 * Filters the ACL objects to only those that apply to `role`, then calculates
 * the `OR` of all the permissions to see what permissions the role has.
 */
export declare function resolvePermissions(introspection: Introspection, acls: AclObject[], role: PgRoles, includeNoInherit?: boolean, isOwnerAndHasNoExplicitACLs?: boolean): ResolvedPermissions;
export declare function entityPermissions(introspection: Introspection, entity: Extract<PgEntity, {
    getACL(): readonly AclObject[];
}>, role: PgRoles, includeNoInherit?: boolean): ResolvedPermissions;
//# sourceMappingURL=acl.d.ts.map