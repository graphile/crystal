import transform from "../../../grafast/dataplan-pg/__tests__/transform-graphql.js";

export default {
  process: transform.makeProcess({
    includeDeoptimize: false,
    // TODO: change includeStringified to 'true' (currently disabled due to memory exhaustion on CI)
    includeStringified: false,
  }),
};
