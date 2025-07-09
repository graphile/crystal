"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgRowByUniquePlugin = void 0;
const tslib_1 = require("tslib");
require("graphile-config");
const graphile_build_1 = require("graphile-build");
const tamedevil_1 = tslib_1.__importStar(require("tamedevil"));
const utils_js_1 = require("../utils.js");
const version_js_1 = require("../version.js");
exports.PgRowByUniquePlugin = {
    name: "PgRowByUniquePlugin",
    description: "Adds accessors for rows by their unique constraints (technically the @dataplan/pg resources' 'uniques' property)",
    version: version_js_1.version,
    inflection: {
        add: {
            rowByUnique(options, { unique, resource }) {
                if (typeof unique.extensions?.tags?.fieldName === "string") {
                    return unique.extensions?.tags?.fieldName;
                }
                const uniqueKeys = unique.attributes;
                return this.camelCase(
                // NOTE: If your schema uses the same codec for multiple resources,
                // you should probably change this to use the resource name.
                `${this.tableType(resource.codec)}-by-${this._joinAttributeNames(resource.codec, uniqueKeys)}`);
            },
        },
    },
    schema: {
        behaviorRegistry: {
            add: {
                "query:resource:single": {
                    entities: ["pgResourceUnique"],
                    description: "should we add a root level Query field to get just one record by this unique cosntraint?",
                },
            },
        },
        entityBehavior: {
            pgResourceUnique: "single",
        },
        hooks: {
            GraphQLObjectType_fields(fields, build, context) {
                const { graphql: { GraphQLNonNull, GraphQLObjectType }, } = build;
                const { scope: { isRootQuery }, fieldWithHooks, } = context;
                if (!isRootQuery) {
                    return fields;
                }
                const resources = Object.values(build.input.pgRegistry.pgResources).filter((resource) => {
                    if (resource.parameters)
                        return false;
                    if (!resource.codec.attributes)
                        return false;
                    if (!resource.uniques || resource.uniques.length < 1)
                        return false;
                    return true;
                });
                return resources.reduce((outerMemo, rawResource) => build.recoverable(outerMemo, () => rawResource.uniques.reduce((memo, unique) => {
                    const resource = rawResource;
                    const uniqueKeys = unique.attributes;
                    const fieldName = build.inflection.rowByUnique({
                        unique,
                        resource,
                    });
                    const type = build.getTypeByName(build.inflection.tableType(resource.codec));
                    if (!type || !(type instanceof GraphQLObjectType)) {
                        return memo;
                    }
                    const detailsByAttributeName = Object.create(null);
                    uniqueKeys.forEach((attributeName) => {
                        const attribute = resource.codec.attributes[attributeName];
                        const attributeArgName = build.inflection.attribute({
                            attributeName,
                            codec: resource.codec,
                        });
                        detailsByAttributeName[attributeName] = {
                            graphqlName: attributeArgName,
                            codec: attribute.codec,
                        };
                    });
                    const attributeNames = Object.keys(detailsByAttributeName);
                    const clean = attributeNames.every((key) => (0, tamedevil_1.isSafeObjectPropertyName)(key) &&
                        (0, tamedevil_1.isSafeObjectPropertyName)(detailsByAttributeName[key].graphqlName));
                    const plan = clean
                        ? /*
                           * Since all the identifiers are nice and clean we can use
                           * an optimized function that doesn't loop over the
                           * attributes and just builds the object directly.  This is
                           * more performant, but it also makes the code nicer to
                           * read in the exported code.
                           */
                            // TODO: Use `te.runExportable` instead and give the resource a name!
                            // eslint-disable-next-line graphile-export/exhaustive-deps
                            (0, graphile_build_1.EXPORTABLE)(tamedevil_1.default.run `\
return function (resource) {
  return (_$root, { ${tamedevil_1.default.join(attributeNames.map((attributeName) => tamedevil_1.default.identifier("$" + detailsByAttributeName[attributeName].graphqlName)), ", ")} }) => resource.get({ ${tamedevil_1.default.join(attributeNames.map((attributeName) => (0, tamedevil_1.default) `${tamedevil_1.default.safeKeyOrThrow(attributeName)}: ${tamedevil_1.default.identifier("$" + detailsByAttributeName[attributeName].graphqlName)}`), ", ")} });
}`, [resource])
                        : (0, graphile_build_1.EXPORTABLE)((detailsByAttributeName, resource) => function plan(_$root, args) {
                            const spec = Object.create(null);
                            for (const attributeName in detailsByAttributeName) {
                                spec[attributeName] = args.getRaw(detailsByAttributeName[attributeName]
                                    .graphqlName);
                            }
                            return resource.get(spec);
                        }, [detailsByAttributeName, resource]);
                    const fieldBehaviorScope = "query:resource:single";
                    if (!build.behavior.pgResourceUniqueMatches([resource, unique], fieldBehaviorScope)) {
                        return memo;
                    }
                    return build.extend(memo, {
                        [fieldName]: fieldWithHooks({
                            fieldName,
                            fieldBehaviorScope,
                        }, () => ({
                            description: `Get a single \`${type.name}\`.`,
                            deprecationReason: (0, utils_js_1.tagToString)(resource.extensions?.tags?.deprecated),
                            type,
                            args: uniqueKeys.reduce((args, attributeName) => {
                                const details = detailsByAttributeName[attributeName];
                                const attributeType = build.getGraphQLTypeByPgCodec(details.codec, "input");
                                if (!attributeType) {
                                    throw new Error(`Could not determine type for attribute`);
                                }
                                args[details.graphqlName] = {
                                    type: new GraphQLNonNull(attributeType),
                                };
                                return args;
                            }, Object.create(null)),
                            plan: plan,
                        })),
                    }, `Adding row accessor for ${resource} by unique attributes ${uniqueKeys.join(",")}`);
                }, outerMemo)), fields);
            },
        },
    },
};
//# sourceMappingURL=PgRowByUniquePlugin.js.map