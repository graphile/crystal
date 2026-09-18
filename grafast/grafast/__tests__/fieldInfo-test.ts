/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-plans, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { expect } from "chai";
import { print } from "graphql";
import { it } from "mocha";

import type { FieldInfo } from "../dist/index.js";
import { constant, grafast, makeGrafastSchema } from "../dist/index.js";

it("exposes every merged field node to FieldInfo for aliases and fragments", async () => {
  const fieldNodes: Record<string, string[]> = Object.create(null);
  const recordFieldNodes = (info: FieldInfo) => {
    fieldNodes[`${info.parentType.name}.${info.fieldName}`] =
      info.fieldNodes.map(print);
  };
  const schema = makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      directive @label(name: String!) on FIELD

      type Query {
        thing: Thing!
      }

      type Thing {
        value: String!
      }
    `,
    objects: {
      Query: {
        plans: {
          thing(_$source, _$args, info) {
            recordFieldNodes(info);
            return constant({});
          },
        },
      },
      Thing: {
        plans: {
          value(_$source, _$args, info) {
            recordFieldNodes(info);
            return constant("value");
          },
        },
      },
    },
  });

  const result = await grafast({
    schema,
    source: /* GraphQL */ `
      query {
        requestedThing: thing {
          direct: value @label(name: "direct")
          ...ValueFromFirstFragment
        }
        ...QueryFragment
      }

      fragment QueryFragment on Query {
        requestedThing: thing {
          ...ValueFromSecondFragment
        }
      }

      fragment ValueFromFirstFragment on Thing {
        direct: value @label(name: "first fragment")
      }

      fragment ValueFromSecondFragment on Thing {
        direct: value @label(name: "second fragment")
      }
    `,
  });

  expect(result).to.deep.include({
    data: { requestedThing: { direct: "value" } },
  });
  expect(fieldNodes).to.deep.equal({
    "Query.thing": [
      `requestedThing: thing {
  direct: value @label(name: "direct")
  ...ValueFromFirstFragment
}`,
      `requestedThing: thing {
  ...ValueFromSecondFragment
}`,
    ],
    "Thing.value": [
      'direct: value @label(name: "direct")',
      'direct: value @label(name: "first fragment")',
      'direct: value @label(name: "second fragment")',
    ],
  });
});

it("exposes the applicable field nodes for each concrete type of an interface", async () => {
  const fieldNodes: Record<string, string[]> = Object.create(null);
  const schema = makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      directive @label(name: String!) on FIELD

      interface Being {
        token: String!
      }

      type Human implements Being {
        token: String!
      }

      type Droid implements Being {
        token: String!
      }

      type Query {
        beings: [Being!]!
      }
    `,
    interfaces: {
      Being: {
        resolveType(value: { type: string }) {
          return value.type;
        },
      },
    },
    objects: {
      Query: {
        plans: {
          beings() {
            return constant([{ type: "Human" }, { type: "Droid" }]);
          },
        },
      },
      Human: {
        plans: {
          token(_$source, _$args, info) {
            fieldNodes[`${info.parentType.name}.${info.fieldName}`] =
              info.fieldNodes.map(print);
            return constant("human");
          },
        },
      },
      Droid: {
        plans: {
          token(_$source, _$args, info) {
            fieldNodes[`${info.parentType.name}.${info.fieldName}`] =
              info.fieldNodes.map(print);
            return constant("droid");
          },
        },
      },
    },
  });

  const result = await grafast({
    schema,
    source: /* GraphQL */ `
      query {
        beings {
          ...BaseFields
          ... on Human {
            tokenAlias: token @label(name: "human inline")
            ...HumanFields
          }
          ... on Droid {
            tokenAlias: token @label(name: "droid inline")
            ...DroidFields
          }
        }
      }

      fragment BaseFields on Being {
        tokenAlias: token @label(name: "base")
      }

      fragment HumanFields on Human {
        tokenAlias: token @label(name: "human fragment")
      }

      fragment DroidFields on Droid {
        tokenAlias: token @label(name: "droid fragment")
      }
    `,
  });

  expect(result).to.deep.include({
    data: { beings: [{ tokenAlias: "human" }, { tokenAlias: "droid" }] },
  });
  expect(fieldNodes).to.deep.equal({
    "Human.token": [
      'tokenAlias: token @label(name: "base")',
      'tokenAlias: token @label(name: "human inline")',
      'tokenAlias: token @label(name: "human fragment")',
    ],
    "Droid.token": [
      'tokenAlias: token @label(name: "base")',
      'tokenAlias: token @label(name: "droid inline")',
      'tokenAlias: token @label(name: "droid fragment")',
    ],
  });
});
