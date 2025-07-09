"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsFilePlugin = exports.makePgSmartTagsFromFilePlugin = void 0;
exports.makePgSmartTagsPlugin = makePgSmartTagsPlugin;
exports.pgSmartTagRulesFromJSON = pgSmartTagRulesFromJSON;
exports.makeJSONPgSmartTagsPlugin = makeJSONPgSmartTagsPlugin;
const tslib_1 = require("tslib");
const node_fs_1 = require("node:fs");
const promises_1 = require("node:fs/promises");
const node_util_1 = require("node:util");
const graphile_build_1 = require("graphile-build");
const json5_1 = tslib_1.__importDefault(require("json5"));
const parseIdentifierParts_js_1 = require("./parseIdentifierParts.js");
const meaningByKind = {
    ["class"]: "for tables, composite types, views and materialized views",
    ["attribute"]: "for columns/attributes (of any 'class' type)",
    ["constraint"]: "for table constraints",
    ["procedure"]: "for functions/procedures",
    ["type"]: "for types",
    ["namespace"]: "for schemas",
};
const validKinds = Object.entries(meaningByKind)
    .map(([kind, meaning]) => `'${kind}' (${meaning})`)
    .join(", ");
function compileRule(rule) {
    const { kind, match: incomingMatch, ...rest } = rule;
    if (!Object.prototype.hasOwnProperty.call(meaningByKind, kind)) {
        throw new Error(`makePgSmartTagsPlugin rule has invalid kind '${kind}'; valid kinds are: ${validKinds}`);
    }
    const match = (obj) => {
        if (typeof incomingMatch === "function") {
            // User supplied a match function; delegate to that:
            return incomingMatch(obj);
        }
        else if (typeof incomingMatch === "string") {
            const parts = (0, parseIdentifierParts_js_1.parseIdentifierParts)(incomingMatch);
            switch (rule.kind) {
                case "class": {
                    const rel = obj;
                    if (parts.length === 0)
                        return true;
                    const tableName = parts.pop();
                    if (rel.relname !== tableName)
                        return false;
                    else if (parts.length === 0)
                        return true;
                    const schemaName = parts.pop();
                    const nsp = rel.getNamespace();
                    if (nsp.nspname !== schemaName)
                        return false;
                    else if (parts.length === 0)
                        return true;
                    throw new Error(`Too many parts for a table name '${incomingMatch}'`);
                }
                case "attribute": {
                    const attr = obj;
                    if (parts.length === 0)
                        return true;
                    const colName = parts.pop();
                    if (attr.attname !== colName)
                        return false;
                    else if (parts.length === 0)
                        return true;
                    const tableName = parts.pop();
                    const rel = attr.getClass();
                    if (rel.relname !== tableName)
                        return false;
                    else if (parts.length === 0)
                        return true;
                    const schemaName = parts.pop();
                    const nsp = rel.getNamespace();
                    if (nsp.nspname !== schemaName)
                        return false;
                    else if (parts.length === 0)
                        return true;
                    throw new Error(`Too many parts for a attribute name '${incomingMatch}'`);
                }
                case "constraint": {
                    const con = obj;
                    if (parts.length === 0)
                        return true;
                    const conName = parts.pop();
                    if (con.conname !== conName)
                        return false;
                    else if (parts.length === 0)
                        return true;
                    const tableName = parts.pop();
                    const rel = con.getClass();
                    if (rel.relname !== tableName)
                        return false;
                    else if (parts.length === 0)
                        return true;
                    const schemaName = parts.pop();
                    const nsp = rel.getNamespace();
                    if (nsp.nspname !== schemaName)
                        return false;
                    else if (parts.length === 0)
                        return true;
                    throw new Error(`Too many parts for a constraint name '${incomingMatch}'`);
                }
                case "procedure": {
                    const proc = obj;
                    if (parts.length === 0)
                        return true;
                    const procName = parts.pop();
                    if (proc.proname !== procName)
                        return false;
                    else if (parts.length === 0)
                        return true;
                    const schemaName = parts.pop();
                    const nsp = proc.getNamespace();
                    if (nsp.nspname !== schemaName)
                        return false;
                    else if (parts.length === 0)
                        return true;
                    throw new Error(`Too many parts for a proc name '${incomingMatch}'`);
                }
                case "type": {
                    const type = obj;
                    if (parts.length === 0)
                        return true;
                    const typeName = parts.pop();
                    if (type.typname !== typeName)
                        return false;
                    else if (parts.length === 0)
                        return true;
                    const schemaName = parts.pop();
                    const nsp = type.getNamespace();
                    if (nsp.nspname !== schemaName)
                        return false;
                    else if (parts.length === 0)
                        return true;
                    throw new Error(`Too many parts for a type name '${incomingMatch}'`);
                }
                case "namespace": {
                    const nsp = obj;
                    if (parts.length === 0)
                        return true;
                    const schemaName = parts.pop();
                    if (nsp.nspname !== schemaName)
                        return false;
                    else if (parts.length === 0)
                        return true;
                    throw new Error(`Too many parts for a namespace name '${incomingMatch}'`);
                }
                default: {
                    const never = rule.kind;
                    throw new Error(`Unknown kind '${never}'`);
                }
            }
        }
        else {
            throw new Error("makePgSmartTagsPlugin rule 'match' is neither a string nor a function");
        }
    };
    return {
        kind,
        match,
        ...rest,
    };
}
function rulesFrom(ruleOrRules) {
    const rawRules = Array.isArray(ruleOrRules)
        ? ruleOrRules
        : ruleOrRules
            ? [ruleOrRules]
            : [];
    return [rawRules.map(compileRule), rawRules];
}
async function resolveRules(initialRules) {
    const resolved = await (typeof initialRules === "function"
        ? initialRules()
        : initialRules);
    return Array.isArray(resolved) ? resolved : resolved ? [resolved] : [];
}
let counter = 0;
function makePgSmartTagsPlugin(initialRules, subscribeToUpdatesCallback, details) {
    const id = ++counter;
    return {
        name: details?.name ?? `PgSmartTagsPlugin_${id}`,
        description: details?.description,
        version: details?.version ?? "0.0.0",
        before: ["smart-tags"],
        gather: (0, graphile_build_1.gatherConfig)({
            namespace: `pgSmartTags_${id}` /* Cannot make type safe because dynamic */,
            helpers: {},
            initialCache() {
                return { rulesPromise: resolveRules(initialRules) };
            },
            async initialState(cache) {
                return {
                    rules: await cache.rulesPromise,
                };
            },
            hooks: {
                // Run in the 'introspection' phase before anything uses the tags
                pgIntrospection_introspection(info, event) {
                    const { introspection, serviceName } = event;
                    const [rules, rawRules] = rulesFrom(info.state.rules);
                    rules.forEach((rule, idx) => {
                        if (rule.serviceName != null && rule.serviceName !== serviceName) {
                            return;
                        }
                        const relevantIntrospectionResults = (() => {
                            switch (rule.kind) {
                                case "class":
                                    return introspection.classes;
                                case "attribute":
                                    return introspection.attributes;
                                case "constraint":
                                    return introspection.constraints;
                                case "procedure":
                                    return introspection.procs;
                                case "type":
                                    return introspection.types;
                                case "namespace":
                                    return introspection.namespaces;
                                default: {
                                    const never = rule.kind;
                                    throw new Error(`Unhandled kind ${never}`);
                                }
                            }
                        })();
                        let hits = 0;
                        relevantIntrospectionResults.forEach((entity) => {
                            if (!rule.match(entity)) {
                                return;
                            }
                            hits++;
                            // Note the code here relies on the fact that `getTagsAndDescription`
                            // memoizes because it mutates the return result; if this changes then
                            // the code will no longer achieve its goal.
                            const obj = entity.getTagsAndDescription();
                            if (rule.tags) {
                                // Overwrite relevant tags
                                Object.assign(obj.tags, rule.tags);
                            }
                            if (rule.description != null) {
                                // Overwrite comment if specified
                                obj.description = rule.description;
                            }
                        });
                        // Let people know if their rules don't match; it's probably a mistake.
                        if (hits === 0) {
                            console.warn(`WARNING: there were no matches for makePgSmartTagsPlugin rule ${idx} - ${(0, node_util_1.inspect)(rawRules[idx])}`);
                        }
                    });
                },
            },
            ...(subscribeToUpdatesCallback
                ? {
                    async watch(info, callback) {
                        await subscribeToUpdatesCallback((newRuleOrRules) => {
                            const promise = resolveRules(newRuleOrRules);
                            promise.then(() => {
                                info.cache.rulesPromise = promise;
                                callback();
                            }, (e) => {
                                console.error(`Error occurred during makePgSmartTagsPlugin watch mode: `, e);
                            });
                        });
                        return () => subscribeToUpdatesCallback(null);
                    },
                }
                : null),
        }),
    };
}
function pgSmartTagRulesFromJSON(json) {
    if (!json) {
        return [];
    }
    if (json.version !== 1) {
        throw new Error('This version of graphile-utils only supports the version 1 smart tags JSON format; e.g. `{version: 1, config: { class: { my_table: { tags: { omit: "create,update,delete" } } } } }`');
    }
    const specByIdentifierByKind = json.config;
    const rules = [];
    function processEntity(kind, identifier, subKind, obj, key = subKind, deprecated = false) {
        if (kind !== "class") {
            throw new Error(`makeJSONPgSmartTagsPlugin: '${key}' is only valid on a class; you tried to set it on a '${kind}' at 'config.${kind}.${identifier}.${key}'`);
        }
        const path = `config.${kind}.${identifier}.${key}`;
        if (deprecated) {
            console.warn(`Tags JSON path '${path}' is deprecated, please use 'config.${kind}.${identifier}.attribute' instead`);
        }
        if (typeof obj !== "object" || obj == null) {
            throw new Error(`Invalid value for '${path}'`);
        }
        const entities = obj;
        for (const entityName of Object.keys(entities)) {
            if (entityName.includes(".")) {
                throw new Error(`${key} '${entityName}' should not contain a period at '${path}'. This nested entry does not need further description.`);
            }
            const entitySpec = entities[entityName];
            const { tags: entityTags, description: entityDescription, ...entityRest } = entitySpec;
            if (Object.keys(entityRest).length > 0) {
                console.warn(`WARNING: makeJSONPgSmartTagsPlugin '${key}' only supports 'tags' and 'description' currently, you have also set '${Object.keys(entityRest).join("', '")}' at '${path}.${entityName}'. Perhaps you forgot to add a "tags" entry containing these keys?`);
            }
            rules.push({
                kind: subKind,
                match: `${identifier}.${entityName}`,
                tags: entityTags,
                description: entityDescription,
            });
        }
    }
    for (const rawKind of Object.keys(specByIdentifierByKind)) {
        if (!Object.prototype.hasOwnProperty.call(meaningByKind, rawKind)) {
            throw new Error(`makeJSONPgSmartTagsPlugin JSON rule has invalid kind '${rawKind}'; valid kinds are: ${validKinds}`);
        }
        const kind = rawKind;
        const specByIdentifier = specByIdentifierByKind[kind];
        if (specByIdentifier) {
            for (const identifier of Object.keys(specByIdentifier)) {
                const spec = specByIdentifier[identifier];
                const { tags, description, attribute, constraint, ...rest } = spec;
                if (Object.keys(rest).length > 0) {
                    console.warn(`WARNING: makeJSONPgSmartTagsPlugin identifier spec only supports 'tags', 'description', 'attribute' and 'constraint' currently, you have also set '${Object.keys(rest).join("', '")}' at 'config.${kind}.${identifier}'`);
                }
                rules.push({
                    kind,
                    match: identifier,
                    tags,
                    description,
                });
                if (attribute) {
                    processEntity(kind, identifier, "attribute", attribute);
                }
                if (constraint) {
                    processEntity(kind, identifier, "constraint", constraint);
                }
            }
        }
    }
    return rules;
}
function makeJSONPgSmartTagsPlugin(jsonOrThunk, subscribeToJSONUpdatesCallback, details) {
    // Get rules from JSON
    // Wrap listener callback with JSON conversion
    const subscribeToUpdatesCallback = subscribeToJSONUpdatesCallback
        ? (cb) => {
            if (!cb) {
                return subscribeToJSONUpdatesCallback(cb);
            }
            else {
                return subscribeToJSONUpdatesCallback((json) => {
                    try {
                        const rules = pgSmartTagRulesFromJSON(json);
                        return cb(rules);
                    }
                    catch (e) {
                        console.error(e);
                    }
                });
            }
        }
        : null;
    return makePgSmartTagsPlugin(async () => {
        const json = await (typeof jsonOrThunk === "function"
            ? jsonOrThunk()
            : jsonOrThunk);
        return pgSmartTagRulesFromJSON(json);
    }, subscribeToUpdatesCallback, details);
}
const makePgSmartTagsFromFilePlugin = (tagsFile = process.cwd() + "/postgraphile.tags.json5", name) => {
    /*
     * We're wrapping the `smartTagsPlugin` defined below with a plugin wrapper
     * so that any errors from reading the smart tags file are thrown when the
     * plugin is *loaded* rather than from when it is defined.
     */
    function handleTagsError(err) {
        console.error(`Failed to process smart tags file '${tagsFile}': ${err.message}`);
    }
    let tagsListener = null;
    const plugin = makeJSONPgSmartTagsPlugin(async () => {
        const contents = await (0, promises_1.readFile)(tagsFile, "utf8");
        return json5_1.default.parse(contents);
    }, (updateJSON) => {
        if (tagsListener) {
            (0, node_fs_1.unwatchFile)(tagsFile, tagsListener);
            tagsListener = null;
        }
        if (updateJSON) {
            tagsListener = (_current, _previous) => {
                (0, promises_1.readFile)(tagsFile, "utf8").then((data) => {
                    try {
                        updateJSON(json5_1.default.parse(data));
                    }
                    catch (e) {
                        handleTagsError(e);
                    }
                }, (err) => {
                    if (err["code"] === "ENOENT") {
                        updateJSON(null);
                    }
                    else {
                        handleTagsError(err);
                    }
                });
            };
            (0, node_fs_1.watchFile)(tagsFile, { interval: 507 }, tagsListener);
        }
    }, {
        name,
        description: `Loads smart tags from '${tagsFile}' if it exists`,
    });
    return plugin;
};
exports.makePgSmartTagsFromFilePlugin = makePgSmartTagsFromFilePlugin;
exports.TagsFilePlugin = (0, exports.makePgSmartTagsFromFilePlugin)(undefined, "TagsFilePlugin");
//# sourceMappingURL=makePgSmartTagsPlugin.js.map