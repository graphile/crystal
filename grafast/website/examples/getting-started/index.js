const { makeGrafastSchema, lambda, grafastSync } = require("grafast");

const typeDefs = /* GraphQL */ `
  type Query {
    addTwoNumbers(a: Int!, b: Int!): Int
  }
`;

const plans = {
  Query: {
    addTwoNumbers(_, args) {
      const $a = args.get("a");
      const $b = args.get("b");
      return lambda([$a, $b], ([a, b]) => a + b, true);
    },
  },
};

const schema = makeGrafastSchema({
  typeDefs,
  plans,
});

const result = grafastSync({
  schema,
  source: /* GraphQL */ `
    {
      addTwoNumbers(a: 40, b: 2)
    }
  `,
});

console.log(JSON.stringify(result, null, 2));
