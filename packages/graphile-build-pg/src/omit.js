// @flow

import type {
  PgProc,
  PgClass,
  PgAttribute,
  PgConstraint,
} from "./plugins/PgIntrospectionPlugin";

/*
 * Please only use capitals for aliases and lower case for the values.
 */
const CREATE = "create";
const READ = "read";
const UPDATE = "update";
const DELETE = "delete";
const ALL = "all";
const MANY = "many";
const ORDER = "order";
const FILTER = "filter";
const EXECUTE = "execute";

const aliases = {
  C: CREATE,
  R: READ,
  U: UPDATE,
  D: DELETE,
  F: FILTER,
  O: ORDER,
  A: ALL,
  M: MANY,
  X: EXECUTE,
};

const PERMISSIONS_THAT_REQUIRE_READ = [UPDATE, CREATE, DELETE, ALL, MANY];

function parse(arrOrNot, errorPrefix = "Error") {
  if (!arrOrNot) {
    return null;
  }
  const arr = Array.isArray(arrOrNot) ? arrOrNot : [arrOrNot];
  let all = false;
  const arrayNormalized = [].concat(
    ...arr.map(str => {
      if (str === true || str === "*") {
        all = true;
        return [];
      }
      if (str[0] === ":") {
        const perms = str
          .substr(1)
          .split("")
          .map(p => aliases[p]);
        const bad = perms.find(p => !p);
        if (bad) {
          throw new Error(
            `${errorPrefix} - abbreviated parameter '${bad}' not understood`
          );
        }
        return perms;
      } else {
        const perms = str.split(",");
        // TODO: warning if not in list?
        return perms;
      }
    })
  );
  if (all) {
    return true;
  }
  return arrayNormalized;
}

export default function omit(
  entity: PgProc | PgClass | PgAttribute | PgConstraint,
  permission: string
) {
  const tags = entity.tags;
  const omitSpecRaw = tags.omit;

  // '@include' is not being released yet because it would mean every new
  // filter we added would become a breaking change for people using @include.
  const includeSpecRaw = null;
  // const includeSpecRaw = tags.include;

  if (omitSpecRaw && includeSpecRaw) {
    throw new Error(
      `Error when processing instructions for ${entity.kind} '${
        entity.name
      }' - you must only specify @omit or @include, not both`
    );
  }
  const omitSpec = parse(
    omitSpecRaw,
    `Error when processing @omit instructions for ${entity.kind} '${
      entity.name
    }'`
  );
  const includeSpec = parse(
    includeSpecRaw,
    `Error when processing @include instructions for ${entity.kind} '${
      entity.name
    }'`
  );

  if (omitSpec) {
    if (omitSpec === true) {
      return true;
    }
    if (omitSpec.indexOf(READ) >= 0) {
      const bad = PERMISSIONS_THAT_REQUIRE_READ.find(
        p => omitSpec.indexOf(p) === -1
      );
      if (bad) {
        throw new Error(
          `Error when processing @omit for ${entity.kind} '${
            entity.name
          }' - we currently don't support '${bad}' when '${READ}' is forbidden, to solve this add '${bad}' to the @omit clause or use ‘@omit‘ to omit from everything`
        );
      }
    }
    return omitSpec.indexOf(permission) >= 0;
  } else if (includeSpec) {
    if (includeSpec === true) {
      throw new Error(
        `Error when processing instructions for ${entity.kind} '${
          entity.name
        }' - @include should specify a list of actions`
      );
    }
    if (includeSpec.indexOf(READ) === -1) {
      const bad = PERMISSIONS_THAT_REQUIRE_READ.find(
        p => includeSpec.indexOf(p) >= 0
      );
      if (bad) {
        throw new Error(
          `Error when processing @include for ${entity.kind} '${
            entity.name
          }' - we currently don't support '${bad}' when '${READ}' is forbidden`
        );
      }
    }
    return includeSpec.indexOf(permission) === -1;
  } else {
    return false;
  }
}
