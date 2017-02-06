"use strict";
var utils_1 = require("../../utils");
var graphql_1 = require("graphql");
var values_1 = require("graphql/execution/values");
var QUERY = "QUERY";
var SQL_EXPRESSION = "SQL_EXPRESSION";
function getFieldsFromResolveInfo(resolveInfo, aliasIdentifier, rawTargetGqlType) {
    var targetGqlType = stripNonNullType(rawTargetGqlType);
    var parentGqlType = resolveInfo.parentType, variableValues = resolveInfo.variableValues, fragments = resolveInfo.fragments, schema = resolveInfo.schema;
    var fieldNodes = resolveInfo.fieldNodes || resolveInfo.fieldASTs;
    var fields = {};
    // ensure primary keys are present, otherwise PgCollectionKey cannot sort the rows back out again!
    if (targetGqlType._fields && targetGqlType._fields.__id) {
        targetGqlType._fields.__id.externalFieldNameDependencies.forEach(function (externalFieldName) {
            fields[externalFieldName] = {
                type: QUERY,
                query: (_a = ["", ".", ""], _a.raw = ["", ".", ""], utils_1.sql.query(_a, utils_1.sql.identifier(aliasIdentifier), utils_1.sql.identifier(externalFieldName))),
            };
            var _a;
        });
    }
    // Parse the AST for fields we need to fetch
    fieldNodes.forEach(function (queryAST) {
        parseASTIntoFields(fields, aliasIdentifier, schema, targetGqlType, fragments, variableValues, parentGqlType, queryAST);
    });
    return fields;
}
exports.getFieldsFromResolveInfo = getFieldsFromResolveInfo;
function getSelectFragmentFromFields(fields, aliasIdentifier) {
    var buildArgs = [];
    for (var k in fields) {
        var field = fields[k];
        var arg = {
            QUERY: function (field) { return field.query; },
            SQL_EXPRESSION: function (field) {
                return field.sqlExpression(field.aliasIdentifier, field.fieldName, field.args, field.resolveInfo);
            },
        }[field.type](field);
        buildArgs.push(utils_1.sql.literal(k), arg);
    }
    if (buildArgs.length === 0) {
        return (_a = ["to_json(", ")"], _a.raw = ["to_json(", ")"], utils_1.sql.query(_a, utils_1.sql.identifier(aliasIdentifier)));
    }
    else {
        return (_b = ["json_build_object(", ")"], _b.raw = ["json_build_object(", ")"], utils_1.sql.query(_b, utils_1.sql.join(buildArgs, ', ')));
    }
    var _a, _b;
}
exports.getSelectFragmentFromFields = getSelectFragmentFromFields;
function getSelectFragment(resolveInfo, aliasIdentifier, targetGqlType) {
    if (!resolveInfo) {
        throw new Error("No resolve info!");
    }
    return getSelectFragmentFromFields(getFieldsFromResolveInfo(resolveInfo, aliasIdentifier, targetGqlType), aliasIdentifier);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getSelectFragment;
function parseASTIntoFields(fields, aliasIdentifier, schema, targetGqlType, fragments, variableValues, parentGqlType, queryAST) {
    if (queryAST.kind === 'Field') {
        if (queryAST.name.value.startsWith("__") && queryAST.name.value !== "__id") {
            // Introspection related
            return;
        }
        var fieldName = queryAST.name.value;
        var field = getFieldFromAST(queryAST, parentGqlType);
        var fieldGqlType_1 = stripNonNullType(field.type);
        if (parentGqlType === targetGqlType) {
            var args = values_1.getArgumentValues(field, queryAST, variableValues);
            var alias = queryAST.alias && queryAST.alias.value;
            if (field.externalFieldNameDependencies) {
                field.externalFieldNameDependencies.forEach(function (externalFieldName) {
                    fields[externalFieldName] = {
                        type: QUERY,
                        query: (_a = ["", ".", ""], _a.raw = ["", ".", ""], utils_1.sql.query(_a, utils_1.sql.identifier(aliasIdentifier), utils_1.sql.identifier(externalFieldName))),
                    };
                    var _a;
                });
            }
            if (field.externalFieldName) {
                var sourceName = field.sourceName ? field.sourceName(aliasIdentifier, fieldName, args, alias) : field.externalFieldName;
                fields[sourceName] = {
                    type: QUERY,
                    query: (_a = ["", ".", ""], _a.raw = ["", ".", ""], utils_1.sql.query(_a, utils_1.sql.identifier(aliasIdentifier), utils_1.sql.identifier(field.externalFieldName))),
                };
                return;
            }
            else if (field.sqlExpression) {
                var sourceName = field.sourceName ? field.sourceName(aliasIdentifier, fieldName, args, alias) : fieldName;
                // XXX: is this sufficient?
                var resolveInfo = {
                    parentType: fieldGqlType_1,
                    variableValues: variableValues,
                    fragments: fragments,
                    schema: schema,
                    fieldASTs: queryAST.selectionSet ? queryAST.selectionSet.selections.slice() : [],
                };
                if (fields[sourceName]) {
                    var existingEntry = fields[sourceName];
                    for (var k in resolveInfo) {
                        if (Object.prototype.hasOwnProperty.call(resolveInfo, k) && k !== 'fieldASTs' && (existingEntry.resolveInfo[k] !== resolveInfo[k])) {
                            throw new Error("Inconsistency detected " + k);
                        }
                    }
                    if (existingEntry.sqlExpression !== field.sqlExpression
                        || existingEntry.aliasIdentifier !== aliasIdentifier
                        || existingEntry.fieldName !== fieldName) {
                        throw new Error("Inconsistency detected!");
                    }
                    (_b = existingEntry.resolveInfo.fieldASTs).push.apply(_b, resolveInfo.fieldASTs);
                }
                else {
                    fields[sourceName] = {
                        type: SQL_EXPRESSION,
                        sqlExpression: field.sqlExpression,
                        aliasIdentifier: aliasIdentifier,
                        fieldName: fieldName,
                        args: args,
                        resolveInfo: resolveInfo,
                    };
                }
                return;
            }
        }
        // Not a child of targetGqlType, but maybe we're the type itself; or related to it?
        if (!isRelated(targetGqlType, fieldGqlType_1)) {
            // Not related so stop
            return;
        }
        // It is related, so continue through it's selection sets
        queryAST.selectionSet && queryAST.selectionSet.selections.forEach(function (ast) {
            parseASTIntoFields(fields, aliasIdentifier, schema, targetGqlType, fragments, variableValues, stripNonNullType(stripListType(fieldGqlType_1)), ast);
        });
    }
    else if (queryAST.kind === 'InlineFragment') {
        if (queryAST.typeCondition) {
            processFragment(queryAST);
        }
        else {
            queryAST.selectionSet && queryAST.selectionSet.selections.forEach(function (selection) { return parseASTIntoFields(fields, aliasIdentifier, schema, targetGqlType, fragments, variableValues, parentGqlType, selection); });
        }
    }
    else if (queryAST.kind === 'FragmentSpread') {
        var fieldName = queryAST.name.value;
        var fragmentName = fieldName;
        var fragment = fragments[fragmentName];
        processFragment(fragment);
    }
    else if (queryAST.kind === 'FragmentDefinition') {
        processFragment(queryAST);
    }
    else {
        throw new Error(queryAST.kind + " not supported");
    }
    function processFragment(fragment) {
        var fragmentGqlType = stripNonNullType(graphql_1.typeFromAST(schema, fragment.typeCondition));
        if (isRelated(targetGqlType, fragmentGqlType)) {
            if (fragment.selectionSet) {
                fragment.selectionSet.selections.forEach(function (selection) { return parseASTIntoFields(fields, aliasIdentifier, schema, targetGqlType, fragments, variableValues, fragmentGqlType, selection); });
            }
        }
    }
    var _a, _b;
}
function getFieldFromAST(ast, parentGqlType) {
    if (ast.kind === 'Field') {
        var fieldName = ast.name.value;
        return parentGqlType._fields[fieldName];
    }
    return;
}
function isRelated(targetGqlType, rawOtherType) {
    // Think about interfaces?
    // const interfaceType = targetGqlType._interfaces && targetGqlType._interfaces.map(iface => iface.name).indexOf(fragmentNameOfType) >= 0
    var otherType = stripNonNullType(stripListType(stripNonNullType(rawOtherType)));
    var otherRelatedType = (otherType.constructor.name === 'GraphQLObjectType') && otherType._typeConfig.relatedGqlType;
    var types = [
        otherType,
        otherRelatedType && stripNonNullType(otherRelatedType),
    ].filter(function (_) { return _; });
    return types.some(function (type) { return type === targetGqlType || type.name === 'Node'; });
}
function stripNonNullType(type) {
    return type.constructor.name === 'GraphQLNonNull' ? type.ofType : type;
}
function stripListType(type) {
    return type.constructor.name === 'GraphQLList' ? type.ofType : type;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0U2VsZWN0RnJhZ21lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L3BhZ2luYXRvci9nZXRTZWxlY3RGcmFnbWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUNBQWlDO0FBQ2pDLG1DQUFxQztBQUNyQyxtREFBNEQ7QUFFNUQsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFBO0FBQ3JCLElBQU0sY0FBYyxHQUFHLGdCQUFnQixDQUFBO0FBRXZDLGtDQUF5QyxXQUFXLEVBQUUsZUFBZSxFQUFFLGdCQUFnQjtJQUNyRixJQUFNLGFBQWEsR0FBRyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0lBQ2pELElBQUEsc0NBQXlCLEVBQUUsMkNBQWMsRUFBRSxpQ0FBUyxFQUFFLDJCQUFNLENBQWU7SUFDbEYsSUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLFVBQVUsSUFBSSxXQUFXLENBQUMsU0FBUyxDQUFBO0lBQ2xFLElBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQTtJQUNqQixrR0FBa0c7SUFDbEcsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLE9BQU8sSUFBSSxhQUFhLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDeEQsYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsT0FBTyxDQUM5RCxVQUFBLGlCQUFpQjtZQUNmLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHO2dCQUMxQixJQUFJLEVBQUUsS0FBSztnQkFDWCxLQUFLLGlDQUFXLEVBQUcsRUFBK0IsR0FBSSxFQUFpQyxFQUFFLEdBQWxGLFdBQUcsQ0FBQyxLQUFLLEtBQUcsV0FBRyxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsRUFBSSxXQUFHLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLEVBQUU7YUFDMUYsQ0FBQTs7UUFDSCxDQUFDLENBQ0YsQ0FBQTtJQUNI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