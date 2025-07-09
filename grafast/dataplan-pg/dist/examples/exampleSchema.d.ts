import { GraphQLSchema } from "grafast/graphql";
import type { WithPgClient } from "../";
import type { NodePostgresPgClient, PgSubscriber } from "../adaptors/pg.js";
export declare function EXPORTABLE<T, TScope extends any[]>(factory: (...args: TScope) => T, args: [...TScope], nameHint?: string): T;
export interface OurGraphQLContext extends Grafast.Context {
    pgSettings: Record<string, string | undefined>;
    withPgClient: WithPgClient<NodePostgresPgClient>;
    pgSubscriber: PgSubscriber;
}
export declare function makeExampleSchema(options?: {
    deoptimize?: boolean;
}): GraphQLSchema;
//# sourceMappingURL=exampleSchema.d.ts.map