import "graphile-config";
import type { PgCodec } from "@dataplan/pg";
import type { Secret, SignOptions } from "jsonwebtoken";
declare global {
    namespace GraphileBuild {
        interface BehaviorStrings {
            jwt: true;
        }
        interface SchemaOptions {
            pgJwtSecret?: Secret;
            pgJwtSignOptions?: SignOptions;
        }
        interface GatherOptions {
            /** @deprecated use pgJwtTypes instead */
            pgJwtType?: string | [string, string];
            /**
             * If you would like PostGraphile to automatically recognize certain
             * PostgreSQL types as a JWT, you should pass a list of their identifiers
             * here:
             * `pgJwtTypes: ['my_schema.my_jwt_type', 'my_schema."myOtherJwtType"']`
             *
             * Parsing is similar to PostgreSQL's parsing, so identifiers are
             * lower-cased unless they are escaped via double quotes.
             *
             * You can alternatively supply a comma-separated list if you prefer:
             * `pgJwtTypes: 'my_schema.my_jwt_type,my_schema."myOtherJwtType"'`
             */
            pgJwtTypes?: string | string[];
        }
        interface ScopeScalar {
            isPgJwtType?: boolean;
            pgCodec?: PgCodec;
        }
    }
    namespace GraphileConfig {
        interface Plugins {
            PgJWTPlugin: true;
        }
        interface GatherHelpers {
            pgJWT: Record<string, never>;
        }
    }
}
export declare const PgJWTPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PgJWTPlugin.d.ts.map