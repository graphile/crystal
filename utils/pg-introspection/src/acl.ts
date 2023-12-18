import type {
  Introspection,
  PgClass,
  PgEntity,
  PgRoles,
} from "./introspection.js";

/**
 * A fake 'pg_roles' record representing the 'public' meta-role.
 */
export const PUBLIC_ROLE: PgRoles = Object.freeze({
  rolname: "public",
  rolsuper: false,
  rolinherit: false,
  rolcreaterole: false,
  rolcreatedb: false,
  rolcanlogin: false,
  rolreplication: false,
  rolconnlimit: null,
  rolpassword: null,
  rolbypassrls: false,
  rolconfig: null,
  rolvaliduntil: null,
  _id: "0",
});

/**
 * Gets a role given an OID; throws an error if the role is not found.
 */
function getRole(introspection: Introspection, oid: string): PgRoles {
  if (oid === "0") {
    return PUBLIC_ROLE;
  }
  const role = introspection.roles.find((r) => r._id === oid);
  if (!role) {
    throw new Error(`Could not find role with identifier '${oid}'`);
  }
  return role;
}

/**
 * Gets a role given its name; throws an error if the role is not found.
 */
function getRoleByName(introspection: Introspection, name: string): PgRoles {
  if (name === "public") {
    return PUBLIC_ROLE;
  }
  const role = introspection.roles.find((r) => r.rolname === name);
  if (!role) {
    throw new Error(`Could not find role with name '${name}'`);
  }
  return role;
}

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
}

export type ResolvedPermissions = Omit<AclObject, "role" | "granter">;

/**
 * Parses a role identifier from an ACL string.
 *
 * 'foo' becomes 'foo'
 * '"foo""mcbrew"' becomes 'foo"mcbrew'
 */
const parseIdentifier = (str: string): string =>
  str.startsWith('"') ? str.replace(/"("?)/g, "$1") : str;

/**
 * Accepts an ACL string such as `foo=arwdDxt/bar` and converts it into
 * a parsed AclObject.
 */
export function parseAcl(aclString: string): AclObject {
  // https://www.postgresql.org/docs/current/ddl-priv.html#PRIVILEGE-ABBREVS-TABLE

  const matches = aclString.match(/^([^=]*)=([rwadDxtXUCcT*]*)\/([^=]+)$/);

  if (!matches) {
    throw new Error(`Could not parse ACL string '${aclString}'`);
  }

  const [, rawRole, permissions, rawGranter] = matches;
  const role = parseIdentifier(rawRole);
  const granter = parseIdentifier(rawGranter);

  const select = permissions.includes("r");
  const selectGrant = permissions.includes("r*");
  const update = permissions.includes("w");
  const updateGrant = permissions.includes("w*");
  const insert = permissions.includes("a");
  const insertGrant = permissions.includes("a*");
  const del = permissions.includes("d");
  const deleteGrant = permissions.includes("d*");
  const truncate = permissions.includes("D");
  const truncateGrant = permissions.includes("D*");
  const references = permissions.includes("x");
  const referencesGrant = permissions.includes("x*");
  const trigger = permissions.includes("t");
  const triggerGrant = permissions.includes("t*");
  const execute = permissions.includes("X");
  const executeGrant = permissions.includes("X*");
  const usage = permissions.includes("U");
  const usageGrant = permissions.includes("U*");
  const create = permissions.includes("C");
  const createGrant = permissions.includes("C*");
  const connect = permissions.includes("c");
  const connectGrant = permissions.includes("c*");
  const temporary = permissions.includes("T");
  const temporaryGrant = permissions.includes("T*");

  const acl = {
    role: role || "public",
    granter,
    select,
    selectGrant,
    update,
    updateGrant,
    insert,
    insertGrant,
    delete: del,
    deleteGrant,
    truncate,
    truncateGrant,
    references,
    referencesGrant,
    trigger,
    triggerGrant,
    execute,
    executeGrant,
    usage,
    usageGrant,
    create,
    createGrant,
    connect,
    connectGrant,
    temporary,
    temporaryGrant,
  };
  return acl;
}

