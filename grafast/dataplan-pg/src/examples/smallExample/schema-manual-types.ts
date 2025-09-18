import type { PgSelectSingleStep, PgSelectStep } from "@dataplan/pg";

import { pgRegistry } from "./registry";

const { users, posts } = pgRegistry.pgResources;

export type Overrides = {
  User: {
    nullable: PgSelectSingleStep<typeof users>;
    list: PgSelectStep<typeof users>;
  };
  Post: {
    nullable: PgSelectSingleStep<typeof posts>;
    list: PgSelectStep<typeof posts>;
  };
};
