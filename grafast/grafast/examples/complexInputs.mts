/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-plans, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
/* eslint-disable simple-import-sort/imports, simple-import-sort/exports, import/no-duplicates */

import assert from "node:assert/strict";
import { grafast } from "grafast";
import { resolvePreset } from "graphile-config";
import type { ExecutionResult } from "graphql";

setTimeout(async () => {
  const source = /* GraphQL */ `
    query Example($filter: UserFilterInput, $patch: UserPatchInput) {
      previewSearch(filter: $filter, patch: $patch) {
        sql
        patchJSON
      }
    }
  `;

  const variableValues = {
    filter: {
      usernameStartsWith: "benj",
      minAge: 18,
      or: [{ minAge: 30 }, { usernameStartsWith: "alice", minAge: 25 }],
    },
    patch: {
      displayName: "Benjie",
      marketingOptIn: true,
      avatar: {
        url: "https://cdn.example.com/avatar.png",
        width: 128,
      },
    },
  };

  const result = (await grafast({
    schema,
    source,
    variableValues,
    resolvedPreset: resolvePreset({}),
    requestContext: {},
  })) as ExecutionResult;

  if (result.errors) {
    const firstError = result.errors[0];
    throw firstError.originalError ?? firstError;
  }

  assert.equal(
    JSON.stringify(result.data),
    JSON.stringify({
      previewSearch: {
        sql: "select * from users where username ilike 'benj%' and age >= 18 and ((age >= 30) or (username ilike 'alice%' and age >= 25))",
        patchJSON:
          '{"display_name":"Benjie","marketing_opt_in":true,"avatar":{"avatar_url":"https://cdn.example.com/avatar.png","avatar_width":128}}',
      },
    }),
  );

  console.log(JSON.stringify(result.data, null, 2));
}, 0);

// Everything below this line will be output in the docs at
// http://build.graphile.org/graphile-build/next/all-hooks
/******************************************************************************/
import type { ExecutionDetails, ExecutionValue, Maybe } from "grafast";
import { makeGrafastSchema, Modifier, Step } from "grafast";

interface Filterable {
  addClause(clause: string): void;
}

type FilterApplyCallback = (request: Filterable) => void;
type BooleanOp = "and" | "or";

class FilterModifier extends Modifier<Filterable> implements Filterable {
  private type: BooleanOp;
  private clauses: string[] = [];
  constructor(input: Filterable, type: BooleanOp) {
    super(input);
    this.type = type;
  }

  addClause(clause: string) {
    this.clauses.push(clause);
  }

  apply(): void {
    if (this.clauses.length === 0) return;
    if (this.type === "and") {
      this.parent.addClause(this.clauses.join(" and "));
    } else {
      if (this.clauses.length === 1) {
        this.parent.addClause(`(${this.clauses[0]})`);
      } else {
        this.parent.addClause(`((${this.clauses.join(") or (")}))`);
      }
    }
  }
}

type FilterCallbacks = Maybe<
  FilterApplyCallback | ReadonlyArray<FilterApplyCallback>
>;

interface BakedAvatarPatch {
  avatar_url: string;
  avatar_width?: number;
}

interface BakedUserPatch {
  display_name?: string | null;
  marketing_opt_in?: boolean | null;
  avatar?: BakedAvatarPatch | null;
}