/**
 * Takes an `AclObject` and converts it back into a Postgres ACL string such as
 * `foo=arwdDxt/bar`
 */
export function serializeAcl(acl: AclObject) {
  let permissions = (acl.role === "public" ? "" : acl.role) + "=";

  if (acl.selectGrant) permissions += "r*";
  else if (acl.select) permissions += "r";

  if (acl.updateGrant) permissions += "w*";
  else if (acl.update) permissions += "w";

  if (acl.insertGrant) permissions += "a*";
  else if (acl.insert) permissions += "a";

  if (acl.deleteGrant) permissions += "d*";
  else if (acl.delete) permissions += "d";

  if (acl.truncateGrant) permissions += "D*";
  else if (acl.truncate) permissions += "D";

  if (acl.referencesGrant) permissions += "x*";
  else if (acl.references) permissions += "x";

  if (acl.triggerGrant) permissions += "t*";
  else if (acl.trigger) permissions += "t";

  if (acl.executeGrant) permissions += "X*";
  else if (acl.execute) permissions += "X";

  if (acl.usageGrant) permissions += "U*";
  else if (acl.usage) permissions += "U";

  if (acl.createGrant) permissions += "C*";
  else if (acl.create) permissions += "C";

  if (acl.connectGrant) permissions += "c*";
  else if (acl.connect) permissions += "c";

  if (acl.temporaryGrant) permissions += "T*";
  else if (acl.temporary) permissions += "T";

  permissions += `/${acl.granter}`;

  return permissions;
}

export const emptyAclObject = parseAcl("=/postgres");

export const OBJECT_COLUMN = "OBJECT_COLUMN";
export const OBJECT_TABLE = "OBJECT_TABLE";
export const OBJECT_SEQUENCE = "OBJECT_SEQUENCE";
export const OBJECT_DATABASE = "OBJECT_DATABASE";
export const OBJECT_FUNCTION = "OBJECT_FUNCTION";
export const OBJECT_LANGUAGE = "OBJECT_LANGUAGE";
export const OBJECT_LARGEOBJECT = "OBJECT_LARGEOBJECT";
export const OBJECT_SCHEMA = "OBJECT_SCHEMA";
export const OBJECT_TABLESPACE = "OBJECT_TABLESPACE";
export const OBJECT_FDW = "OBJECT_FDW";
export const OBJECT_FOREIGN_SERVER = "OBJECT_FOREIGN_SERVER";
export const OBJECT_DOMAIN = "OBJECT_DOMAIN";
export const OBJECT_TYPE = "OBJECT_TYPE";

// https://github.com/postgres/postgres/blob/4908c5872059c409aa647bcde758dfeffe07996e/src/include/nodes/parsenodes.h#L2094-L2148
export type AclDefaultObjectType =
  | typeof OBJECT_COLUMN
  | typeof OBJECT_TABLE
  | typeof OBJECT_SEQUENCE
  | typeof OBJECT_DATABASE
  | typeof OBJECT_FUNCTION
  | typeof OBJECT_LANGUAGE
  | typeof OBJECT_LARGEOBJECT
  | typeof OBJECT_SCHEMA
  | typeof OBJECT_TABLESPACE
  | typeof OBJECT_FDW
  | typeof OBJECT_FOREIGN_SERVER
  | typeof OBJECT_DOMAIN
  | typeof OBJECT_TYPE;

// https://github.com/postgres/postgres/blob/4908c5872059c409aa647bcde758dfeffe07996e/src/include/nodes/parsenodes.h#L76-L89
// https://www.postgresql.org/docs/current/ddl-priv.html#PRIVILEGE-ABBREVS-TABLE
const ACL_SELECT = "r";
const ACL_INSERT = "a";
const ACL_UPDATE = "w";
const ACL_DELETE = "d";
const ACL_TRUNCATE = "D";
const ACL_REFERENCES = "x";
const ACL_TRIGGER = "t";
const ACL_CREATE = "C";
const ACL_CONNECT = "c";
const ACL_CREATE_TEMP = "T";
const ACL_EXECUTE = "X";
const ACL_USAGE = "U";
// const ACL_SET = "s";
// const ACL_ALTER_SYSTEM = "A";

