import type { PluginFunction, Types } from "@graphql-codegen/plugin-helpers";
import type {
  GraphQLNamedType,
  GraphQLOutputType,
  GraphQLSchema,
} from "graphql";
import {
  isEnumType,
  isInputObjectType,
  isInterfaceType,
  isListType,
  isNonNullType,
  isObjectType,
  isScalarType,
  isSpecifiedScalarType,
  isUnionType,
} from "graphql";

export interface GrafastTypesPluginConfig {
  grafastModule?: string;
  overridesFile?: string;
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

  private get(
    type: GraphQLNamedType,
    property: "source" | "specifier",
    fallback: string = "Step",
  ) {
    return `Get<${JSON.stringify(type.name)}, ${JSON.stringify(property)}, ${fallback}>`;
  }

  private expect(type: GraphQLOutputType) {
    if (isNonNullType(type)) {
      return `NonNullStep<${this.expect(type.ofType)}>`;
    } else if (isListType(type)) {
      return `ListOfStep<${this.expect(type.ofType)}>`;
    } else {
      return `NullableStep<${this.get(type, "source")}>`;
    }
  }

  private getInterfacePlans(): string[] {
    const lines: string[] = [];
    for (const type of this.types) {
      if (!isInterfaceType(type)) continue;
      lines.push(`\
    ${type.name}?: InterfacePlan<
      ${this.get(type, "source")},
      ${this.get(type, "specifier", this.get(type, "source"))}
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
      ${this.get(type, "source")},
      ${this.get(type, "specifier", this.get(type, "source"))}
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
      lines.push(`    ${type.name}?: Omit<ObjectPlan<${this.get(type, "source")}>, 'fields'> & {
      fields?: {
${Object.entries(type.getFields())
  .map(
    ([fieldName, fieldSpec]) =>
      `        ${fieldName}?: FieldPlan<${this.get(type, "source")}, ${fieldSpec.args.length > 0 ? `${type.name}${fieldName[0].toUpperCase() + fieldName.substring(1)}Args` : `NoArguments`}, ${this.expect(fieldSpec.type)}>;`,
  )
  .join("\n")}
      }
    };`);
    }
    return lines;
  }

  private getInputObjectPlans(): string[] {
    const lines: string[] = [];
    for (const type of this.types) {
      if (!isInputObjectType(type)) continue;
      lines.push(`    ${type.name}?: Omit<InputObjectPlan, 'fields'> & {
      fields?: {
${Object.entries(type.getFields())
  .map(([fieldName, val]) => `        ${fieldName}?: InputFieldPlan<any, any>;`)
  .join("\n")}
      }
};`);
    }
    return lines;
  }

  public generate(): string {
    return (
      [
        "// Generated GraphQL SDK (auto-generated – do not edit)",
        "",
        `import type { EnumPlan, FieldPlan, InputFieldPlan, GrafastSchemaSpec, InputObjectPlan, InterfacePlan, ObjectPlan, ScalarPlan, Step, UnionPlan } from '${this.config.grafastModule ?? "grafast"}';`,
        `import { makeGrafastSchema } from '${this.config.grafastModule ?? "grafast"}';`,
        this.config.overridesFile
          ? `import type { Overrides } from '${this.config.overridesFile ?? "./grafastTypeOverrides.ts"}';`
          : `// Provide 'overridesFile' via your config to specify your own overrides.
type Overrides = {}`,
        "",
        `\
type NoArguments = Record<string, never>;
type NonNullStep<TStep extends Step> = TStep & Step<TStep extends Step<infer U> ? NonNullable<U> : any>;
type NullableStep<TStep extends Step> = TStep extends Step<infer U> ? Step<U | null | undefined> : TStep;
type ListOfStep<TStep extends Step> = TStep extends Step<infer U> ? Step<ReadonlyArray<U> | null | undefined> : TStep;

type Get<
  TTypeName extends string,
  TProp extends string,
  TFallback = any,
> = TTypeName extends keyof Overrides
  ? TProp extends keyof Overrides[TTypeName]
    ? NonNullable<Overrides[TTypeName][TProp]>
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
