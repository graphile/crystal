"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permission = exports.OBJECT_TYPE = exports.OBJECT_DOMAIN = exports.OBJECT_FOREIGN_SERVER = exports.OBJECT_FDW = exports.OBJECT_TABLESPACE = exports.OBJECT_SCHEMA = exports.OBJECT_LARGEOBJECT = exports.OBJECT_LANGUAGE = exports.OBJECT_FUNCTION = exports.OBJECT_DATABASE = exports.OBJECT_SEQUENCE = exports.OBJECT_TABLE = exports.OBJECT_COLUMN = exports.emptyAclObject = exports.PUBLIC_ROLE = void 0;
exports.parseAcl = parseAcl;
exports.serializeAcl = serializeAcl;
exports.parseAcls = parseAcls;
exports.expandRoles = expandRoles;
exports.aclContainsRole = aclContainsRole;
exports.resolvePermissions = resolvePermissions;
exports.entityPermissions = entityPermissions;
/**
 * A fake 'pg_roles' record representing the 'public' meta-role.
 */
exports.PUBLIC_ROLE = Object.freeze({
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
function getRole(introspection, oid) {
    if (oid === "0") {
        return exports.PUBLIC_ROLE;
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
function getRoleByName(introspection, name) {
    if (name === "public") {
        return exports.PUBLIC_ROLE;
    }
    const role = introspection.roles.find((r) => r.rolname === name);
    if (!role) {
        throw new Error(`Could not find role with name '${name}'`);
    }
    return role;
}
/**
 * Parses a role identifier from an ACL string.
 *
 * 'foo' becomes 'foo'
 * '"foo""mcbrew"' becomes 'foo"mcbrew'
 */
const parseIdentifier = (str) => str.startsWith('"') ? str.replace(/"("?)/g, "$1") : str;
/**
 * Accepts an ACL string such as `foo=arwdDxt/bar` and converts it into
 * a parsed AclObject.
 */
function parseAcl(aclString) {
    // https://www.postgresql.org/docs/current/ddl-priv.html#PRIVILEGE-ABBREVS-TABLE
    const matches = aclString.match(/^([^=]*)=([rwadDxtXUCcTm*]*)\/([^=]+)$/);
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
    const maintain = permissions.includes("m");
    const maintainGrant = permissions.includes("m*");
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
        maintain,
        maintainGrant,
    };
    return acl;
}
/**
 * Takes an `AclObject` and converts it back into a Postgres ACL string such as
 * `foo=arwdDxt/bar`
 */
function serializeAcl(acl) {
    let permissions = (acl.role === "public" ? "" : acl.role) + "=";
    if (acl.selectGrant)
        permissions += "r*";
    else if (acl.select)
        permissions += "r";
    if (acl.updateGrant)
        permissions += "w*";
    else if (acl.update)
        permissions += "w";
    if (acl.insertGrant)
        permissions += "a*";
    else if (acl.insert)
        permissions += "a";
    if (acl.deleteGrant)
        permissions += "d*";
    else if (acl.delete)
        permissions += "d";
    if (acl.truncateGrant)
        permissions += "D*";
    else if (acl.truncate)
        permissions += "D";
    if (acl.referencesGrant)
        permissions += "x*";
    else if (acl.references)
        permissions += "x";
    if (acl.triggerGrant)
        permissions += "t*";
    else if (acl.trigger)
        permissions += "t";
    if (acl.executeGrant)
        permissions += "X*";
    else if (acl.execute)
        permissions += "X";
    if (acl.usageGrant)
        permissions += "U*";
    else if (acl.usage)
        permissions += "U";
    if (acl.createGrant)
        permissions += "C*";
    else if (acl.create)
        permissions += "C";
    if (acl.connectGrant)
        permissions += "c*";
    else if (acl.connect)
        permissions += "c";
    if (acl.temporaryGrant)
        permissions += "T*";
    else if (acl.temporary)
        permissions += "T";
    if (acl.maintainGrant)
        permissions += "m*";
    else if (acl.maintain)
        permissions += "m";
    permissions += `/${acl.granter}`;
    return permissions;
}
exports.emptyAclObject = parseAcl("=/postgres");
exports.OBJECT_COLUMN = "OBJECT_COLUMN";
exports.OBJECT_TABLE = "OBJECT_TABLE";
exports.OBJECT_SEQUENCE = "OBJECT_SEQUENCE";
exports.OBJECT_DATABASE = "OBJECT_DATABASE";
exports.OBJECT_FUNCTION = "OBJECT_FUNCTION";
exports.OBJECT_LANGUAGE = "OBJECT_LANGUAGE";
exports.OBJECT_LARGEOBJECT = "OBJECT_LARGEOBJECT";
exports.OBJECT_SCHEMA = "OBJECT_SCHEMA";
exports.OBJECT_TABLESPACE = "OBJECT_TABLESPACE";
exports.OBJECT_FDW = "OBJECT_FDW";
exports.OBJECT_FOREIGN_SERVER = "OBJECT_FOREIGN_SERVER";
exports.OBJECT_DOMAIN = "OBJECT_DOMAIN";
exports.OBJECT_TYPE = "OBJECT_TYPE";
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
function parseAcls(introspection, inAcls, ownerId, objtype) {
    const aclStrings = inAcls ||
        (() => {
            const owner = getRole(introspection, ownerId);
            let worldDefault;
            let ownerDefault;
            switch (objtype) {
                case exports.OBJECT_COLUMN:
                    worldDefault = ACL_NO_RIGHTS;
                    ownerDefault = ACL_NO_RIGHTS;
                    break;
                case exports.OBJECT_TABLE:
                    worldDefault = ACL_NO_RIGHTS;
                    ownerDefault = ACL_ALL_RIGHTS_RELATION;
                    break;
                case exports.OBJECT_SEQUENCE:
                    worldDefault = ACL_NO_RIGHTS;
                    ownerDefault = ACL_ALL_RIGHTS_SEQUENCE;
                    break;
                case exports.OBJECT_DATABASE:
                    worldDefault = `${ACL_CREATE_TEMP}${ACL_CONNECT}`;
                    ownerDefault = ACL_ALL_RIGHTS_DATABASE;
                    break;
                case exports.OBJECT_FUNCTION:
                    worldDefault = ACL_EXECUTE;
                    ownerDefault = ACL_ALL_RIGHTS_FUNCTION;
                    break;
                case exports.OBJECT_LANGUAGE:
                    worldDefault = ACL_USAGE;
                    ownerDefault = ACL_ALL_RIGHTS_LANGUAGE;
                    break;
                case exports.OBJECT_LARGEOBJECT:
                    worldDefault = ACL_NO_RIGHTS;
                    ownerDefault = ACL_ALL_RIGHTS_LARGEOBJECT;
                    break;
                case exports.OBJECT_SCHEMA:
                    worldDefault = ACL_NO_RIGHTS;
                    ownerDefault = ACL_ALL_RIGHTS_SCHEMA;
                    break;
                case exports.OBJECT_TABLESPACE:
                    worldDefault = ACL_NO_RIGHTS;
                    ownerDefault = ACL_ALL_RIGHTS_TABLESPACE;
                    break;
                case exports.OBJECT_FDW:
                    worldDefault = ACL_NO_RIGHTS;
                    ownerDefault = ACL_ALL_RIGHTS_FDW;
                    break;
                case exports.OBJECT_FOREIGN_SERVER:
                    worldDefault = ACL_NO_RIGHTS;
                    ownerDefault = ACL_ALL_RIGHTS_FOREIGN_SERVER;
                    break;
                case exports.OBJECT_DOMAIN:
                case exports.OBJECT_TYPE:
                    worldDefault = ACL_USAGE;
                    ownerDefault = ACL_ALL_RIGHTS_TYPE;
                    break;
                default:
                    worldDefault = ACL_NO_RIGHTS;
                    ownerDefault = ACL_NO_RIGHTS;
                    break;
            }
            const acl = [];
            if (worldDefault !== ACL_NO_RIGHTS) {
                acl.push(`=${worldDefault}/${owner.rolname}`);
            }
            if (ownerDefault !== ACL_NO_RIGHTS) {
                acl.push(`${owner.rolname}=${ownerDefault}/${owner.rolname}`);
            }
            return acl;
        })();
    const acls = aclStrings.map((aclString) => parseAcl(aclString));
    return acls;
}
// Forewarning: I hate TypeScript enums. Your PR to convert this to a
// TypeScript enum will be rejected.
exports.Permission = {
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
};
/**
 * Returns all the roles role has been granted (including PUBLIC),
 * respecting `NOINHERIT`
 */
function expandRoles(introspection, roles, includeNoInherit = false) {
    const allRoles = [exports.PUBLIC_ROLE];
    const addRole = (member) => {
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
function aclContainsRole(introspection, acl, role, includeNoInherit = false) {
    const aclRole = getRoleByName(introspection, acl.role);
    const expandedRoles = expandRoles(introspection, [role], includeNoInherit);
    return expandedRoles.includes(aclRole);
}
/**
 * Filters the ACL objects to only those that apply to `role`, then calculates
 * the `OR` of all the permissions to see what permissions the role has.
 */
function resolvePermissions(introspection, acls, role, includeNoInherit = false, isOwnerAndHasNoExplicitACLs = false) {
    const expandedRoles = expandRoles(introspection, [role], includeNoInherit);
    const isSuperuser = expandedRoles.some((role) => role.rolsuper);
    // Superusers have all permissions. An owner of an object has all permissions
    // _unless_ there's a specific ACL for that owner. In all other cases, just as
    // in life, you start with nothing...
    const grantAll = isSuperuser || isOwnerAndHasNoExplicitACLs;
    const permissions = {
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
        const appliesToRole = aclContainsRole(introspection, acl, role, includeNoInherit);
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
function entityPermissions(introspection, entity, role, includeNoInherit = false) {
    const acls = entity.getACL();
    const owner = entity._type === "PgAttribute"
        ? entity.getClass()?.getOwner()
        : entity.getOwner();
    // If the role is the owner, and no explicit ACLs have been granted to this role, then the owner has all privileges.
    const isOwnerAndHasNoExplicitACLs = owner &&
        owner === role &&
        !acls.some((acl) => acl.role === owner.rolname) &&
        (entity._type !== "PgAttribute" ||
            !entity
                .getClass()
                ?.getACL()
                .some((acl) => acl.role === owner.rolname));
    return resolvePermissions(introspection, acls, role, includeNoInherit, isOwnerAndHasNoExplicitACLs);
}
//# sourceMappingURL=acl.js.map