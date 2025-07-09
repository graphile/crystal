import type { PromiseOrDirect } from "grafast";
import type { Introspection, PgConstraint } from "pg-introspection";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            PgFakeConstraintsPlugin: true;
        }
        interface GatherHelpers {
            pgFakeConstraints: Record<string, never>;
        }
        interface GatherHooks {
            pgFakeConstraints_constraint(event: {
                introspection: Introspection;
                serviceName: string;
                entity: PgConstraint;
            }): PromiseOrDirect<void>;
        }
    }
    namespace GraphileBuild {
        interface GatherOptions {
            /** @deprecated We strongly recommend that you fix the uniqueness yourself. */
            pgFakeConstraintsAutofixForeignKeyUniqueness?: boolean;
        }
    }
}
export declare const PgFakeConstraintsPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PgFakeConstraintsPlugin.d.ts.map