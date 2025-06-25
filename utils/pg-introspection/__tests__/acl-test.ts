import assert from "node:assert";
import { describe, it } from "node:test";

import { type AclObject, parseAcl, serializeAcl } from "../dist/acl.js";

const allBase = {
  select: true,
  update: true,
  insert: true,
  delete: true,
  truncate: true,
  references: true,
  trigger: true,
  execute: true,
  usage: true,
  create: true,
  connect: true,
  temporary: true,
  maintain: true,
} satisfies Partial<AclObject>;
const allGrants = {
  selectGrant: true,
  updateGrant: true,
  insertGrant: true,
  deleteGrant: true,
  truncateGrant: true,
  referencesGrant: true,
  triggerGrant: true,
  executeGrant: true,
  usageGrant: true,
  createGrant: true,
  connectGrant: true,
  temporaryGrant: true,
  maintainGrant: true,
} satisfies Partial<AclObject>;

const baseAcl: AclObject = {
  role: "public",
  granter: "",
  select: false,
  selectGrant: false,
  update: false,
  updateGrant: false,
  insert: false,
  insertGrant: false,
  delete: false,
  deleteGrant: false,
  truncate: false,
  truncateGrant: false,
  references: false,
  referencesGrant: false,
  trigger: false,
  triggerGrant: false,
  execute: false,
  executeGrant: false,
  usage: false,
  usageGrant: false,
  create: false,
  createGrant: false,
  connect: false,
  connectGrant: false,
  temporary: false,
  temporaryGrant: false,
  maintain: false,
  maintainGrant: false,
};

describe("successful ACL parsing", () => {
  it("parses tiny acl", () => {
    assert.deepEqual(parseAcl("=/a"), {
      ...baseAcl,
      granter: "a",
      role: "public",
    } as AclObject);
  });
  it("parses tiny acl with role", () => {
    assert.deepEqual(parseAcl("b=/a"), {
      ...baseAcl,
      granter: "a",
      role: "b",
    } as AclObject);
  });
  it("parses massive acl", () => {
    assert.deepEqual(parseAcl("=arwdDxtXUCTcm/a"), {
      ...baseAcl,
      ...allBase,
      granter: "a",
      role: "public",
    } as AclObject);
  });
  it("parses massive acl with role", () => {
    assert.deepEqual(parseAcl("b=arwdDxtXUCTcm/a"), {
      ...baseAcl,
      ...allBase,
      granter: "a",
      role: "b",
    } as AclObject);
  });
  it("parses massive acl with grants", () => {
    assert.deepEqual(parseAcl("=a*r*w*d*D*x*t*X*U*C*T*c*m*/a"), {
      ...baseAcl,
      ...allBase,
      ...allGrants,
      granter: "a",
      role: "public",
    } as AclObject);
  });
  it("parses massive acl with grants and role", () => {
    assert.deepEqual(parseAcl("b=a*r*w*d*D*x*t*X*U*C*T*c*m*/a"), {
      ...baseAcl,
      ...allBase,
      ...allGrants,
      granter: "a",
      role: "b",
    } as AclObject);
  });
  it("parses mixed acl", () => {
    assert.deepEqual(parseAcl("=r*wd/a"), {
      ...baseAcl,
      select: true,
      selectGrant: true,
      update: true,
      delete: true,
      granter: "a",
      role: "public",
    });
  });
  it("accepts granter with special characters", () => {
    assert.deepEqual(parseAcl('b=r/"a.b@example.com"'), {
      ...baseAcl,
      select: true,
      granter: "a.b@example.com",
      role: "b",
    });
  });
});

describe("broken ACL handling", () => {
  it("throws on empty string", () => {
    assert.throws(() => parseAcl(""), /too few characters/);
  });
  it("throws on missing =", () => {
    assert.throws(() => parseAcl("publicrwadD/a"), /no '='/);
  });
  it("throws on missing /", () => {
    assert.throws(() => parseAcl("public=rwadD"), /no '\/'/);
  });
  it("throws on terminal / (no granter)", () => {
    assert.throws(() => parseAcl("public=rwadD/"), /should have a granter/);
  });
  it("throws on unknown character", () => {
    assert.throws(() => parseAcl("=rZ/a"), /unsupported permission 'Z'/);
  });
  it("throws on two * in a row", () => {
    assert.throws(() => parseAcl("=r**a"), /unsupported permission '\*'/);
  });
  it("throws on asterisk at beginning", () => {
    assert.throws(() => parseAcl("=*r/a"), /unsupported permission '\*'/);
  });
});

describe("ACL serialization", () => {
  it("serializes tiny acl", () => {
    const acl: AclObject = {
      ...baseAcl,
      granter: "a",
      role: "public",
    };
    assert.equal(serializeAcl(acl), "=/a");
  });

  it("serializes tiny acl with role", () => {
    const acl: AclObject = {
      ...baseAcl,
      granter: "a",
      role: "b",
    };
    assert.equal(serializeAcl(acl), "b=/a");
  });

  it("serializes all base permissions", () => {
    const acl: AclObject = {
      ...baseAcl,
      ...allBase,
      granter: "a",
      role: "public",
    };
    assert.equal(serializeAcl(acl), "=arwdDxtXUCTcm/a");
  });

  it("serializes all permissions with grants", () => {
    const acl: AclObject = {
      ...baseAcl,
      ...allBase,
      ...allGrants,
      granter: "a",
      role: "public",
    };
    assert.equal(serializeAcl(acl), "=a*r*w*d*D*x*t*X*U*C*T*c*m*/a");
  });

  it("serializes all permissions with grants and role", () => {
    const acl: AclObject = {
      ...baseAcl,
      ...allBase,
      ...allGrants,
      granter: "bob",
      role: "alice",
    };
    assert.equal(serializeAcl(acl), "alice=a*r*w*d*D*x*t*X*U*C*T*c*m*/bob");
  });

  it("round-trips parseAcl -> serializeAcl", () => {
    const str = "alice=a*r*w*d*x*/bob";
    assert.equal(serializeAcl(parseAcl(str)), str);
  });

  it("round-trips serializeAcl -> parseAcl", () => {
    const acl: AclObject = {
      ...baseAcl,
      role: "my_role",
      granter: "some_granter",
      select: true,
      update: true,
      delete: true,
      updateGrant: true,
    };
    assert.deepEqual(parseAcl(serializeAcl(acl)), acl);
  });

  it("serializes quote-y role and granter", () => {
    const acl: AclObject = {
      ...baseAcl,
      role: `fo"o`,
      granter: `pos"tgres`,
    };
    assert.equal(serializeAcl(acl), `"fo""o"=/"pos""tgres"`);
    assert.deepEqual(parseAcl(serializeAcl(acl)), acl);
  });
});
