import assert from "node:assert";
import { describe, it } from "node:test";

import {
  aclContainsRole,
  expandRoles,
  parseAcl,
  PUBLIC_ROLE,
  resolvePermissions,
} from "../src/acl.ts";
import { augmentIntrospectionParsed } from "../src/augmentIntrospection.ts";
import type {
  Introspection,
  PgAuthMembers,
  PgRoles,
} from "../src/introspection.ts";
import { rawIntrospectionResults } from "./rawIntrospectionResults.mts";

function makeRole(
  _id: string,
  rolname: string,
  opts: Partial<Omit<PgRoles, "_id" | "rolname">> = {},
): PgRoles {
  return {
    ...PUBLIC_ROLE,
    rolinherit: true,
    ...opts,
    _id,
    rolname,
  };
}

function fakeIntrospection(
  roles: PgRoles[],
  authMembers: Pick<PgAuthMembers, "member" | "roleid">[] = [],
): Introspection {
  return augmentIntrospectionParsed({
    ...rawIntrospectionResults,
    roles,
    auth_members: authMembers.map((am) => ({
      ...am,
      admin_option: false,
      grantor: "0",
    })),
  } as Introspection);
}

describe("expandRoles", () => {
  it("always includes PUBLIC_ROLE", () => {
    const role = makeRole("1", "alice");
    const introspection = fakeIntrospection([role]);
    const result = expandRoles(introspection, [role]);
    assert.ok(result.includes(PUBLIC_ROLE));
  });

  it("includes the role itself", () => {
    const role = makeRole("1", "alice");
    const introspection = fakeIntrospection([role]);
    const result = expandRoles(introspection, [role]);
    assert.ok(result.includes(role));
  });

  it("expands inherited roles via auth_members", () => {
    const alice = makeRole("1", "alice");
    const editors = makeRole("2", "editors");
    const introspection = fakeIntrospection(
      [alice, editors],
      [{ member: "1", roleid: "2" }], // alice is member of editors
    );
    const result = expandRoles(introspection, [alice]);
    assert.ok(result.includes(editors));
    assert.ok(result.includes(alice));
    assert.ok(result.includes(PUBLIC_ROLE));
  });

  it("expands transitive role inheritance", () => {
    const alice = makeRole("1", "alice");
    const editors = makeRole("2", "editors");
    const admins = makeRole("3", "admins");
    const introspection = fakeIntrospection(
      [alice, editors, admins],
      [
        { member: "1", roleid: "2" }, // grant editors to alice
        { member: "2", roleid: "3" }, // grant admins to editors
      ],
    );
    const result = expandRoles(introspection, [alice]);
    assert.ok(result.includes(admins));
    assert.ok(result.includes(editors));
    assert.ok(result.includes(alice));
  });

  it("does not expand roles with NOINHERIT by default", () => {
    const alice = makeRole("1", "alice", { rolinherit: false });
    const editors = makeRole("2", "editors");
    const introspection = fakeIntrospection(
      [alice, editors],
      [{ member: "1", roleid: "2" }],
    );
    const result = expandRoles(introspection, [alice]);
    // alice has NOINHERIT, so editors should NOT be included
    assert.ok(!result.includes(editors));
    assert.ok(result.includes(alice));
  });

  it("expands NOINHERIT roles when includeNoInherit=true", () => {
    const alice = makeRole("1", "alice", { rolinherit: false });
    const editors = makeRole("2", "editors");
    const introspection = fakeIntrospection(
      [alice, editors],
      [{ member: "1", roleid: "2" }],
    );
    const result = expandRoles(introspection, [alice], true);
    assert.ok(result.includes(editors));
  });

  it("returns cached result for repeated calls", () => {
    const alice = makeRole("1", "alice");
    const editors = makeRole("2", "editors");
    const introspection = fakeIntrospection(
      [alice, editors],
      [{ member: "1", roleid: "2" }],
    );
    const result1 = expandRoles(introspection, [alice]);
    const result2 = expandRoles(introspection, [alice]);
    assert.strictEqual(result1, result2); // same reference = cached
  });

  // NOTE: Postgres currently forbids circular permissions so we should never
  // see this in introspection, but lets guard against it anyway.
  it("handles circular role membership without infinite loop", () => {
    const a = makeRole("1", "a");
    const b = makeRole("2", "b");
    const introspection = fakeIntrospection(
      [a, b],
      [
        { member: "1", roleid: "2" },
        { member: "2", roleid: "1" },
      ],
    );
    const result = expandRoles(introspection, [a]);
    assert.ok(result.includes(a));
    assert.ok(result.includes(b));
  });
});

describe("aclContainsRole", () => {
  it("returns true when role matches ACL directly", () => {
    const alice = makeRole("1", "alice");
    const introspection = fakeIntrospection([alice]);
    const acl = parseAcl("alice=r/postgres");
    assert.ok(aclContainsRole(introspection, acl, alice));
  });

  it("returns true for PUBLIC ACL and any role", () => {
    const alice = makeRole("1", "alice");
    const introspection = fakeIntrospection([alice]);
    const acl = parseAcl("=r/postgres");
    assert.ok(aclContainsRole(introspection, acl, alice));
  });

  it("returns true when role inherits ACL role", () => {
    const alice = makeRole("1", "alice");
    const editors = makeRole("2", "editors");
    const introspection = fakeIntrospection(
      [alice, editors],
      [{ member: "1", roleid: "2" }],
    );
    const acl = parseAcl("editors=rw/postgres");
    assert.ok(aclContainsRole(introspection, acl, alice));
  });

  it("returns false when role does not match", () => {
    const alice = makeRole("1", "alice");
    const bob = makeRole("2", "bob");
    const introspection = fakeIntrospection([alice, bob]);
    const acl = parseAcl("bob=r/postgres");
    assert.ok(!aclContainsRole(introspection, acl, alice));
  });
});

describe("resolvePermissions", () => {
  it("grants permissions from matching ACLs", () => {
    const alice = makeRole("1", "alice");
    const introspection = fakeIntrospection([alice]);
    const acls = [parseAcl("alice=rw/postgres")];
    const perms = resolvePermissions(introspection, acls, alice);
    assert.strictEqual(perms.select, true);
    assert.strictEqual(perms.update, true);
    assert.strictEqual(perms.insert, false);
  });

  it("grants all permissions to superuser", () => {
    const superuser = makeRole("1", "super", { rolsuper: true });
    const introspection = fakeIntrospection([superuser]);
    const perms = resolvePermissions(introspection, [], superuser);
    assert.strictEqual(perms.select, true);
    assert.strictEqual(perms.insert, true);
    assert.strictEqual(perms.delete, true);
  });
});
