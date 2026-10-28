import type { PgSelectSingleStep, PgSelectStep } from "@dataplan/pg";

import type { pgResources } from "./registry.mts";

export type Overrides = {
  User: {
    nullable: PgSelectSingleStep<typeof pgResources.users>;
    list: PgSelectStep<typeof pgResources.users>;
  };
  Post: {
    nullable: PgSelectSingleStep<typeof pgResources.posts>;
    list: PgSelectStep<typeof pgResources.posts>;
  };
};
