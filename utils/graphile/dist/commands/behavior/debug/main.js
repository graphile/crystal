"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const graphile_config_1 = require("graphile-config");
const load_1 = require("graphile-config/load");
async function importGraphileBuild() {
    try {
        return await import("graphile-build");
    }
    catch {
        try {
            return await import("postgraphile/graphile-build");
        }
        catch (e) {
            throw new Error(`Failed to import both 'graphile-build' and 'postgraphile/graphile-build', please install this binary in the same location that you've installed graphile-build`);
        }
    }
}
async function main(options) {
    const { entityType, entityIdentifier, filterString } = options;
    const userPreset = await (0, load_1.loadConfig)(options.config);
    if (!userPreset) {
        console.error("Failed to load config, please check the file exists");
        process.exit(1);
    }
    const { buildInflection, gather, getBuilder } = await importGraphileBuild();
    const resolvedPreset = (0, graphile_config_1.resolvePreset)(userPreset);
    const inflection = buildInflection(resolvedPreset);
    const shared = { inflection };
    const input = await gather(resolvedPreset, shared);
    const builder = getBuilder(resolvedPreset, shared.inflection);
    const build = builder.createBuild(input);
    const entityTypes = [...build.behavior.behaviorEntityTypes].sort();
    if (!entityType) {
        return `No entity type was specified; please pick one of the supported entity types:\n${entityTypes
            .map((t) => `- ${t}`)
            .join("\n")}`;
    }
    function isValidEntityType(entityType) {
        return entityTypes.includes(entityType);
    }
    if (!isValidEntityType(entityType)) {
        return `Entity type '${entityType}' not known; known entity types:\n${entityTypes
            .map((t) => `- ${t}`)
            .join("\n")}`;
    }
    // Now find the entities
    const entities = getEntities(build, entityType);
    if (!entities) {
        return `Alas, this command does not yet support getting the entities for '${entityType}'`;
    }
    if (!entityIdentifier) {
        return `No entity identifier was specified; please pick one of the supported entities for entity type '${entityType}':\n${Object.keys(entities)
            .sort()
            .map((t) => `- ${t}`)
            .join("\n")}`;
    }
    const entity = entities[entityIdentifier];
    if (!entity) {
        return `Entity '${entityIdentifier}' doesn't seem to exist; please pick one of the supported entities for entity type '${entityType}':\n${Object.keys(entities)
            .sort()
            .map((t) => `- ${t}`)
            .join("\n")}`;
    }
    const behaviors = build.behavior.getBehaviorForEntity(entityType, entity);
    let path = "";
    let finalString = "";
    for (const entry of behaviors.stack) {
        if (!entry.prefix && !entry.suffix)
            continue;
        const prefix = entry.prefix.trim();
        const suffix = entry.suffix.trim();
        const { final: nextFinalString, highlighted } = debugAndSimplify(build, prefix, finalString, suffix, filterString);
        path += `
${chalk_1.default.whiteBright.underline(entry.source)}:
  ${highlighted}
`;
        finalString = nextFinalString;
    }
    const matchText = filterString
        ? build.behavior.stringMatches(finalString, filterString)
            ? chalk_1.default.whiteBright.bold(`Positive match`)
            : chalk_1.default.red.bold(`Negative match`)
        : null;
    return `\
${path}

${chalk_1.default.bold.whiteBright(`Final string:`)}
  ${finalString}
${matchText ? `\n` + matchText : ""}`;
}
function arraysMatch(a1, a2) {
    // FIXME: this logic doesn't respect `*` scopes.
    return a1.length === a2.length && a1.every((v, i) => a2[i] === v);
}
function debugAndSimplify(build, prefix, previous, suffix, filterString) {
    const sections = [
        build.behavior.parseBehaviorString(prefix),
        build.behavior.parseBehaviorString(previous),
        build.behavior.parseBehaviorString(suffix),
    ];
    const finalParts = [];
    const highlightedParts = [];
    const seen = [];
    function hasExisting(spec) {
        for (const otherSpec of seen) {
            if (otherSpec.length <= spec.length &&
                arraysMatch(otherSpec, spec.slice(spec.length - otherSpec.length))) {
                return true;
            }
        }
        return false;
    }
    for (let i = 2; i >= 0; i--) {
        const section = sections[i];
        for (let j = section.length - 1; j >= 0; j--) {
            const spec = section[j];
            const scopeString = `${spec.positive ? "" : "-"}${spec.scope.join(":")}`;
            const isOverridden = hasExisting(spec.scope);
            const isMatch = filterString
                ? build.behavior.stringMatches(spec.scope.join(":"), filterString)
                : false;
            const highlightedScopeStringBase = (i === 0 ? chalk_1.default.greenBright : i === 2 ? chalk_1.default.cyanBright : chalk_1.default.gray)(isOverridden ? chalk_1.default.strikethrough(scopeString) : scopeString);
            const highlightedScopeString = isMatch
                ? chalk_1.default.inverse(highlightedScopeStringBase)
                : highlightedScopeStringBase;
            if (isOverridden) {
                highlightedParts.push(highlightedScopeString);
                // DO NOT PUSH TO finalParts
            }
            else {
                highlightedParts.push(highlightedScopeString);
                finalParts.push(scopeString);
                seen.push(spec.scope);
            }
        }
    }
    return {
        final: finalParts.reverse().join(" "),
        highlighted: highlightedParts.reverse().join(" "),
    };
}
function getEntities(build, entityType) {
    const registry = build.input.pgRegistry;
    switch (entityType) {
        case "pgCodec": {
            return registry.pgCodecs;
        }
        case "pgCodecAttribute": {
            const memo = Object.create(null);
            for (const [codecName, codec] of Object.entries(registry.pgCodecs)) {
                if (!codec.attributes)
                    continue;
                for (const [attributeName, _attribute] of Object.entries(codec.attributes)) {
                    memo[`${codecName}.${attributeName}`] = [codec, attributeName];
                }
            }
            return memo;
        }
        case "pgCodecRelation": {
            const memo = Object.create(null);
            for (const [codecName, _codec] of Object.entries(registry.pgCodecs)) {
                const relations = registry.pgRelations[codecName];
                if (!relations)
                    continue;
                for (const [relationName, _relation] of Object.entries(relations)) {
                    memo[`${codecName}.${relationName}`] = _relation;
                }
            }
            return memo;
        }
        case "pgCodecRef": {
            const memo = Object.create(null);
            for (const [codecName, codec] of Object.entries(registry.pgCodecs)) {
                if (!codec.refs)
                    continue;
                for (const [refName, _ref] of Object.entries(codec.refs)) {
                    memo[`${codecName}.${refName}`] = [codec, refName];
                }
            }
            return memo;
        }
        case "pgResource": {
            return registry.pgResources;
        }
        case "pgResourceUnique": {
            const memo = Object.create(null);
            for (const [resourceName, resource] of Object.entries(registry.pgResources)) {
                if (!resource.uniques)
                    continue;
                for (let i = 0, l = resource.uniques.length; i < l; i++) {
                    const unique = resource.uniques[i];
                    memo[`${resourceName}.${i}`] = [resource, unique];
                }
            }
            return memo;
        }
    }
}
//# sourceMappingURL=main.js.map