class SearchRequestStep extends Step<{
  sql: string;
  patchJSON: string;
}> {
  private readonly patchDepId: number;
  private readonly applyDepIds: number[] = [];

  constructor($patch: Step<BakedUserPatch>) {
    super();
    this.patchDepId = this.addDependency($patch);
  }

  apply($cb: Step<FilterCallbacks>) {
    this.applyDepIds.push(this.addUnaryDependency($cb));
  }

  execute(details: ExecutionDetails) {
    const patchDep = details.values[
      this.patchDepId
    ] as ExecutionValue<BakedUserPatch>;

    const clauses: string[] = [
      // Put any initial clauses here
    ];

    // Apply the callbacks
    const applyCallbacks = this.applyDepIds
      .flatMap((id) => details.values[id].unaryValue() as FilterCallbacks)
      .filter((cb) => cb != null);
    const filterable: Filterable = {
      addClause: (clause) => void clauses.push(clause),
    };
    for (const callback of applyCallbacks) {
      callback(filterable);
    }

    // Build query
    const sql = `select * from users${
      clauses.length > 0 ? ` where ${clauses.join(" and ")}` : ""
    }`;

    // Here's where you'd run the query - just a single call for the entire
    // `execute`

    // Finally correlate the results with the inputs
    return details.indexMap((i) => {
      const patch = patchDep.at(i);
      return { sql, patchJSON: JSON.stringify(patch) };
    });
  }
}

function searchRequest(patch: any) {
  return new SearchRequestStep(patch);
}

const schema = makeGrafastSchema({
  typeDefs: /* GraphQL */ `
    input AvatarPatchInput {
      url: String!
      width: Int
    }

    input UserPatchInput {
      displayName: String
      marketingOptIn: Boolean
      avatar: AvatarPatchInput
    }

    input UserFilterInput {
      usernameStartsWith: String
      minAge: Int
      or: [UserFilterInput!]
    }

    type SearchPreview {
      sql: String!
      patchJSON: String!
    }

    type Query {
      previewSearch(
        filter: UserFilterInput
        patch: UserPatchInput
      ): SearchPreview!
    }
  `,
  inputObjects: {
    AvatarPatchInput: {
      baked(_input, info) {
        const baked: Partial<BakedAvatarPatch> = {};
        info.applyChildren(baked);
        return baked as BakedAvatarPatch;
      },
      plans: {
        url(target: Partial<BakedAvatarPatch>, value: string) {
          target.avatar_url = value;
        },
        width(target: Partial<BakedAvatarPatch>, value: number | null) {
          if (value != null) {
            target.avatar_width = value;
          }
        },
      },
    },
    UserPatchInput: {
      baked(_input, info) {
        const baked: Partial<BakedUserPatch> = {};
        info.applyChildren(baked);
        return baked as BakedUserPatch;
      },
      plans: {
        displayName(target: Partial<BakedUserPatch>, value: string | null) {
          if (value != null) {
            target.display_name = value;
          }
        },
        marketingOptIn(target: Partial<BakedUserPatch>, value: boolean | null) {
          if (value != null) {
            target.marketing_opt_in = value;
          }
        },
        avatar(target: Partial<BakedUserPatch>, value: unknown) {
          if (value == null) {
            return;
          }
          const bakedAvatar: Partial<BakedAvatarPatch> = {};
          target.avatar = bakedAvatar as BakedAvatarPatch;
          return bakedAvatar; // Recurse
        },
      },
    },
    UserFilterInput: {
      plans: {
        usernameStartsWith(target: Filterable, value: Maybe<string>) {
          if (value == null) return;
          target.addClause(`username ilike '${value.replace(/'/g, "''")}%'`);
        },
        minAge(target: Filterable, value: Maybe<number>) {
          if (value == null) return;
          target.addClause(`age >= ${value}`);
        },
        or(target: Filterable, value: Maybe<ReadonlyArray<unknown>>) {
          if (value == null) return;
          if (value.length === 0) return;

          // We're joining the list items with "or".
          const or = new FilterModifier(target, "or");

          // But each list item itself is an object, and the properties of
          // those must be combined via an an "and".
          return () => new FilterModifier(or, "and");
        },
      },
    },
  },
  objects: {
    Query: {
      plans: {
        previewSearch(_parent, fieldArgs) {
          // Take the "patch" input and filter it through it's "baked"
          // transforms, to get the transformed value.
          const $bakedPatch = fieldArgs.getBaked("patch");

          // Create a step representing our search request
          const $request = searchRequest($bakedPatch);

          // Apply the filters from the "filter" argument (recursively) to the
          // request
          fieldArgs.apply($request, "filter");

          return $request;
        },
      },
    },
  },
});
