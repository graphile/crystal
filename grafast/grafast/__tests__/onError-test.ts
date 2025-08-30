/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { expect } from "chai";
import { resolvePreset } from "graphile-config";
import { type ExecutionResult } from "graphql";
import { it } from "mocha";

import {
  constant,
  context,
  get,
  grafast,
  GraphQLSpecifiedErrorBehaviors,
  lambda,
  list,
  makeGrafastSchema,
  Step,
} from "../dist/index.js";

const resolvedPreset = resolvePreset({});
const requestContext = {};

declare global {
  namespace Grafast {
    interface Context {
      me?: {
        id: number;
        name: string;
        nonNullable: unknown;
        nullable: unknown;
        nonNullableList: unknown;
        nullableList: unknown;
      };
    }
  }
}

const schema = makeGrafastSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      me: User
    }
    type User {
      id: Int!
      name: String!
      nonNullable: Int!
      nullable: Int
      nonNullableList: [Int!]!
      nullableList: [Int]
      throwNonNullable: Int!
      throwNullable: Int
      friends: [User!]
    }
  `,
  objects: {
    Query: {
      plans: {
        me() {
          return get(context(), "me");
        },
      },
    },
    User: {
      plans: {
        friends($user) {
          return list([
            constant({
              id: 99,
              name: "Test",
              nonNullable: 99,
              nonNullableList: [],
            }),
            $user,
          ]);
        },
        throwNonNullable($user: Step) {
          return lambda($user, () => {
            throw new Error("Threw in non-nullable field");
          });
        },
        throwNullable($user: Step) {
          return lambda($user, () => {
            throw new Error("Threw in nullable field");
          });
        },
      },
    },
  },
  enableDeferStream: true,
});

function throwOnUnhandledRejections(callback: () => Promise<void>) {
  return async () => {
    let failed: Error | undefined;
    function fail(e: Error) {
      console.error(`UNHANDLED PROMISE REJECTION: ${e}`);
      failed = e;
    }
    process.on("unhandledRejection", fail);
    try {
      return await callback();
    } finally {
      process.off("unhandledRejection", fail);
      if (failed) {
        failed = undefined;
        // eslint-disable-next-line no-unsafe-finally
        throw new Error(`Unhandled promise rejection occurred`);
      }
    }
  };
}

GraphQLSpecifiedErrorBehaviors.forEach((onError) => {
  describe(`onError=${onError}`, () => {
    it(
      "handles null in non-nullable position",
      throwOnUnhandledRejections(async () => {
        const source = /* GraphQL */ `
          {
            me {
              id
              nonNullable
              nullable
              name
            }
          }
        `;
        const result = (await grafast({
          schema,
          source,
          onError,
          contextValue: {
            me: {
              id: 42,
              nonNullable: null,
              nullable: null,
              name: "Benjie",
            },
          },
          requestContext,
          resolvedPreset,
        })) as ExecutionResult;

        // All error modes expect the same errors:
        expect(result.errors).to.have.length(1);
        expect(result.errors![0]).to.deep.include({
          message:
            "Cannot return null for non-nullable field User.nonNullable.",
          path: ["me", "nonNullable"],
        });

        switch (onError) {
          case "PROPAGATE": {
            expect(result.data).to.deep.equal({
              me: null,
            });
            break;
          }
          case "NULL": {
            expect(result.data).to.deep.equal({
              me: {
                id: 42,
                nonNullable: null,
                nullable: null,
                name: "Benjie",
              },
            });
            break;
          }
          case "HALT": {
            expect(result.data).to.equal(null);
            break;
          }
          default: {
            const never: never = onError;
            throw new Error(`Unexpected onError: ${never}`);
          }
        }
      }),
    );

    it(
      "handles null in nullable position",
      throwOnUnhandledRejections(async () => {
        const source = /* GraphQL */ `
          {
            me {
              id
              nonNullable
              nullable
              name
            }
          }
        `;
        const result = (await grafast({
          schema,
          source,
          onError,
          contextValue: {
            me: {
              id: 42,
              nonNullable: 27,
              nullable: null,
              name: "Benjie",
            },
          },
          requestContext,
          resolvedPreset,
        })) as ExecutionResult;

        expect(result.errors).to.be.undefined;
        expect(result.data).to.deep.equal({
          me: {
            id: 42,
            nonNullable: 27,
            nullable: null,
            name: "Benjie",
          },
        });
      }),
    );

    it(
      "handles coercion failure in non-nullable position",
      throwOnUnhandledRejections(async () => {
        const source = /* GraphQL */ `
          {
            me {
              id
              nonNullable
              nullable
              name
            }
          }
        `;
        const result = (await grafast({
          schema,
          source,
          onError,
          contextValue: {
            me: {
              id: 42,
              nonNullable: "NOT A NUMBER",
              nullable: null,
              name: "Benjie",
            },
          },
          requestContext,
          resolvedPreset,
        })) as ExecutionResult;

        // All error modes expect the same errors:
        expect(result.errors).to.have.length(1);
        expect(result.errors![0]).to.deep.include({
          message: `Int cannot represent non-integer value: "NOT A NUMBER"`,
          path: ["me", "nonNullable"],
        });

        switch (onError) {
          case "PROPAGATE": {
            expect(result.data).to.deep.equal({
              me: null,
            });
            break;
          }
          case "NULL": {
            expect(result.data).to.deep.equal({
              me: {
                id: 42,
                nonNullable: null,
                nullable: null,
                name: "Benjie",
              },
            });
            break;
          }
          case "HALT": {
            expect(result.data).to.equal(null);
            break;
          }
          default: {
            const never: never = onError;
            throw new Error(`Unexpected onError: ${never}`);
          }
        }
      }),
    );

    it(
      "handles thrown error in nullable position",
      throwOnUnhandledRejections(async () => {
        const source = /* GraphQL */ `
          {
            me {
              id
              throwNullable
              name
            }
          }
        `;
        const result = (await grafast({
          schema,
          source,
          onError,
          contextValue: {
            me: {
              id: 42,
              name: "Benjie",
            },
          },
          requestContext,
          resolvedPreset,
        })) as ExecutionResult;

        // All error modes expect the same errors:
        expect(result.errors).to.have.length(1);
        expect(result.errors![0]).to.deep.include({
          message: `Threw in nullable field`,
          path: ["me", "throwNullable"],
        });

        switch (onError) {
          case "NULL":
          case "PROPAGATE": {
            expect(result.data).to.deep.equal({
              me: {
                id: 42,
                throwNullable: null,
                name: "Benjie",
              },
            });
            break;
          }
          case "HALT": {
            expect(result.data).to.equal(null);
            break;
          }
          default: {
            const never: never = onError;
            throw new Error(`Unexpected onError: ${never}`);
          }
        }
      }),
    );

    it(
      "handles thrown error in non-nullable position",
      throwOnUnhandledRejections(async () => {
        const source = /* GraphQL */ `
          {
            me {
              id
              throwNonNullable
              name
            }
          }
        `;
        const result = (await grafast({
          schema,
          source,
          onError,
          contextValue: {
            me: {
              id: 42,
              name: "Benjie",
            },
          },
          requestContext,
          resolvedPreset,
        })) as ExecutionResult;

        // All error modes expect the same errors:
        expect(result.errors).to.have.length(1);
        expect(result.errors![0]).to.deep.include({
          message: `Threw in non-nullable field`,
          path: ["me", "throwNonNullable"],
        });

        switch (onError) {
          case "NULL": {
            expect(result.data).to.deep.equal({
              me: {
                id: 42,
                throwNonNullable: null,
                name: "Benjie",
              },
            });
            break;
          }
          case "PROPAGATE": {
            expect(result.data).to.deep.equal({
              me: null,
            });
            break;
          }
          case "HALT": {
            expect(result.data).to.equal(null);
            break;
          }
          default: {
            const never: never = onError;
            throw new Error(`Unexpected onError: ${never}`);
          }
        }
      }),
    );

    it(
      "handles null in non-nullable list position",
      throwOnUnhandledRejections(async () => {
        const source = /* GraphQL */ `
          {
            me {
              id
              nonNullableList
              nullableList
              name
            }
          }
        `;
        const result = (await grafast({
          schema,
          source,
          onError,
          contextValue: {
            me: {
              id: 42,
              nonNullableList: [1, 1, 2, null, 5],
              nullableList: null,
              name: "Benjie",
            },
          },
          requestContext,
          resolvedPreset,
        })) as ExecutionResult;

        // All error modes expect the same errors:
        expect(result.errors).to.have.length(1);
        expect(result.errors![0]).to.deep.include({
          message:
            "Cannot return null for non-nullable field User.nonNullableList.",
          path: ["me", "nonNullableList", 3],
        });

        switch (onError) {
          case "PROPAGATE": {
            expect(result.data).to.deep.equal({
              me: null,
            });
            break;
          }
          case "NULL": {
            expect(result.data).to.deep.equal({
              me: {
                id: 42,
                nonNullableList: [1, 1, 2, null, 5],
                nullableList: null,
                name: "Benjie",
              },
            });
            break;
          }
          case "HALT": {
            expect(result.data).to.equal(null);
            break;
          }
          default: {
            const never: never = onError;
            throw new Error(`Unexpected onError: ${never}`);
          }
        }
      }),
    );

    it(
      "handles null in non-nullable position inside a non-nullable list position",
      throwOnUnhandledRejections(async () => {
        const source = /* GraphQL */ `
          {
            me {
              id
              name
              friends {
                id
                name
                nonNullableList
                nullableList
              }
            }
          }
        `;
        const result = (await grafast({
          schema,
          source,
          onError,
          contextValue: {
            me: {
              id: 42,
              nonNullableList: [1, 1, 2, null, 5],
              nullableList: null,
              name: "Benjie",
            },
          },
          requestContext,
          resolvedPreset,
        })) as ExecutionResult;

        // All error modes expect the same errors:
        expect(result.errors).to.have.length(1);
        expect(result.errors![0]).to.deep.include({
          message:
            "Cannot return null for non-nullable field User.nonNullableList.",
          path: ["me", "friends", 1, "nonNullableList", 3],
        });

        switch (onError) {
          case "PROPAGATE": {
            expect(result.data).to.deep.equal({
              me: {
                id: 42,
                name: "Benjie",
                friends: null,
              },
            });
            break;
          }
          case "NULL": {
            expect(result.data).to.deep.equal({
              me: {
                id: 42,
                name: "Benjie",
                friends: [
                  {
                    id: 99,
                    name: "Test",
                    nonNullableList: [],
                    nullableList: null,
                  },
                  {
                    id: 42,
                    name: "Benjie",
                    nonNullableList: [1, 1, 2, null, 5],
                    nullableList: null,
                  },
                ],
              },
            });
            break;
          }
          case "HALT": {
            expect(result.data).to.equal(null);
            break;
          }
          default: {
            const never: never = onError;
            throw new Error(`Unexpected onError: ${never}`);
          }
        }
      }),
    );
  });
});