/** @see {@link https://github.com/postgres/postgres/blob/4908c5872059c409aa647bcde758dfeffe07996e/src/include/nodes/parsenodes.h#L91} */
const ACL_NO_RIGHTS = "";

/** @see {@link https://github.com/postgres/postgres/blob/4908c5872059c409aa647bcde758dfeffe07996e/src/include/utils/acl.h#L159} */
const ACL_ALL_RIGHTS_RELATION =
  ACL_INSERT +
  ACL_SELECT +
  ACL_UPDATE +
  ACL_DELETE +
  ACL_TRUNCATE +
  ACL_REFERENCES +
  ACL_TRIGGER;
const ACL_ALL_RIGHTS_SEQUENCE = ACL_USAGE + ACL_SELECT + ACL_UPDATE;
const ACL_ALL_RIGHTS_DATABASE = ACL_CREATE + ACL_CREATE_TEMP + ACL_CONNECT;
const ACL_ALL_RIGHTS_FDW = ACL_USAGE;
const ACL_ALL_RIGHTS_FOREIGN_SERVER = ACL_USAGE;
const ACL_ALL_RIGHTS_FUNCTION = ACL_EXECUTE;
const ACL_ALL_RIGHTS_LANGUAGE = ACL_USAGE;
const ACL_ALL_RIGHTS_LARGEOBJECT = ACL_SELECT + ACL_UPDATE;
const ACL_ALL_RIGHTS_SCHEMA = ACL_USAGE + ACL_CREATE;
const ACL_ALL_RIGHTS_TABLESPACE = ACL_CREATE;
const ACL_ALL_RIGHTS_TYPE = ACL_USAGE;

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
export function parseAcls(
  introspection: Introspection,
  inAcls: readonly string[] | null,
  ownerId: string,
  type: AclDefaultObjectType,
): AclObject[] {
  const aclStrings: readonly string[] =
    inAcls ||
    (() => {
      const owner = getRole(introspection, ownerId);
      switch (type) {
        case OBJECT_COLUMN:
          return [
            `=${ACL_NO_RIGHTS}/${owner.rolname}`,
            `${owner.rolname}=${ACL_NO_RIGHTS}/${owner.rolname}`,
          ];
        case OBJECT_TABLE:
          return [
            `=${ACL_NO_RIGHTS}/${owner.rolname}`,
            `${owner.rolname}=${ACL_ALL_RIGHTS_RELATION}/${owner.rolname}`,
          ];
        case OBJECT_SEQUENCE:
          return [
            `=${ACL_NO_RIGHTS}/${owner.rolname}`,
            `${owner.rolname}=${ACL_ALL_RIGHTS_SEQUENCE}/${owner.rolname}`,
          ];
        case OBJECT_DATABASE:
          return [
            `=${ACL_CREATE_TEMP + ACL_CONNECT}/${owner.rolname}`,
            `${owner.rolname}=${ACL_ALL_RIGHTS_DATABASE}/${owner.rolname}`,
          ];
        case OBJECT_FUNCTION:
          return [
            `=${ACL_EXECUTE}/${owner.rolname}`,
            `${owner.rolname}=${ACL_ALL_RIGHTS_FUNCTION}/${owner.rolname}`,
          ];
        case OBJECT_LANGUAGE:
          return [
            `=${ACL_USAGE}/${owner.rolname}`,
            `${owner.rolname}=${ACL_ALL_RIGHTS_LANGUAGE}/${owner.rolname}`,
          ];
        case OBJECT_LARGEOBJECT:
          return [
            `=${ACL_NO_RIGHTS}/${owner.rolname}`,
            `${owner.rolname}=${ACL_ALL_RIGHTS_LARGEOBJECT}/${owner.rolname}`,
          ];
        case OBJECT_SCHEMA:
          return [
            `=${ACL_NO_RIGHTS}/${owner.rolname}`,
            `${owner.rolname}=${ACL_ALL_RIGHTS_SCHEMA}/${owner.rolname}`,
          ];
        case OBJECT_TABLESPACE:
          return [
            `=${ACL_NO_RIGHTS}/${owner.rolname}`,
            `${owner.rolname}=${ACL_ALL_RIGHTS_TABLESPACE}/${owner.rolname}`,
          ];
        case OBJECT_FDW:
          return [
            `=${ACL_NO_RIGHTS}/${owner.rolname}`,
            `${owner.rolname}=${ACL_ALL_RIGHTS_FDW}/${owner.rolname}`,
          ];
        case OBJECT_FOREIGN_SERVER:
          return [
            `=${ACL_NO_RIGHTS}/${owner.rolname}`,
            `${owner.rolname}=${ACL_ALL_RIGHTS_FOREIGN_SERVER}/${owner.rolname}`,
          ];
        case OBJECT_DOMAIN:
        case OBJECT_TYPE:
          return [
            `=${ACL_USAGE}/${owner.rolname}`,
            `${owner.rolname}=${ACL_ALL_RIGHTS_TYPE}/${owner.rolname}`,
          ];
        default:
          return [];
      }
    })();

  const acls = aclStrings.map((aclString) => parseAcl(aclString));
  return acls;
}

