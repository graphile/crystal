import { makeGrafastSchema, lambda } from "grafast";

const schema = makeGrafastSchema({
  typeDefs: `
    type Query {
      add(a: Int!, b: Int!): Int
    }
  `,
  plans: {
    Query: {
      add(_, fieldArgs) {
        const $a = fieldArgs.get("a");
        const $b = fieldArgs.get("b");
        return lambda([$a, $b], ([a, b]) => a + b);
      },
    },
  },
});

export default schema;
