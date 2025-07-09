"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAddPgTableOrderByPlugin = makeAddPgTableOrderByPlugin;
exports.orderByAscDesc = orderByAscDesc;
const exportable_js_1 = require("./exportable.js");
const counterByName = new Map();
function makeAddPgTableOrderByPlugin(match, ordersGenerator, hint = `Adding orders with makeAddPgTableOrderByPlugin to "${match.schemaName}"."${match.tableName}"`) {
    const { serviceName = "main", schemaName, tableName } = match;
    const baseDisplayName = `makeAddPgTableOrderByPlugin_${schemaName}_${tableName}`;
    let counter = counterByName.get(baseDisplayName);
    if (!counter) {
        counter = 0;
    }
    counter++;
    counterByName.set(baseDisplayName, counter);
    const displayName = counter === 1 ? baseDisplayName : `${baseDisplayName}_${counter}`;
    const plugin = {
        name: displayName,
        version: "0.0.0",
        schema: {
            hooks: {
                GraphQLEnumType_values(values, build, context) {
                    const { extend } = build;
                    const { scope: { isPgRowSortEnum, pgCodec: table }, } = context;
                    if (!isPgRowSortEnum ||
                        !table ||
                        !table.attributes ||
                        table.extensions?.pg?.serviceName !== serviceName ||
                        table.extensions?.pg?.schemaName !== schemaName ||
                        table.extensions?.pg?.name !== tableName) {
                        return values;
                    }
                    const newValues = ordersGenerator(build);
                    return extend(values, newValues, hint);
                },
            },
        },
    };
    return plugin;
}
function orderByAscDesc(baseName, attributeOrSqlFragment, uniqueOrOptions = false) {
    const options = typeof uniqueOrOptions === "boolean"
        ? { unique: uniqueOrOptions }
        : (uniqueOrOptions ?? {});
    const { unique = false, nulls, nullable = nulls != null } = options;
    if (typeof unique !== "boolean") {
        throw new Error(`Invalid value for "unique" passed to orderByAscDesc for ${baseName}. Unique must be a boolean.`);
    }
    const isValidNullsOption = [
        "first",
        "last",
        "first-iff-ascending",
        "last-iff-ascending",
        undefined,
    ].includes(nulls);
    if (!isValidNullsOption) {
        throw new Error(`Invalid value for "nulls" passed to orderByAscDesc for ${baseName}. Nulls must be sorted by one of: undefined | "first" | "last" | "first-iff-ascending" | "last-iff-ascending".`);
    }
    const ascendingNulls = typeof nulls === "undefined"
        ? undefined
        : ["first", "first-iff-ascending"].includes(nulls)
            ? "FIRST"
            : "LAST";
    const descendingNulls = typeof nulls === "undefined"
        ? undefined
        : ["first", "last-iff-ascending"].includes(nulls)
            ? "FIRST"
            : "LAST";
    let spec;
    const ascendingCb = typeof attributeOrSqlFragment === "string"
        ? (0, exportable_js_1.EXPORTABLE)((ascendingNulls, attributeOrSqlFragment, nullable, unique) => function apply(queryBuilder) {
            queryBuilder.orderBy({
                nulls: ascendingNulls,
                attribute: attributeOrSqlFragment,
                direction: "ASC",
                nullable,
            });
            if (unique) {
                queryBuilder.setOrderIsUnique();
            }
        }, [ascendingNulls, attributeOrSqlFragment, nullable, unique])
        : typeof attributeOrSqlFragment === "function"
            ? (0, exportable_js_1.EXPORTABLE)((ascendingNulls, attributeOrSqlFragment, nullable, unique) => function apply(queryBuilder) {
                queryBuilder.orderBy({
                    nulls: ascendingNulls,
                    ...attributeOrSqlFragment(queryBuilder),
                    direction: "ASC",
                    nullable,
                });
                if (unique) {
                    queryBuilder.setOrderIsUnique();
                }
            }, [ascendingNulls, attributeOrSqlFragment, nullable, unique])
            : ((spec = {
                nulls: ascendingNulls,
                ...attributeOrSqlFragment,
                direction: "ASC",
                nullable,
            }),
                (0, exportable_js_1.EXPORTABLE)((spec, unique) => function apply(queryBuilder) {
                    queryBuilder.orderBy(spec);
                    if (unique) {
                        queryBuilder.setOrderIsUnique();
                    }
                }, [spec, unique]));
    const descendingCb = typeof attributeOrSqlFragment === "string"
        ? (0, exportable_js_1.EXPORTABLE)((attributeOrSqlFragment, descendingNulls, nullable, unique) => function apply(queryBuilder) {
            queryBuilder.orderBy({
                nulls: descendingNulls,
                attribute: attributeOrSqlFragment,
                direction: "DESC",
                nullable,
            });
            if (unique) {
                queryBuilder.setOrderIsUnique();
            }
        }, [attributeOrSqlFragment, descendingNulls, nullable, unique])
        : typeof attributeOrSqlFragment === "function"
            ? (0, exportable_js_1.EXPORTABLE)((attributeOrSqlFragment, descendingNulls, nullable, unique) => function apply(queryBuilder) {
                queryBuilder.orderBy({
                    nulls: descendingNulls,
                    ...attributeOrSqlFragment(queryBuilder),
                    direction: "DESC",
                    nullable,
                });
                if (unique) {
                    queryBuilder.setOrderIsUnique();
                }
            }, [attributeOrSqlFragment, descendingNulls, nullable, unique])
            : ((spec = {
                nulls: descendingNulls,
                ...attributeOrSqlFragment,
                direction: "DESC",
                nullable,
            }),
                (0, exportable_js_1.EXPORTABLE)((spec, unique) => function apply(queryBuilder) {
                    queryBuilder.orderBy(spec);
                    if (unique) {
                        queryBuilder.setOrderIsUnique();
                    }
                }, [spec, unique]));
    const orders = {
        [`${baseName}_ASC`]: {
            extensions: {
                grafast: {
                    apply: ascendingCb,
                },
            },
        },
        [`${baseName}_DESC`]: {
            extensions: {
                grafast: {
                    apply: descendingCb,
                },
            },
        },
    };
    return orders;
}
//# sourceMappingURL=makeAddPgTableOrderByPlugin.js.map