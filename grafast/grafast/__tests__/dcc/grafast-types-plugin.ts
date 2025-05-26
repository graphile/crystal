import type { PluginFunction, Types } from "@graphql-codegen/plugin-helpers";
import type { GraphQLNamedType, GraphQLSchema } from "graphql";
import {
  isEnumType,
  isInputObjectType,
  isInterfaceType,
  isObjectType,
  isScalarType,
  isSpecifiedScalarType,
  isUnionType,
} from "graphql";

export interface GrafastTypesPluginConfig {
  grafastModule?: string;
  overridesFile: string;
}

class GrafastGenerator {
  private schema: GraphQLSchema;
  private config: GrafastTypesPluginConfig;
  private types: ReadonlyArray<GraphQLNamedType>;

  constructor(
    schema: GraphQLSchema,
    _documents: Types.DocumentFile[],
    config: GrafastTypesPluginConfig,
  ) {
    this.schema = schema;
    this.config = config;
    this.types = this.schema
      .toConfig()
      .types.filter((t) => !t.name.startsWith("__"));
  }

  private getInterfacePlans(): string[] {
    const lines: string[] = [];
    for (const type of this.types) {
      if (!isInterfaceType(type)) continue;
      lines.push(`\
    ${type.name}?: InterfacePlan<
      Get<Overrides, ${JSON.stringify(type.name)}, "source", Step>,
      Get<Overrides, ${JSON.stringify(type.name)}, "specifier", Get<Overrides, ${JSON.stringify(type.name)}, "source", Step>>
    >;`);
    }
    return lines;
  }

  private getUnionPlans(): string[] {
    const lines: string[] = [];
    for (const type of this.types) {
      if (!isUnionType(type)) continue;
      lines.push(`\
    ${type.name}?: UnionPlan<
      Get<Overrides, ${JSON.stringify(type.name)}, "source", Step>,
      Get<Overrides, ${JSON.stringify(type.name)}, "specifier", Get<Overrides, ${JSON.stringify(type.name)}, "source", Step>>
    >;`);
    }
    return lines;
  }

  private getScalarPlans(): string[] {
    const lines: string[] = [];
    for (const type of this.types) {
      if (!isScalarType(type) && !isSpecifiedScalarType(type)) continue;
      lines.push(`    ${type.name}?: ScalarPlan;`);
    }
    return lines;
  }

  private getEnumPlans(): string[] {
    const lines: string[] = [];
    for (const type of this.types) {
      if (!isEnumType(type)) continue;
      lines.push(`    ${type.name}?: EnumPlan;`);
    }
    return lines;
  }

  private getObjectPlans(): string[] {
    const lines: string[] = [];
    for (const type of this.types) {
      if (!isObjectType(type)) continue;
      lines.push(`    ${type.name}?: ObjectPlan;`);
    }
    return lines;
  }

  private getInputObjectPlans(): string[] {
    const lines: string[] = [];
    for (const type of this.types) {
      if (!isInputObjectType(type)) continue;
      lines.push(`    ${type.name}?: InputObjectPlan;`);
    }
    return lines;
  }

  public generate(): string {
    return (
      [
        "// Generated GraphQL SDK (auto-generated – do not edit)",
        "",
        `import type { AbstractTypePlanner, EnumPlan, FieldArgs, GrafastSchemaSpec, InputObjectPlan, InterfacePlan, ObjectPlan, ScalarPlan, Step, UnionPlan } from '${this.config.grafastModule ?? "grafast"}';`,
        `import { makeGrafastSchema } from '${this.config.grafastModule ?? "grafast"}';`,
        this.config.overridesFile
          ? `import type { Overrides } from '${this.config.overridesFile ?? "./grafastTypeOverrides.ts"}';`
          : `// Provide 'overridesFile' via your config to specify your own overrides.
type Overrides = {}`,
        "",
        `\
type Get<
  TOverrides extends { [typeName: string]: { source?: Step } },
  TTypeName extends string,
  TProp extends string,
  TFallback = any,
> = TTypeName extends keyof TOverrides
  ? TProp extends keyof TOverrides[TTypeName]
    ? NonNullable<TOverrides[TTypeName][TProp]>
    : TFallback
  : TFallback;`,
        "",
        `export interface TypedGrafastSchemaSpec extends Omit<GrafastSchemaSpec, 'objectPlans' | 'interfacePlans' | 'unionPlans' | 'inputObjectPlans' | 'scalarPlans' | 'enumPlans'> {`,

        `  objectPlans?: {`,
        ...this.getObjectPlans(),
        `  }`,
        `  interfacePlans?: {`,
        ...this.getInterfacePlans(),
        `  }`,
        `  unionPlans?: {`,
        ...this.getUnionPlans(),
        `  }`,
        `  inputObjectPlans?: {`,
        ...this.getInputObjectPlans(),
        `  }`,
        `  scalarPlans?: {`,
        ...this.getScalarPlans(),
        `  }`,
        `  enumPlans?: {`,
        ...this.getEnumPlans(),
        `  }`,

        `};`,
        "",
        `export function typedMakeGrafastSchema(spec: TypedGrafastSchemaSpec) {
  return makeGrafastSchema(spec);
}`,
      ].join("\n") + "\n"
    );
  }
}

export const plugin: PluginFunction<GrafastTypesPluginConfig> = (
  schema,
  documents,
  config = {},
) => {
  const generator = new GrafastGenerator(schema, documents, config);
  return generator.generate();
};
