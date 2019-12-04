import {
  PgProc,
  PgClass,
  PgAttribute,
  PgConstraint,
  SmartTagValue,
} from "./plugins/PgIntrospectionPlugin";

/*
 * Please only use capitals for aliases and lower case for the values.
 */
export const CREATE = "create";
export const READ = "read";
export const UPDATE = "update";
export const DELETE = "delete";
export const FILTER = "filter";
export const ORDER = "order";
export const ALL = "all";
export const MANY = "many";
export const EXECUTE = "execute";
export const BASE = "base";

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
  B: BASE,
};

const PERMISSIONS_THAT_REQUIRE_READ = [UPDATE, CREATE, DELETE, ALL, MANY];

function parse(arrOrNot: SmartTagValue | null, errorPrefix = "Error") {
  if (!arrOrNot) {
    return null;
  }
  const arr: (string | true)[] = Array.isArray(arrOrNot)
    ? arrOrNot
    : [arrOrNot];
  let all = false;
  const arrayNormalized: string[] = ([] as string[]).concat(
    ...arr.map((str: true | string): string[] => {
      if (str === true || str === "*") {
        all = true;
        return [];
      }
      if (str[0] === ":") {
        const abbreviations: string[] = str.substr(1).split("");
        const perms: (string | null)[] = abbreviations.map(
          (p): string | null => aliases[p]
        );
        const badIndex = perms.findIndex(p => !p);
        if (badIndex >= 0) {
          throw new Error(
            `${errorPrefix} - abbreviated parameter '${abbreviations[badIndex]}' in '${str}' not understood`
          );
        }
        return perms as string[];
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
  permission:
    | "create"
    | "read"
    | "update"
    | "delete"
    | "filter"
    | "order"
    | "all"
    | "many"
    | "execute"
    | "base"
    | string
): boolean {
  const tags = entity.tags;
  const omitSpecRaw = tags.omit;

  // '@include' is not being released yet because it would mean every new
  // filter we added would become a breaking change for people using @include.
  const includeSpecRaw = null;
  // const includeSpecRaw = tags.include;

  if (omitSpecRaw && includeSpecRaw) {
    throw new Error(
      `Error when processing instructions for ${entity.kind} '${entity.name}' - you must only specify @omit or @include, not both`
    );
  }
  const omitSpec = parse(
    omitSpecRaw,
    `Error when processing @omit instructions for ${entity.kind} '${entity.name}'`
  );

  const includeSpec = parse(
    includeSpecRaw,
    `Error when processing @include instructions for ${entity.kind} '${entity.name}'`
  );

  if (omitSpec) {
    if (omitSpec === true) {
      return true;
    }
    if (omitSpec.indexOf(READ) >= 0) {
      const bad = PERMISSIONS_THAT_REQUIRE_READ.filter(
        p => omitSpec.indexOf(p) === -1
      );

      if (bad.length > 0) {
        throw new Error(
          `Processing @omit for ${entity.kind} '${entity.name}' - '${bad.join(
            ","
          )}' must be omitted when '${READ}' is omitted. Add '${bad.join(
            ","
          )}' to the @omit clause, or use '@omit' to omit all actions.`
        );
      }
    }
    return omitSpec.indexOf(permission) >= 0;
  } else if (includeSpec) {
    if (includeSpec === true) {
      throw new Error(
        `Error when processing instructions for ${entity.kind} '${entity.name}' - @include should specify a list of actions`
      );
    }
    if (includeSpec.indexOf(READ) === -1) {
      const bad = PERMISSIONS_THAT_REQUIRE_READ.find(
        p => includeSpec.indexOf(p) >= 0
      );

      if (bad) {
        throw new Error(
          `Error when processing @include for ${entity.kind} '${entity.name}' - we currently don't support '${bad}' when '${READ}' is forbidden`
        );
      }
    }
    return includeSpec.indexOf(permission) === -1;
  } else {
    return false;
  }
}
