"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgJWTPlugin = void 0;
require("graphile-config");
const graphile_build_1 = require("graphile-build");
const jsonwebtoken_1 = require("jsonwebtoken");
const utils_js_1 = require("../utils.js");
const version_js_1 = require("../version.js");
const EMPTY_OBJECT = Object.freeze({});
function getPgJwtTypeDigests(options) {
    const digests = [];
    if (Array.isArray(options.pgJwtType)) {
        digests.push(options.pgJwtType);
    }
    else if (typeof options.pgJwtType === "string") {
        const tuples = (0, utils_js_1.parseDatabaseIdentifiers)(options.pgJwtType, 2, "public");
        digests.push(...tuples);
    }
    if (typeof options.pgJwtTypes === "string") {
        const tuples = (0, utils_js_1.parseDatabaseIdentifiers)(options.pgJwtTypes, 2, "public");
        digests.push(...tuples);
    }
    if (Array.isArray(options.pgJwtTypes)) {
        const tuples = options.pgJwtTypes.map((type) => (0, utils_js_1.parseDatabaseIdentifier)(type, 2, "public"));
        digests.push(...tuples);
    }
    return digests;
}
exports.PgJWTPlugin = {
    name: "PgJWTPlugin",
    description: "Converts a Postgres JWT object type into a GraphQL scalar type containing a signed JWT",
    version: version_js_1.version,
    before: ["PgCodecsPlugin", "PgTablesPlugin"],
    gather: (0, graphile_build_1.gatherConfig)({
        namespace: "pgJWT",
        initialCache() {
            return EMPTY_OBJECT;
        },
        initialState() {
            return EMPTY_OBJECT;
        },
        helpers: {},
        hooks: {
            pgCodecs_PgCodec(info, { pgCodec, pgType }) {
                const pgJwtTypeDigests = getPgJwtTypeDigests(info.options);
                if (pgJwtTypeDigests.some(([nsp, typ]) => typ === pgType.typname && nsp === pgType.getNamespace().nspname)) {
                    // It's a JWT type!
                    pgCodec.extensions ||= Object.create(null);
                    pgCodec.extensions.tags ||= Object.create(null);
                    // TODO: the -table should be achieved via behavior dependencies
                    // (i.e. `jwt` automatically disables `table`)
                    pgCodec.extensions.tags.behavior = ["-table", "jwt"];
                }
            },
        },
    }),
    schema: {
        behaviorRegistry: {
            add: {
                jwt: {
                    description: "Does this codec represent a JWT?",
                    entities: ["pgCodec"],
                },
            },
        },
        hooks: {
            init(_, build) {
                const { options: { pgJwtSecret, pgJwtSignOptions }, } = build;
                const jwtCodec = [...build.pgCodecMetaLookup.keys()].find((codec) => build.behavior.pgCodecMatches(codec, "jwt"));
                if (!jwtCodec || !pgJwtSecret) {
                    return _;
                }
                if (!jwtCodec.attributes) {
                    throw new Error(`JWT codec '${jwtCodec.name}' found, but it does not appear to have any attributes. Please check your configuration, the JWT type should be a composite type.`);
                }
                const jwtTypeName = build.inflection.tableType(jwtCodec);
                const attributeNames = Object.keys(jwtCodec.attributes);
                build.registerScalarType(jwtTypeName, {
                    isPgJwtType: true,
                    pgCodec: jwtCodec,
                }, () => ({
                    description: build.wrapDescription("A JSON Web Token defined by [RFC 7519](https://tools.ietf.org/html/rfc7519) which securely represents claims between two parties.", "type"),
                    serialize: (0, graphile_build_1.EXPORTABLE)((attributeNames, pgJwtSecret, pgJwtSignOptions, signJwt) => function serialize(value) {
                        const token = attributeNames.reduce((memo, attributeName) => {
                            if (attributeName === "exp") {
                                memo[attributeName] = value[attributeName]
                                    ? parseFloat(value[attributeName])
                                    : undefined;
                            }
                            else {
                                memo[attributeName] = value[attributeName];
                            }
                            return memo;
                        }, {});
                        const options = Object.assign(Object.create(null), pgJwtSignOptions, token.aud || (pgJwtSignOptions && pgJwtSignOptions.audience)
                            ? null
                            : {
                                audience: "postgraphile",
                            }, token.iss || (pgJwtSignOptions && pgJwtSignOptions.issuer)
                            ? null
                            : {
                                issuer: "postgraphile",
                            }, token.exp ||
                            (pgJwtSignOptions && pgJwtSignOptions.expiresIn)
                            ? null
                            : {
                                expiresIn: "1 day",
                            });
                        return signJwt(token, pgJwtSecret, options);
                    }, [attributeNames, pgJwtSecret, pgJwtSignOptions, jsonwebtoken_1.sign]),
                    extensions: {
                        grafast: {
                            plan: (0, graphile_build_1.EXPORTABLE)(() => function plan($in) {
                                const $record = $in;
                                return $record.record();
                            }, []),
                        },
                    },
                }), "JWT scalar from PgJWTPlugin");
                build.setGraphQLTypeForPgCodec(jwtCodec, "output", jwtTypeName);
                return _;
            },
        },
    },
};
//# sourceMappingURL=PgJWTPlugin.js.map