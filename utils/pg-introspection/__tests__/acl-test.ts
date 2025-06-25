import assert from "node:assert";
import { describe, it } from "node:test";

import { type AclObject, parseAcl } from "../dist/acl.js";

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
    assert.deepEqual(parseAcl("=rwadDxtXUCcTm/a"), {
      ...baseAcl,
      ...allBase,
      granter: "a",
      role: "public",
    } as AclObject);
  });
  it("parses massive acl with role", () => {
    assert.deepEqual(parseAcl("b=rwadDxtXUCcTm/a"), {
      ...baseAcl,
      ...allBase,
      granter: "a",
      role: "b",
    } as AclObject);
  });
  it("parses massive acl with grants", () => {
    assert.deepEqual(parseAcl("=r*w*a*d*D*x*t*X*U*C*c*T*m*/a"), {
      ...baseAcl,
      ...allBase,
      ...allGrants,
      granter: "a",
      role: "public",
    } as AclObject);
  });
  it("parses massive acl with grants and role", () => {
    assert.deepEqual(parseAcl("b=r*w*a*d*D*x*t*X*U*C*c*T*m*/a"), {
      ...baseAcl,
      ...allBase,
      ...allGrants,
      granter: "a",
      role: "b",
    } as AclObject);
  });
});

describe("broken ACL handling", () => {
  it("throws on empty string", () => {});
  it("throws on missing =", () => {});
  it("throws on missing /", () => {});
  it("throws on terminal / (no granter)", () => {});
  it("throws on unknown character", () => {});
  it("throws on two * in a row", () => {});
});
