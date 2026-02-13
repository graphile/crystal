/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-plans, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import assert from "node:assert/strict";

import type { ExecutionDetails, Maybe } from "grafast";
import { grafast, lambda, makeGrafastSchema, Modifier, Step } from "grafast";
import { resolvePreset } from "graphile-config";
import type { ExecutionResult } from "graphql";

type FilterRequest = {
  andClauses: string[];
  orClauses: string[];
};

type ApplyCallback = (request: FilterRequest) => void;

class OrClauseModifier extends Modifier<FilterRequest> {
  private clauses: string[] = [];

  addClause(clause: string) {
    this.clauses.push(clause);
  }

  apply(): void {
    if (this.clauses.length > 0) {
      this.parent.orClauses.push(this.clauses.join(" and "));
    }
  }
}

function pushClause(target: FilterRequest | OrClauseModifier, clause: string) {
  if (target instanceof OrClauseModifier) {
    target.addClause(clause);
  } else {
    target.andClauses.push(clause);
  }
}

type SearchRequestResult = {
  sql: string;
  bakedPatchJson: string;
};
class SearchRequestStep extends Step<SearchRequestResult> {
  private readonly bakedPatchDepId: number;
  private readonly applyDepIds: number[] = [];

  constructor($bakedPatchJson: Step<string>) {
    super();
    this.bakedPatchDepId = this.addDependency($bakedPatchJson);
  }

  apply($cb: Step<Maybe<ApplyCallback | ReadonlyArray<ApplyCallback>>>) {
    this.applyDepIds.push(this.addUnaryDependency($cb));
  }

  execute(details: ExecutionDetails) {
    const bakedPatchDep = details.values[this.bakedPatchDepId];
    const applyCallbacks = this.applyDepIds
      .flatMap((id) => details.values[id].unaryValue())
      .filter((cb) => cb != null);
    return details.indexMap((i) => {
      const bakedPatchJson = (bakedPatchDep.at(i) as string | null) ?? "null";
      const request: FilterRequest = {
        andClauses: [],
        orClauses: [],
      };

      for (const callback of applyCallbacks) {
        callback(request);
      }

      const whereParts = [...request.andClauses];
      if (request.orClauses.length === 1) {
        whereParts.push(request.orClauses[0]);
      } else if (request.orClauses.length > 1) {
        whereParts.push(`((${request.orClauses.join(") or (")}))`);
      }

      const whereClause =
        whereParts.length > 0 ? ` where ${whereParts.join(" and ")}` : "";
      const sql = `select * from users${whereClause}`;

      return { sql, bakedPatchJson };
    });
  }
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
      bakedPatch: String!
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
      plans: {
        url(target: Record<string, unknown>, value: string) {
          target.avatar_url = value;
        },
        width(target: Record<string, unknown>, value: number | null) {
          if (value != null) {
            target.avatar_width = value;
          }
        },
      },
    },
    UserPatchInput: {
      baked(_input, info) {
        const baked: Record<string, unknown> = {};
        info.applyChildren(baked);
        return baked;
      },
      plans: {
        displayName(target: Record<string, unknown>, value: string | null) {
          if (value != null) {
            target.display_name = value;
          }
        },
        marketingOptIn(target: Record<string, unknown>, value: boolean | null) {
          if (value != null) {
            target.marketing_opt_in = value;
          }
        },
        avatar(target: Record<string, unknown>, value: unknown) {
          if (value == null) {
            return;
          }
          const bakedAvatar: Record<string, unknown> = {};
          target.avatar = bakedAvatar;
          return bakedAvatar;
        },
      },
    },
    UserFilterInput: {
      plans: {
        usernameStartsWith(
          target: FilterRequest | OrClauseModifier,
          value: string,
        ) {
          pushClause(target, `username like '${value.replace(/'/g, "''")}%'`);
        },
        minAge(target: FilterRequest | OrClauseModifier, value: number) {
          pushClause(target, `age >= ${value}`);
        },
        or(target: FilterRequest, value: ReadonlyArray<unknown> | null) {
          if (value == null || value.length === 0) {
            return;
          }
          return () => new OrClauseModifier(target);
        },
      },
    },
  },
  objects: {
    Query: {
      plans: {
        previewSearch(_parent, fieldArgs) {
          const $bakedPatch = fieldArgs.getBaked("patch");
          const $bakedPatchJson = lambda($bakedPatch, (patch) =>
            JSON.stringify(patch),
          );
          const $request = new SearchRequestStep($bakedPatchJson);
          fieldArgs.apply($request, "filter");
          return $request;
        },
      },
    },
    SearchPreview: {
      plans: {
        sql($preview: SearchRequestStep) {
          return lambda($preview, (preview) => preview.sql);
        },
        bakedPatch($preview: SearchRequestStep) {
          return lambda($preview, (preview) => preview.bakedPatchJson);
        },
      },
    },
  },
  enableDeferStream: false,
});

const source = /* GraphQL */ `
  query Example($filter: UserFilterInput, $patch: UserPatchInput) {
    previewSearch(filter: $filter, patch: $patch) {
      sql
      bakedPatch
    }
  }
`;

const variableValues = {
  filter: {
    usernameStartsWith: "ben",
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
  throw new Error(result.errors.map((e) => e.message).join("\n"));
}

assert.equal(
  JSON.stringify(result.data),
  JSON.stringify({
    previewSearch: {
      sql: "select * from users where username like 'ben%' and age >= 18 and ((age >= 30) or (username like 'alice%' and age >= 25))",
      bakedPatch:
        '{"display_name":"Benjie","marketing_opt_in":true,"avatar":{"avatar_url":"https://cdn.example.com/avatar.png","avatar_width":128}}',
    },
  }),
);

console.log(JSON.stringify(result.data, null, 2));
