import { expect } from "chai";
import { describe, it } from "mocha";
import { grafastSync, makeGrafastSchema, access, constant } from "../dist";

const schema = makeGrafastSchema({
  typeDefs: /* GraphQL */ `
    type Obj {
      echoNumber(nr: Int!): Int
      echoString(str: String!): String
      o: Obj
      a: Int
      b: String
    }
    type Query {
      o: Obj
    }
  `,
  plans: {
    Query: {
      o() {
        return constant({});
      },
    },
    Obj: {
      o($o) {
        return $o;
      },
      a($o) {
        return access($o, "a");
      },
      b($o) {
        return access($o, "b");
      },
      echoNumber(_, fieldArgs) {
        return fieldArgs.get("nr");
      },
      echoString(_, fieldArgs) {
        return fieldArgs.get("str");
      },
    },
  },
});

it("ok", () => {
  const source = /* GraphQL */ `
    {
      o {
        a
        b
        __proto__: o {
          a: echoNumber(nr: 42)
          b: echoString(str: "But what is the question?")
        }
        constructor: o {
          a: echoNumber(nr: 2)
          b: echoString(str: "The first prime")
        }
      }
    }
  `;
  const result = grafastSync({
    schema,
    source,
  });
  console.dir(result);
  expect(result.errors).to.equal(undefined);
  expect(JSON.stringify(result.data, null, 2)).to.equal(
    `\
{
  "o": {
    "a": null,
    "b": null,
    "__proto__": {
      "a": 42,
      "b": "But what is the question?"
    },
    "constructor": {
      "a": 2,
      "b": "The first prime"
    }
  }
}`,
  );
});
