import transform from "../../../grafast/dataplan-pg/__tests__/transform-graphql.js";

export default {
  process: transform.makeProcess({
    includeDeoptimize: false,
    includeStringified: true,
  }),
};
