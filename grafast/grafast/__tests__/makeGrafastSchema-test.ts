/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { expect } from "chai";
import { constant } from "lodash";
import { it } from "mocha";

import { grafast, lambda, makeGrafastSchema } from "../dist/index.js";

it("can create a schema with an input", async () => {
  const schema = makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      type Query {
        a(a: A!): String!
      }

      input A {
        str: String
      }
    `,
    objects: {
      Query: {
        plans: {
          a(_, { $a }) {
            return lambda($a, (a) => JSON.stringify(a));
          },
        },
      },
    },
  });
  const result = await grafast({ schema, source: `{ a(a: {str: "hello!"})}` });
  if ("next" in result) {
    throw new Error("Iterator not expected");
  }
  expect(result.errors).to.be.undefined;
  expect(result.data?.a).to.eq('{"str":"hello!"}');
});

it("can inform you that you defined a type that isn't in the schema (interfaces)", async () => {
  expect(() =>
    makeGrafastSchema({
      typeDefs: /* GraphQL */ `
        type Query {
          a: Int
        }
      `,
      interfaces: {
        A: {},
      },
    }),
  ).to.throw(
    "You detailed 'interfaces.A', but the 'A' type does not exist in the schema.",
  );
});

it("can inform you that you put a type in the wrong place (interfaces -> inputObjects)", async () => {
  expect(() =>
    makeGrafastSchema({
      typeDefs: /* GraphQL */ `
        type Query {
          a(a: A): Int
        }
        input A {
          str: String
        }
      `,
      interfaces: {
        A: {},
      },
    }),
  ).to.throw(
    "You defined 'A' under 'interfaces', but it is an input object type so it should be defined under 'inputObjects'.",
  );
});

it("can inform you that the field doesn't exist", async () => {
  expect(() =>
    makeGrafastSchema({
      objects: {
        A: {
          plans: {
            string() {
              return constant("");
            },
          },
        },
      },
      typeDefs: /* GraphQL */ `
        type Query {
          a: A
        }
        type A {
          str: String
        }
      `,
    }),
  ).to.throw("Object type 'A' has no field 'string'.");
});

it("can inform you that you used 'objects' for an interface", async () => {
  expect(() =>
    makeGrafastSchema({
      objects: {
        A: {},
      },
      typeDefs: /* GraphQL */ `
        type Query {
          a: A
        }
        interface A {
          str: String
        }
      `,
    }),
  ).to.throw(
    "You defined 'A' under 'objects', but it is an interface type so it should be defined under 'interfaces'.",
  );
});

it("can inform you that you used 'enums' for a scalar", async () => {
  expect(() =>
    makeGrafastSchema({
      enums: {
        A: {},
      },
      typeDefs: /* GraphQL */ `
        type Query {
          a: A
        }
        scalar A
      `,
    }),
  ).to.throw(
    "You defined 'A' under 'enums', but it is a scalar type so it should be defined under 'scalars'.",
  );
});

it("can inform you that a field plan exists for an enum", async () => {
  expect(() =>
    makeGrafastSchema({
      enums: {
        A: {
          plans: {
            str() {
              return constant("");
            },
          },
        },
      },
      typeDefs: /* GraphQL */ `
        type Query {
          a: A
        }
        enum A {
          ONE
        }
      `,
    }),
  ).to.throw("Enum type 'A' cannot have field plans, please use 'values'.");
});

it("can inform you that you used 'objects' for a union", async () => {
  expect(() =>
    makeGrafastSchema({
      objects: {
        A: {},
      },
      typeDefs: /* GraphQL */ `
        type Query {
          a: A
        }
        union A = B | C
        type B {
          str: String
        }
        type C {
          str: String
        }
      `,
    }),
  ).to.throw(
    "You defined 'A' under 'objects', but it is a union type so it should be defined under 'unions'.",
  );
});

it("can inform you that you used 'objects' for an input object", async () => {
  expect(() =>
    makeGrafastSchema({
      objects: {
        A: {},
      },
      typeDefs: /* GraphQL */ `
        type Query {
          a(arg: A): Int
        }
        input A {
          str: String
        }
      `,
    }),
  ).to.throw(
    "You defined 'A' under 'objects', but it is an input object type so it should be defined under 'inputObjects'.",
  );
});

it("can inform you that inputObject field doesn't exist", async () => {
  expect(() =>
    makeGrafastSchema({
      inputObjects: {
        A: {
          plans: {
            notAField() {
              return constant(123);
            },
          },
        },
      },
      typeDefs: /* GraphQL */ `
        type Query {
          a(arg: A): Int
        }
        input A {
          str: String
        }
      `,
    }),
  ).to.throw("Input object type 'A' has no input field 'notAField'.");
});
