/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-plans, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { assertConformance, makeConformanceSchema } from "./utils.ts";

const schema = makeConformanceSchema(/* GraphQL */ `
  type Query implements Interface {
    boolean: Boolean
    int: Int
    float: Float
    string: String
    id: ID
    customScalar: CustomScalar
    enum: Enum
    object: Query
    interface: Interface
    union: Union
  }
  scalar CustomScalar
  enum Enum {
    VALUE
  }
  interface Interface {
    boolean: Boolean
    int: Int
    float: Float
    string: String
    id: ID
    customScalar: CustomScalar
    enum: Enum
    object: Query
    interface: Interface
    union: Union
  }
  union Union = Query
`);

const source = /* GraphQL */ `
  query {
    ...Leaves
    object {
      ...Leaves
    }
    interface {
      ...Leaves
    }
    union {
      ...Leaves
    }
  }
  fragment Leaves on Interface {
    boolean
    int
    float
    string
    id
    customScalar
    enum
  }
`;

it("works", async () => {
  await assertConformance(schema, source, { include: true });
});
