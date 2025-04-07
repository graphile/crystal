import { expect } from "chai";
import { resolvePreset } from "graphile-config";
import { parse } from "graphql";
import { it } from "mocha";

import {
  access,
  constant,
  execute,
  type FieldArgs,
  grafastSync,
  makeGrafastSchema,
  type Step,
} from "../dist/index.js";

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
        return constant(Object.create(null));
      },
    },
    Obj: {
      o($o: Step) {
        return $o;
      },
      a($o: Step) {
        return access($o, "a");
      },
      b($o: Step) {
        return access($o, "b");
      },
      echoNumber(_: Step, { $nr }: FieldArgs) {
        return $nr;
      },
      echoString(_: Step, { $str }: FieldArgs) {
        return $str;
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
  expect(result.errors).to.equal(undefined);
  const expected = `\
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
}`;
  expect(JSON.stringify(result.data, null, 2)).to.equal(expected);
  const result2 = execute({
    schema,
    document: parse(source),
    resolvedPreset: resolvePreset({}),
    outputDataAsString: true,
  }) as any;
  expect(JSON.stringify(JSON.parse(result2.data), null, 2)).to.equal(expected);
});