// Forewarning: I hate TypeScript enums. Your PR to convert this to a
// TypeScript enum will be rejected.
export const Permission = {
  select: "select",
  selectGrant: "selectGrant",
  update: "update",
  updateGrant: "updateGrant",
  insert: "insert",
  insertGrant: "insertGrant",
  delete: "delete",
  deleteGrant: "deleteGrant",
  truncate: "truncate",
  truncateGrant: "truncateGrant",
  references: "references",
  referencesGrant: "referencesGrant",
  trigger: "trigger",
  triggerGrant: "triggerGrant",
  execute: "execute",
  executeGrant: "executeGrant",
  usage: "usage",
  usageGrant: "usageGrant",
  create: "create",
  createGrant: "createGrant",
  connect: "connect",
  connectGrant: "connectGrant",
  temporary: "temporary",
  temporaryGrant: "temporaryGrant",
} as const;

/**
 * Returns all the roles role has been granted (including PUBLIC),
 * respecting `NOINHERIT`
 */
export function expandRoles(
  introspection: Introspection,
  roles: PgRoles[],
  includeNoInherit = false,
): PgRoles[] {
  const allRoles = [PUBLIC_ROLE];

  const addRole = (member: PgRoles) => {
    if (!allRoles.includes(member)) {
      allRoles.push(member);
      if (includeNoInherit || member.rolinherit !== false) {
        introspection.auth_members.forEach((am) => {
          // auth_members - role `am.member` gains the privileges of
          // `am.roleid`

          if (am.member === member._id) {
            const rol = getRole(introspection, am.roleid);
            addRole(rol);
          }
        });
      }
    }
  };

  roles.forEach(addRole);

  return allRoles;
}

/**
 * Returns true if ACL was applied to this role, or a role that this role
 * inherits from (including public).
 *
 * i.e. does this ACL grant privileges to this role (directly or indirectly)?
 *
 * In Venn diagram terms, it asks if the 'role' is contained within (or equal to)
 * the acl.role.
 */
export function aclContainsRole(
  introspection: Introspection,
  acl: AclObject,
  role: PgRoles,
  includeNoInherit = false,
): boolean {
  const aclRole = getRoleByName(introspection, acl.role);
  const expandedRoles = expandRoles(introspection, [role], includeNoInherit);
  return expandedRoles.includes(aclRole);
}

/**
 * Filters the ACL objects to only those that apply to `role`, then calculates
 * the `OR` of all the permissions to see what permissions the role has.
 */
