import chalk from "chalk";
import type {} from "postgraphile";
import { resolvePresets } from "graphile-config";
import { loadConfig } from "graphile-config/load";
import { PgRegistry } from "@dataplan/pg";
import { inspect } from "util";

export async function main(options: {
  config?: string;
  entityType?: string;
  entityIdentifier?: string;
}) {
  const { entityType, entityIdentifier } = options;
  const userPreset = await loadConfig(options.config);
  if (!userPreset) {
    console.error("Failed to load config, please check the file exists");
    process.exit(1);
  }
  const { buildInflection, gather, getBuilder } = await import(
    "graphile-build"
  );
  const resolvedPreset = resolvePresets([userPreset]);
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
  function isValidEntityType(
    entityType: string,
  ): entityType is typeof entityTypes extends (infer U)[] ? U : never {
    return entityTypes.includes(entityType as any);
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
    return `No entity identifier was specified; please pick one of the supported entities for entity type '${entityType}':\n${Object.keys(
      entities,
    )
      .sort()
      .map((t) => `- ${t}`)
      .join("\n")}`;
  }
  const entity = entities[entityIdentifier];
  if (!entity) {
    return `Entity '${entityIdentifier}' doesn't seem to exist; please pick one of the supported entities for entity type '${entityType}':\n${Object.keys(
      entities,
    )
      .sort()
      .map((t) => `- ${t}`)
      .join("\n")}`;
  }

  const behaviors = build.behavior.getBehaviorForEntity(entityType, entity);
  let path = "";
  let finalString = "";
  for (const entry of behaviors.stack) {
    const prefix = entry.prefix.trim();
    const suffix = entry.suffix.trim();
    const nextFinalString = `${prefix} ${finalString} ${suffix}`.trim();
    if (nextFinalString === finalString) continue;

    path += `
${chalk.whiteBright.underline(entry.source)}:
  ${chalk.greenBright(prefix)} ${chalk.grey(finalString)} ${chalk.cyanBright(
      suffix,
    )}
`;

    finalString = nextFinalString;
  }

  return path;
}

function getEntities(
  build: GraphileBuild.Build,
  entityType: keyof GraphileBuild.BehaviorEntities,
) {
  const registry = build.input.pgRegistry as PgRegistry;
  switch (entityType) {
    case "pgCodec": {
      return registry.pgCodecs;
    }
    case "pgCodecAttribute": {
      const memo = Object.create(null);
      for (const [codecName, codec] of Object.entries(registry.pgCodecs)) {
        if (!codec.attributes) continue;
        for (const [attributeName, attribute] of Object.entries(
          codec.attributes,
        )) {
          memo[`${codecName}.${attributeName}`] = [codec, attributeName];
        }
      }
      return memo;
    }
    case "pgCodecRelation": {
      const memo = Object.create(null);
      for (const [codecName, codec] of Object.entries(registry.pgCodecs)) {
        const relations = registry.pgRelations[codecName];
        if (!relations) continue;
        for (const [relationName, relation] of Object.entries(relations)) {
          memo[`${codecName}.${relationName}`] = [codec, relationName];
        }
      }
      return memo;
    }
    case "pgCodecRef": {
      const memo = Object.create(null);
      for (const [codecName, codec] of Object.entries(registry.pgCodecs)) {
        if (!codec.refs) continue;
        for (const [refName, ref] of Object.entries(codec.refs)) {
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
      for (const [resourceName, resource] of Object.entries(
        registry.pgResources,
      )) {
        if (!resource.uniques) continue;
        for (let i = 0, l = resource.uniques.length; i < l; i++) {
          const unique = resource.uniques[i];
          memo[`${resourceName}.${i}`] = unique;
        }
      }
      return memo;
    }
  }
}
