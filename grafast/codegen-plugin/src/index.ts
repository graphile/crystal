import type { PluginFunction, Types } from "@graphql-codegen/plugin-helpers";
import type {
  GraphQLInputType,
  GraphQLNamedType,
  GraphQLOutputType,
  GraphQLSchema,
} from "graphql";
import {
  getNullableType,
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
      .types.filter(
        (t) => !t.name.startsWith("__") && !isSpecifiedScalarType(t),
      );
  }

  private _get(
    type: GraphQLNamedType,
    property: "nullable" | "source" | "specifier",
    fallback = "Step",
  ) {
    return `Get<${JSON.stringify(type.name)}, ${JSON.stringify(property)}, ${fallback}>`;
  }

  private nullable(type: GraphQLNamedType) {
    return this._get(type, "nullable");
  }
  private source(type: GraphQLNamedType) {
    return this._get(
      type,
      "source",
      `NonNullStep<${this._get(type, "nullable")}>`,
    );
  }
  private specifier(type: GraphQLNamedType) {
    return this._get(type, "specifier", this.source(type));
  }

  private expect(type: GraphQLOutputType): string {
    if (isNonNullType(type)) {
      return `NonNullStep<${this.expect(type.ofType)}>`;
    } else if (isListType(type)) {
      return `ListOfStep<${this.expect(type.ofType)}>`;
    } else {
      return this.nullable(type);
    }
  }

  private getInterfacePlans(): string[] {
    const lines: string[] = [];
    for (const type of this.types) {
      if (!isInterfaceType(type)) continue;
      lines.push(`\
    ${type.name}?: InterfacePlan<
      ${this.source(type)},
      ${this.specifier(type)}
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
      ${this.source(type)},
      ${this.specifier(type)}
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
      lines.push(`    ${type.name}?: Omit<EnumPlan, 'values'> & {
      values?: {
${type
  .getValues()
  .map((v) => `        ${v.name}?: EnumValueInput;`)
  .join("\n")}
      }
    };`);
    }
    return lines;
  }

  private getObjectPlans(): string[] {
    const lines: string[] = [];
    for (const type of this.types) {
      if (!isObjectType(type)) continue;
      lines.push(`    ${type.name}?: Omit<ObjectPlan<${this.source(type)}>, 'plans'> & {
      plans?: {
${Object.entries(type.getFields())
  .map(
    ([fieldName, fieldSpec]) =>
      `        ${fieldName}?: FieldPlan<${this.source(type)}, ${fieldSpec.args.length > 0 ? `${type.name}${fieldName[0].toUpperCase() + fieldName.substring(1)}Args` : `NoArguments`}, ${this.expect(fieldSpec.type)}>;`,
  )
  .join("\n")}
      }
    };`);
    }
    return lines;
  }

  private getInputType(t: GraphQLInputType): string {
    const nn = isNonNullType(t);
    const nullable = getNullableType(t);
    const inner = isListType(nullable)
      ? `ReadonlyArray<${this.getInputType(nullable.ofType)}>`
      : isScalarType(nullable)
        ? `Scalars['${nullable.name}']`
        : nullable.name;
    if (nn) {
      return inner;
    } else {
      return `Maybe<${inner}>`;
    }
  }
  private getInputObjectPlans(): string[] {
    const lines: string[] = [];
    for (const type of this.types) {
      if (!isInputObjectType(type)) continue;
      lines.push(`    ${type.name}?: Omit<InputObjectPlan, 'plans'> & {
      plans?: {
${Object.entries(type.getFields())
  .map(
    ([fieldName, field]) =>
      `        ${fieldName}?: InputFieldPlan<any, ${this.getInputType(field.type)}>;`,
  )
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
        `import type { EnumPlan, EnumValueInput, FieldPlan, InputFieldPlan, GrafastSchemaConfig, InputObjectPlan, InterfacePlan, ObjectPlan, ScalarPlan, Step, UnionPlan } from '${this.config.grafastModule ?? "grafast"}';`,
        `import { makeGrafastSchema } from '${this.config.grafastModule ?? "grafast"}';`,
        this.config.overridesFile
          ? `import type { Overrides } from '${this.config.overridesFile ?? "./grafastTypeOverrides.ts"}';`
          : `// Provide 'overridesFile' via your config to specify your own overrides.
type Overrides = {}`,
        "",
        `\
type NoArguments = Record<string, never>;
type NonNullStep<TStep extends Step> = TStep & Step<TStep extends Step<infer U> ? NonNullable<U> : any>;
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
        `export interface TypedGrafastSchemaSpec extends Omit<GrafastSchemaConfig, 'objects' | 'interfaces' | 'unions' | 'inputObjects' | 'scalars' | 'enums'> {`,

        `  objects?: {`,
        ...this.getObjectPlans(),
        `  }`,
        `  interfaces?: {`,
        ...this.getInterfacePlans(),
        `  }`,
        `  unions?: {`,
        ...this.getUnionPlans(),
        `  }`,
        `  inputObjects?: {`,
        ...this.getInputObjectPlans(),
        `  }`,
        `  scalars?: {`,
        ...this.getScalarPlans(),
        `  }`,
        `  enums?: {`,
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