export function resolvePermissions(
  introspection: Introspection,
  acls: AclObject[],
  role: PgRoles,
  includeNoInherit = false,
  isOwnerAndHasNoExplicitACLs = false,
): ResolvedPermissions {
  const expandedRoles = expandRoles(introspection, [role], includeNoInherit);
  const isSuperuser = expandedRoles.some((role) => role.rolsuper);

  // Superusers have all permissions. An owner of an object has all permissions
  // _unless_ there's a specific ACL for that owner. In all other cases, just as
  // in life, you start with nothing...
  const grantAll = isSuperuser || isOwnerAndHasNoExplicitACLs;
  const permissions: ResolvedPermissions = {
    select: grantAll,
    selectGrant: grantAll,
    update: grantAll,
    updateGrant: grantAll,
    insert: grantAll,
    insertGrant: grantAll,
    delete: grantAll,
    deleteGrant: grantAll,
    truncate: grantAll,
    truncateGrant: grantAll,
    references: grantAll,
    referencesGrant: grantAll,
    trigger: grantAll,
    triggerGrant: grantAll,
    execute: grantAll,
    executeGrant: grantAll,
    usage: grantAll,
    usageGrant: grantAll,
    create: grantAll,
    createGrant: grantAll,
    connect: grantAll,
    connectGrant: grantAll,
    temporary: grantAll,
    temporaryGrant: grantAll,
  };

  if (grantAll) {
    return permissions;
  }

  for (const acl of acls) {
    const appliesToRole = aclContainsRole(
      introspection,
      acl,
      role,
      includeNoInherit,
    );
    if (appliesToRole) {
      permissions.select = permissions.select || acl.select;
      permissions.selectGrant = permissions.selectGrant || acl.selectGrant;
      permissions.update = permissions.update || acl.update;
      permissions.updateGrant = permissions.updateGrant || acl.updateGrant;
      permissions.insert = permissions.insert || acl.insert;
      permissions.insertGrant = permissions.insertGrant || acl.insertGrant;
      permissions.delete = permissions.delete || acl.delete;
      permissions.deleteGrant = permissions.deleteGrant || acl.deleteGrant;
      permissions.truncate = permissions.truncate || acl.truncate;
      permissions.truncateGrant =
        permissions.truncateGrant || acl.truncateGrant;
      permissions.references = permissions.references || acl.references;
      permissions.referencesGrant =
        permissions.referencesGrant || acl.referencesGrant;
      permissions.trigger = permissions.trigger || acl.trigger;
      permissions.triggerGrant = permissions.triggerGrant || acl.triggerGrant;
      permissions.execute = permissions.execute || acl.execute;
      permissions.executeGrant = permissions.executeGrant || acl.executeGrant;
      permissions.usage = permissions.usage || acl.usage;
      permissions.usageGrant = permissions.usageGrant || acl.usageGrant;
      permissions.create = permissions.create || acl.create;
      permissions.createGrant = permissions.createGrant || acl.createGrant;
      permissions.connect = permissions.connect || acl.connect;
      permissions.connectGrant = permissions.connectGrant || acl.connectGrant;
      permissions.temporary = permissions.temporary || acl.temporary;
      permissions.temporaryGrant =
        permissions.temporaryGrant || acl.temporaryGrant;
    }
  }

  return permissions;
}
export function entityPermissions(
  introspection: Introspection,
  entity: Extract<PgEntity, { getACL(): readonly AclObject[] }>,
  role: PgRoles,
  includeNoInherit = false,
) {
  const acls = entity.getACL();
  const owner =
    entity._type === "PgAttribute"
      ? entity.getClass()?.getOwner()
      : entity.getOwner();
  // If the role is the owner, and no explicit ACLs have been granted to this role, then the owner has all privileges.
  const isOwnerAndHasNoExplicitACLs =
    owner &&
    owner === role &&
    !acls.some((acl) => acl.role === owner.rolname) &&
    (entity._type !== "PgAttribute" ||
      !entity
        .getClass()
        ?.getACL()
        .some((acl) => acl.role === owner.rolname));
  return resolvePermissions(
    introspection,
    acls,
    role,
    includeNoInherit,
    isOwnerAndHasNoExplicitACLs,
  );
}
