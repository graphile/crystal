import type { Introspection, PgEntity, PgRoles } from "./introspection.js";

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
const ACL_MAINTAIN = "m";
const ACL_EXECUTE = "X";
const ACL_USAGE = "U";
// const ACL_SET = "s";
// const ACL_ALTER_SYSTEM = "A";

/** @see {@link https://github.com/postgres/postgres/blob/4908c5872059c409aa647bcde758dfeffe07996e/src/include/nodes/parsenodes.h#L91} */
const ACL_NO_RIGHTS = "";

/** @see {@link https://github.com/postgres/postgres/blob/4908c5872059c409aa647bcde758dfeffe07996e/src/include/utils/acl.h#L159} */
const ACL_ALL_RIGHTS_RELATION = `${ACL_INSERT}${ACL_SELECT}${ACL_UPDATE}${ACL_DELETE}${ACL_TRUNCATE}${ACL_REFERENCES}${ACL_TRIGGER}${ACL_MAINTAIN}`;
const ACL_ALL_RIGHTS_SEQUENCE = `${ACL_USAGE}${ACL_SELECT}${ACL_UPDATE}`;
const ACL_ALL_RIGHTS_DATABASE = `${ACL_CREATE}${ACL_CREATE_TEMP}${ACL_CONNECT}`;
const ACL_ALL_RIGHTS_FDW = ACL_USAGE;
const ACL_ALL_RIGHTS_FOREIGN_SERVER = ACL_USAGE;
const ACL_ALL_RIGHTS_FUNCTION = ACL_EXECUTE;
const ACL_ALL_RIGHTS_LANGUAGE = ACL_USAGE;
const ACL_ALL_RIGHTS_LARGEOBJECT = `${ACL_SELECT}${ACL_UPDATE}`;
const ACL_ALL_RIGHTS_SCHEMA = `${ACL_USAGE}${ACL_CREATE}`;
const ACL_ALL_RIGHTS_TABLESPACE = ACL_CREATE;
const ACL_ALL_RIGHTS_TYPE = ACL_USAGE;

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

  /** m */
  maintain?: boolean;
  /** m* */
  maintainGrant?: boolean;
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

// https://www.postgresql.org/docs/current/ddl-priv.html#PRIVILEGE-ABBREVS-TABLE
const ACL_MAP = {
  // Order is significant, do not reorder these keys
  [ACL_SELECT]: "select",
  [ACL_UPDATE]: "update",
  [ACL_INSERT]: "insert",
  [ACL_DELETE]: "delete",
  [ACL_TRUNCATE]: "truncate",
  [ACL_REFERENCES]: "references",
  [ACL_TRIGGER]: "trigger",
  [ACL_EXECUTE]: "execute",
  [ACL_USAGE]: "usage",
  [ACL_CREATE]: "create",
  [ACL_CONNECT]: "connect",
  [ACL_CREATE_TEMP]: "temporary",
  [ACL_MAINTAIN]: "maintain",
} as const;
Object.setPrototypeOf(ACL_MAP, null);
type AclCharacter = keyof typeof ACL_MAP;
const ACL_MAP_ENTRIES = Object.entries(ACL_MAP) as ReadonlyArray<
  { [K in AclCharacter]: [K, (typeof ACL_MAP)[K]] }[AclCharacter]
>;
const NO_PERMISSIONS: AclObject = ACL_MAP_ENTRIES.reduce(
  (acc, [_char, perm]) => {
    acc[perm] = false;
    acc[`${perm}Grant`] = false;
    return acc;
  },
  { role: "public", granter: "" } as Partial<AclObject>,
) as AclObject;

/**
 * Accepts an ACL string such as `foo=arwdDxt/bar` and converts it into
 * a parsed AclObject.
 */
export function parseAcl(aclString: string): AclObject {
  const aclLength = aclString.length;
  if (aclLength < 3) {
    // Shortest ACL string might be e.g. `=/a`
    throw new Error("Invalid ACL string: too few characters");
  }
  const acl: AclObject = { ...NO_PERMISSIONS };
  /** Where the name of the role ends */
  const equalsSignIndex = aclString.indexOf("=");
  if (equalsSignIndex === -1) {
    throw new Error(
      `Could not parse ACL string '${aclString}' - no '=' symbol`,
    );
  } else if (equalsSignIndex > 0) {
    acl.role = parseIdentifier(aclString.substring(0, equalsSignIndex));
  }
  const lastCharacterIndex = aclLength - 1;
  let i = equalsSignIndex; // Start at the "="
  // Process the ACL tokens
  while (++i < aclLength) {
    const char = aclString[i];
    if (char === "/") {
      // granter begins
      // skip past the "/" delimiter
      if (++i === aclLength) {
        throw new Error(`ACL string should have a granter after the /`);
      }
      acl.granter = parseIdentifier(aclString.substring(i));
      // Success!
      return acl;
    }
    const currentPerm = ACL_MAP[char as AclCharacter];
    if (currentPerm === undefined) {
      throw new Error(
        `Could not parse ACL string '${aclString}' - unsupported permission '${char}'`,
      );
    }
    acl[currentPerm] = true;
    if (i < lastCharacterIndex && aclString[i + 1] === "*") {
      // permission + grant
      i++; // skip past the "*" character
      acl[`${currentPerm}Grant`] = true;
    }
  } // end token processing
  throw new Error(
    `Invalid or unsupported ACL string '${aclString}' - no '/' character?`,
  );
}

