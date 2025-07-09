"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAddPgTableConditionPlugin = makeAddPgTableConditionPlugin;
const pg_1 = require("@dataplan/pg");
const exportable_js_1 = require("./exportable.js");
function makeAddPgTableConditionPlugin(match, conditionFieldName, conditionFieldSpecGenerator, conditionGenerator) {
    const { serviceName = "main", schemaName, tableName } = match;
    const displayName = `makeAddPgTableConditionPlugin__${schemaName}__${tableName}__${conditionFieldName}`;
    const plugin = {
        name: displayName,
        version: "0.0.0",
        // Make sure we're loaded before PgConnectionArgOrderBy, otherwise
        // ordering added by conditions will be overridden by the default
        // ordering.
        before: ["PgConnectionArgOrderByPlugin"],
        schema: {
            hooks: {
                build(build) {
                    const meta = (build._pluginMeta[displayName] = Object.create(null));
                    meta.seen = false;
                    return build;
                },
                finalize(schema, build) {
                    const meta = build._pluginMeta[displayName];
                    if (!meta.seen) {
                        // eslint-disable-next-line no-console
                        console.error(`WARNING: failed to add condition '${conditionFieldName}' to table "${schemaName}"."${tableName}"; did you get the schema/table name right?`);
                    }
                    return schema;
                },
                GraphQLInputObjectType_fields(fields, build, context) {
                    const { sql } = build;
                    const { scope: { isPgCondition, pgCodec: table }, fieldWithHooks, } = context;
                    if (!isPgCondition ||
                        !table ||
                        !table.attributes ||
                        table.extensions?.pg?.serviceName !== serviceName ||
                        table.extensions?.pg?.schemaName !== schemaName ||
                        table.extensions?.pg?.name !== tableName) {
                        return fields;
                    }
                    const conditionFieldSpec = conditionFieldSpecGenerator(build);
                    if (conditionFieldSpec.apply ||
                        conditionFieldSpec.extensions?.grafast?.apply) {
                        if (conditionGenerator) {
                            throw new Error(`${displayName}: You supplied 'apply' for your field spec, so you cannot also supply a 'conditionGenerator'`);
                        }
                        // Done.
                    }
                    else {
                        if (!conditionGenerator) {
                            throw new Error(`${displayName}: You have not supplied 'applyPlan' for your field spec, nor a 'conditionGenerator', so we don't know what to do with this condition`);
                        }
                        // build applyPlan
                        conditionFieldSpec.apply = (0, exportable_js_1.EXPORTABLE)((build, conditionGenerator, sql, sqlValueWithCodec) => function apply(condition, val) {
                            const expression = conditionGenerator(val, {
                                sql,
                                sqlTableAlias: condition.alias,
                                sqlValueWithCodec,
                                build,
                                condition,
                            });
                            if (expression) {
                                condition.where(expression);
                            }
                        }, [build, conditionGenerator, sql, pg_1.sqlValueWithCodec]);
                    }
                    const meta = build._pluginMeta[displayName];
                    meta.seen = true;
                    return build.extend(fields, {
                        [conditionFieldName]: fieldWithHooks({
                            fieldName: conditionFieldName,
                        }, conditionFieldSpec),
                    }, `Adding condition from ${displayName}`);
                },
            },
        },
    };
    return plugin;
}
//# sourceMappingURL=makeAddPgTableConditionPlugin.js.map