/**
 * Takes an `AclObject` and converts it back into a Postgres ACL string such as
 * `foo=arwdDxt/bar`
 */
export function serializeAcl(acl: AclObject) {
  let permissions = (acl.role === "public" ? "" : acl.role) + "=";

  for (const [char, perm] of ACL_MAP_ENTRIES) {
    if (acl[`${perm}Grant`]) permissions += char + "*";
    else if (acl[perm]) permissions += char;
  }

  permissions += `/${acl.granter}`;

  return permissions;
}

export const emptyAclObject = parseAcl("=/postgres");

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
  objtype: AclDefaultObjectType,
): AclObject[] {
  const aclStrings: readonly string[] =
    inAcls ||
    (() => {
      const owner = getRole(introspection, ownerId);
      let worldDefault: string;
      let ownerDefault: string;
      switch (objtype) {
        case OBJECT_COLUMN:
          worldDefault = ACL_NO_RIGHTS;
          ownerDefault = ACL_NO_RIGHTS;
          break;
        case OBJECT_TABLE:
          worldDefault = ACL_NO_RIGHTS;
          ownerDefault = ACL_ALL_RIGHTS_RELATION;
          break;
        case OBJECT_SEQUENCE:
          worldDefault = ACL_NO_RIGHTS;
          ownerDefault = ACL_ALL_RIGHTS_SEQUENCE;
          break;
        case OBJECT_DATABASE:
          worldDefault = `${ACL_CREATE_TEMP}${ACL_CONNECT}`;
          ownerDefault = ACL_ALL_RIGHTS_DATABASE;
          break;
        case OBJECT_FUNCTION:
          worldDefault = ACL_EXECUTE;
          ownerDefault = ACL_ALL_RIGHTS_FUNCTION;
          break;
        case OBJECT_LANGUAGE:
          worldDefault = ACL_USAGE;
          ownerDefault = ACL_ALL_RIGHTS_LANGUAGE;
          break;
        case OBJECT_LARGEOBJECT:
          worldDefault = ACL_NO_RIGHTS;
          ownerDefault = ACL_ALL_RIGHTS_LARGEOBJECT;
          break;
        case OBJECT_SCHEMA:
          worldDefault = ACL_NO_RIGHTS;
          ownerDefault = ACL_ALL_RIGHTS_SCHEMA;
          break;
        case OBJECT_TABLESPACE:
          worldDefault = ACL_NO_RIGHTS;
          ownerDefault = ACL_ALL_RIGHTS_TABLESPACE;
          break;
        case OBJECT_FDW:
          worldDefault = ACL_NO_RIGHTS;
          ownerDefault = ACL_ALL_RIGHTS_FDW;
          break;
        case OBJECT_FOREIGN_SERVER:
          worldDefault = ACL_NO_RIGHTS;
          ownerDefault = ACL_ALL_RIGHTS_FOREIGN_SERVER;
          break;
        case OBJECT_DOMAIN:
        case OBJECT_TYPE:
          worldDefault = ACL_USAGE;
          ownerDefault = ACL_ALL_RIGHTS_TYPE;
          break;
        default:
          worldDefault = ACL_NO_RIGHTS;
          ownerDefault = ACL_NO_RIGHTS;
          break;
      }

      const acl: string[] = [];
      if (worldDefault !== ACL_NO_RIGHTS) {
        acl.push(`=${worldDefault}/${owner.rolname}`);
      }
      if (ownerDefault !== ACL_NO_RIGHTS) {
        acl.push(`${owner.rolname}=${ownerDefault}/${owner.rolname}`);
      }
      return acl;
    })();

  const acls = aclStrings.map(parseAcl);
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
  maintain: "maintain",
  maintainGrant: "maintainGrant",
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
    maintain: grantAll,
    maintainGrant: grantAll,
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
      permissions.maintain = permissions.maintain || acl.maintain;
      permissions.maintainGrant =
        permissions.maintainGrant || acl.maintainGrant;
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
