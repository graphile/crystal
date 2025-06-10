import type {
  AbstractTypePlanner,
  DeprecatedObjectPlan,
  GrafastSchemaConfig,
  ObjectFieldConfig,
  ObjectPlan as GrafastObjectPlan,
  PlanTypeInfo,
  Step,
} from "grafast";
import type {
  DirectiveDefinitionNode,
  DirectiveLocation,
  // Nodes:
  DirectiveNode,
  DocumentNode,
  EnumTypeDefinitionNode,
  EnumValueDefinitionNode,
  FieldDefinitionNode,
  GraphQLArgumentConfig,
  GraphQLDirective,
  GraphQLEnumType,
  // Config:
  GraphQLEnumValueConfigMap,
  GraphQLFieldConfigMap,
  // Resolvers:
  GraphQLFieldResolver,
  GraphQLInputFieldConfigMap,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  // ONLY import types here, not values
  // Misc:
  GraphQLIsTypeOfFn,
  GraphQLNamedOutputType,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLObjectTypeExtensions,
  GraphQLOutputType,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
  // Union types:
  GraphQLType,
  GraphQLTypeResolver,
  GraphQLUnionType,
  InputObjectTypeDefinitionNode,
  InputObjectTypeExtensionNode,
  InputValueDefinitionNode,
  InterfaceTypeDefinitionNode,
  InterfaceTypeExtensionNode,
  NamedTypeNode,
  NameNode,
  ObjectTypeDefinitionNode,
  ObjectTypeExtensionNode,
  ScalarTypeDefinitionNode,
  StringValueNode,
  TypeNode,
  UnionTypeDefinitionNode,
  ValueNode,
} from "grafast/graphql";
import type { GraphileBuild } from "graphile-build";

import { EXPORTABLE } from "./exportable.js";

type Maybe<T> = T | null | undefined;

export type ObjectResolver<TSource = any, TContext = any> = {
  [key: string]: GraphQLFieldResolver<TSource, TContext> | ObjectFieldConfig;
} & {
  __resolveType?: GraphQLTypeResolver<TSource, TContext>;
  __isTypeOf?: GraphQLIsTypeOfFn<TSource, TContext>;
};

export interface ObjectPlan<TSource extends Step = Step>
  extends GrafastObjectPlan<TSource> {
  __scope?: GraphileBuild.ScopeObject;
}

export type EnumResolver = {
  __scope?: GraphileBuild.ScopeEnum;
} & {
  [key: string]: string | number | Array<any> | Record<string, any> | symbol;
};

export interface TypeResolver {
  __resolveType?: GraphQLTypeResolver<any, any>;
  __toSpecifier?($step: Step): Step;
  __planType?($specifier: Step, info: PlanTypeInfo): AbstractTypePlanner;
  __scope?: GraphileBuild.ScopeUnion | GraphileBuild.ScopeInterface;
}

export interface InputObjectResolver {
  __scope?: GraphileBuild.ScopeInputObject;
}

/** @deprecated Use objects/scalars/etc instead */
export interface Resolvers {
  [typeName: string]:
    | ObjectResolver
    | EnumResolver
    | TypeResolver
    | InputObjectResolver
    | GraphQLScalarType
    | (GraphQLScalarTypeConfig<any, any> & {
        __scope?: GraphileBuild.ScopeScalar;
      });
}

/** @deprecated Use objects/scalars/etc instead */
export interface Plans {
  [typeName: string]:
    | (DeprecatedObjectPlan & { __scope?: GraphileBuild.ScopeObject })
    | (EnumResolver & { __scope?: GraphileBuild.ScopeEnum })
    | (GraphQLScalarType & { __scope?: GraphileBuild.ScopeScalar })
    | (Omit<GraphQLScalarTypeConfig<any, any>, "name"> & {
        __scope?: GraphileBuild.ScopeScalar;
      });
}

export interface ExtensionDefinition
  extends Pick<
    GrafastSchemaConfig,
    | "typeDefs"
    | "plans"
    | "scalars"
    | "enums"
    | "objects"
    | "unions"
    | "interfaces"
    | "inputObjects"
  > {
  /** @deprecated Use 'plans' instead */
  resolvers?: Resolvers;
}

type ParentConstructors<T> = { new (...args: any[]): T };

type NewTypeDef =
  | {
      type: ParentConstructors<GraphQLObjectType>;
      definition: ObjectTypeDefinitionNode;
    }
  | {
      type: ParentConstructors<GraphQLInputObjectType>;
      definition: InputObjectTypeDefinitionNode;
    }
  | {
      type: ParentConstructors<GraphQLInterfaceType>;
      definition: InterfaceTypeDefinitionNode;
    }
  | {
      type: ParentConstructors<GraphQLUnionType>;
      definition: UnionTypeDefinitionNode;
    }
  | {
      type: ParentConstructors<GraphQLScalarType>;
      definition: ScalarTypeDefinitionNode;
    }
  | {
      type: ParentConstructors<GraphQLEnumType>;
      definition: EnumTypeDefinitionNode;
    }
  | {
      type: typeof GraphQLDirective;
      definition: DirectiveDefinitionNode;
    };

interface TypeExtensions {
  GraphQLSchema: {
    directives: Array<any>;
    types: Array<any>;
  };
  GraphQLInputObjectType: {
    [name: string]: InputObjectTypeExtensionNode[];
  };
  GraphQLObjectType: {
    [name: string]: ObjectTypeExtensionNode[];
  };
  GraphQLInterfaceType: {
    [name: string]: InterfaceTypeExtensionNode[];
  };
}

declare global {
  namespace GraphileBuild {
    interface Build {
      makeExtendSchemaPlugin: {
        [uniquePluginName: string]: {
          typeExtensions: any;
          newTypes: Array<NewTypeDef>;
          resolvers: Resolvers;
          plans: Plans;
        };
      };
    }
  }
}

export function extendSchema(
  generator:
    | ExtensionDefinition
    | ((build: GraphileBuild.Build) => ExtensionDefinition),
  uniquePluginName = `ExtendSchemaPlugin_${String(Math.random()).slice(2)}`,
): GraphileConfig.Plugin {
  let graphql: GraphileBuild.Build["graphql"];
  if (typeof generator === "function" && generator.length >= 2) {
    console.trace(
      "[DEPRECATED] Your makeExtendSchemaPlugin generator callback accepts two arguments: `(build, options)`; instead you should just use the `build` argument since `options` is just `build.options`.",
    );
  }

  return {
    name: uniquePluginName,
    version: "0.0.0",
    schema: {
      hooks: {
        build(build) {
          // Extract GraphQL into the scope so that our other functions can use it.
          graphql = build.graphql;

          if (!build.makeExtendSchemaPlugin) {
            build.makeExtendSchemaPlugin = Object.create(null);
          }

          return build;
        },

        init(_, build, _context) {
          const {
            GraphQLDirective,
            GraphQLEnumType,
            GraphQLError,
            GraphQLInputObjectType,
            GraphQLInterfaceType,
            GraphQLObjectType,
            GraphQLScalarType,
            GraphQLUnionType,
            Kind,
            parse,
          } = graphql;

          const {
            typeDefs,
            resolvers = Object.create(null),
            plans: rawPlans,
            enums,
            scalars,
            inputObjects,
            interfaces,
            unions,
            objects,
          } = typeof generator === "function"
            ? generator.length === 1
              ? generator(build)
              : /* TODO: DELETE THIS! */
                ((generator as any)(
                  build,
                  build.options,
                ) as ExtensionDefinition)
            : generator;

          if (typeDefs == null) {
            throw new Error(
              "The first argument to makeExtendSchemaPlugin must be an object containing a `typeDefs` field.",
            );
          }
          const document: DocumentNode =
            typeof typeDefs === "string"
              ? parse(typeDefs)
              : Array.isArray(typeDefs)
                ? {
                    kind: graphql.Kind.DOCUMENT,
                    definitions: typeDefs.flatMap((t) => {
                      if (!t || t.kind !== "Document") {
                        throw new Error(
                          'The first argument to makeExtendSchemaPlugin must be an object containing a `typeDefs` field; the value for this field must be generated by the `gql` helper (`import { gql, makeExtendSchemaPlugin } from "postgraphile/utils"`), or be an array of the same.',
                        );
                      }
                      return t.definitions;
                    }),
                  }
                : typeDefs;
          if (!document || document.kind !== "Document") {
            throw new Error(
              'The first argument to makeExtendSchemaPlugin must be an object containing a `typeDefs` field; the value for this field must be generated by the `gql` helper (`import { gql, makeExtendSchemaPlugin } from "postgraphile/utils"`), or be an array of the same.',
            );
          }

          const typeExtensions: TypeExtensions = {
            GraphQLSchema: {
              directives: [] as Array<any>,
              types: [] as Array<any>,
            },
            GraphQLInputObjectType: {},
            GraphQLObjectType: {},
            GraphQLInterfaceType: {},
          };
          const newTypes: Array<NewTypeDef> = [];
          document.definitions.forEach((definition) => {
            if (definition.kind === "EnumTypeDefinition") {
              newTypes.push({
                type: GraphQLEnumType,
                definition,
              });
            } else if (definition.kind === "ObjectTypeExtension") {
              const name = getName(definition.name);
              if (!typeExtensions.GraphQLObjectType[name]) {
                typeExtensions.GraphQLObjectType[name] = [];
              }
              typeExtensions.GraphQLObjectType[name].push(definition);
            } else if (definition.kind === "InputObjectTypeExtension") {
              const name = getName(definition.name);
              if (!typeExtensions.GraphQLInputObjectType[name]) {
                typeExtensions.GraphQLInputObjectType[name] = [];
              }
              typeExtensions.GraphQLInputObjectType[name].push(definition);
            } else if (definition.kind === "InterfaceTypeExtension") {
              const name = getName(definition.name);
              if (!typeExtensions.GraphQLInterfaceType[name]) {
                typeExtensions.GraphQLInterfaceType[name] = [];
              }
              typeExtensions.GraphQLInterfaceType[name].push(definition);
            } else if (definition.kind === "ObjectTypeDefinition") {
              newTypes.push({
                type: GraphQLObjectType,
                definition,
              });
            } else if (definition.kind === "InputObjectTypeDefinition") {
              newTypes.push({
                type: GraphQLInputObjectType,
                definition,
              });
            } else if (definition.kind === "UnionTypeDefinition") {
              newTypes.push({
                type: GraphQLUnionType,
                definition,
              });
            } else if (definition.kind === "InterfaceTypeDefinition") {
              newTypes.push({
                type: GraphQLInterfaceType,
                definition,
              });
            } else if (definition.kind === "DirectiveDefinition") {
              newTypes.push({
                type: GraphQLDirective,
                definition,
              });
            } else if (definition.kind === "ScalarTypeDefinition") {
              newTypes.push({
                type: GraphQLScalarType,
                definition,
              });
            } else {
              if ((definition.kind as any) === "TypeExtensionDefinition") {
                throw new Error(
                  `You appear to be using a GraphQL version prior to v0.12.0 which has different syntax for schema extensions (e.g. 'TypeExtensionDefinition' instead of 'ObjectTypeExtension'). Sadly makeExtendSchemaPlugin does not support versions of graphql prior to 0.12.0, please update your version of graphql.`,
                );
              }
              throw new Error(
                `Unexpected '${definition.kind}' definition; we were expecting 'GraphQLEnumType', 'ObjectTypeExtension', 'InputObjectTypeExtension', 'ObjectTypeDefinition' or 'InputObjectTypeDefinition', i.e. something like 'extend type Foo { ... }'`,
              );
            }
          });

          let plans: Plans;
          if (rawPlans) {
            if (
              objects ||
              unions ||
              interfaces ||
              inputObjects ||
              scalars ||
              enums
            ) {
              throw new Error(
                `plans is deprecated and may not be specified alongside newer approaches`,
              );
            }
            plans = rawPlans;
          } else {
            // Hackily convert the new format into the old format. We'll do away with
            // this in future, but for now it's the easiest way to ensure compatibility
            plans = {};
            const definitionNodes = document.definitions.filter(
              (d) =>
                d.kind === Kind.OBJECT_TYPE_DEFINITION ||
                d.kind === Kind.INTERFACE_TYPE_DEFINITION ||
                d.kind === Kind.UNION_TYPE_DEFINITION ||
                d.kind === Kind.INPUT_OBJECT_TYPE_DEFINITION ||
                d.kind === Kind.ENUM_TYPE_DEFINITION ||
                d.kind === Kind.SCALAR_TYPE_DEFINITION ||
                d.kind === Kind.OBJECT_TYPE_EXTENSION ||
                d.kind === Kind.INTERFACE_TYPE_EXTENSION ||
                d.kind === Kind.UNION_TYPE_EXTENSION ||
                d.kind === Kind.INPUT_OBJECT_TYPE_EXTENSION ||
                d.kind === Kind.ENUM_TYPE_EXTENSION ||
                d.kind === Kind.SCALAR_TYPE_EXTENSION,
            );

            const assertLocation = <
              TExpected extends
                | "objects"
                | "unions"
                | "interfaces"
                | "inputObjects"
                | "scalars"
                | "enums",
            >(
              typeName: string,
              expectedLocation: TExpected,
            ): ReadonlyArray<string> => {
              const nodes = definitionNodes.filter(
                (n) => n.name.value === typeName,
              );
              const node = nodes[0];
              if (!node) {
                throw new Error(
                  `You detailed '${expectedLocation}.${typeName}', but the '${typeName}' type is not defined or extended in your 'typeDefs'.`,
                );
              }
              const [description, attr, names = []] = (() => {
                if (
                  node.kind === Kind.OBJECT_TYPE_EXTENSION ||
                  node.kind === Kind.OBJECT_TYPE_DEFINITION
                ) {
                  return [
                    "an object type",
                    "objects",
                    (nodes as Array<typeof node>)
                      .flatMap((n) => n.fields?.map((f) => f.name.value))
                      .filter(isNotNullish),
                  ] as const;
                } else if (
                  node.kind === Kind.INTERFACE_TYPE_EXTENSION ||
                  node.kind === Kind.INTERFACE_TYPE_DEFINITION
                ) {
                  return ["an interface type", "interfaces"] as const;
                } else if (
                  node.kind === Kind.UNION_TYPE_EXTENSION ||
                  node.kind === Kind.UNION_TYPE_DEFINITION
                ) {
                  return ["a union type", "unions"] as const;
                } else if (
                  node.kind === Kind.INPUT_OBJECT_TYPE_EXTENSION ||
                  node.kind === Kind.INPUT_OBJECT_TYPE_DEFINITION
                ) {
                  return [
                    "an input object type",
                    "inputObjects",
                    (nodes as Array<typeof node>)
                      .flatMap((n) => n.fields?.map((f) => f.name.value))
                      .filter(isNotNullish),
                  ] as const;
                } else if (
                  node.kind === Kind.SCALAR_TYPE_EXTENSION ||
                  node.kind === Kind.SCALAR_TYPE_DEFINITION
                ) {
                  return ["a scalar type", "scalars"] as const;
                } else if (
                  node.kind === Kind.ENUM_TYPE_EXTENSION ||
                  node.kind === Kind.ENUM_TYPE_DEFINITION
                ) {
                  return [
                    "an enum type",
                    "enums",
                    (nodes as Array<typeof node>)
                      .flatMap((n) => n.values?.map((f) => f.name.value))
                      .filter(isNotNullish),
                  ] as const;
                } else {
                  throw new Error(`Type ${typeName} not understood`);
                }
              })();
              if (expectedLocation !== attr) {
                throw new Error(
                  `You defined '${typeName}' under '${expectedLocation}', but it is ${description} so it should be defined under '${attr}'.`,
                );
              }
              return names;
            };

            for (const [typeName, spec] of Object.entries(objects ?? {})) {
              const fields = assertLocation(typeName, "objects");
              const o = {} as Record<string, any>;
              plans[typeName] = o as any;

              const { plans: planResolvers = {}, ...rest } = spec;
              for (const [key, val] of Object.entries(rest)) {
                o[`__${key}`] = val;
              }
              for (const [key, val] of Object.entries(planResolvers)) {
                if (!fields.includes(key)) {
                  throw new Error(
                    `Object type '${typeName}' field '${key}' was not defined in this plugin.`,
                  );
                }
                o[key] = val;
              }
            }

            for (const [typeName, spec] of Object.entries(inputObjects ?? {})) {
              const fields = assertLocation(typeName, "inputObjects");
              const o = {} as Record<string, any>;
              plans[typeName] = o as any;

              const { plans: planResolvers = {}, ...rest } = spec;
              for (const [key, val] of Object.entries(rest)) {
                o[`__${key}`] = val;
              }
              for (const [key, val] of Object.entries(planResolvers)) {
                if (!fields.includes(key)) {
                  throw new Error(
                    `Input object type '${typeName}' field '${key}' was not defined in this plugin.`,
                  );
                }
                o[key] = val;
              }
            }

            for (const [typeName, spec] of Object.entries(unions ?? {})) {
              assertLocation(typeName, "unions");
              const o = {} as Record<string, any>;
              plans[typeName] = o as any;

              for (const [key, val] of Object.entries(spec)) {
                o[`__${key}`] = val;
              }
            }

            for (const [typeName, spec] of Object.entries(interfaces ?? {})) {
              assertLocation(typeName, "interfaces");
              const o = {} as Record<string, any>;
              plans[typeName] = o as any;

              for (const [key, val] of Object.entries(spec)) {
                o[`__${key}`] = val;
              }
            }

            for (const [typeName, spec] of Object.entries(scalars ?? {})) {
              assertLocation(typeName, "scalars");
              plans[typeName] = spec;
            }

            for (const [typeName, spec] of Object.entries(enums ?? {})) {
              const enumValues = assertLocation(typeName, "enums");
              const o = {} as Record<string, any>;
              plans[typeName] = o as any;

              const { values = {}, ...rest } = spec;
              if ("plans" in rest) {
                throw new Error(
                  `Enum type '${typeName}' cannot have field plans, please use 'values'.`,
                );
              }
              for (const [key, val] of Object.entries(rest)) {
                o[`__${key}`] = val;
              }
              for (const [key, val] of Object.entries(values)) {
                if (!enumValues.includes(key)) {
                  throw new Error(
                    `Enum type '${typeName}' value '${key}' was not defined in this plugin.`,
                  );
                }
                o[key] = val;
              }
            }
          }

          build.makeExtendSchemaPlugin![uniquePluginName] = {
            typeExtensions,
            newTypes,
            resolvers,
            plans,
          };

          newTypes.forEach((def: NewTypeDef) => {
            if (def.type === GraphQLEnumType) {
              const definition = def.definition as EnumTypeDefinitionNode;
              // https://graphql.org/graphql-js/type/#graphqlenumtype
              const name = getName(definition.name);
              const description = getDescription(definition.description);
              const directives = getDirectives(definition.directives);
              const relevantResolver = (plans[name] ??
                resolvers[name] ??
                {}) as EnumResolver;
              const values: GraphQLEnumValueConfigMap = (
                definition.values ?? []
              ).reduce(
                (
                  memo: GraphQLEnumValueConfigMap,
                  value: EnumValueDefinitionNode,
                ) => {
                  const valueName = getName(value.name);
                  const valueDescription = getDescription(value.description);
                  const valueDirectives = getDirectives(value.directives);

                  // Value cannot be expressed via SDL, so we grab the value from the resolvers instead.
                  // resolvers = {
                  //   MyEnum: {
                  //     MY_ENUM_VALUE1: 'value1',
                  //     MY_ENUM_VALUE2: 'value2',
                  //   }
                  // }
                  // Ref: https://github.com/graphql/graphql-js/issues/525#issuecomment-255834625
                  const valueValue =
                    relevantResolver[valueName] !== undefined
                      ? relevantResolver[valueName]
                      : valueName;

                  const deprecatedDirective = valueDirectives.find(
                    (d) => d.directiveName === "deprecated",
                  );
                  const valueDeprecationReason =
                    deprecatedDirective?.args.reason;
                  return {
                    ...memo,
                    [valueName]: {
                      value: valueValue,
                      deprecationReason: valueDeprecationReason,
                      description: valueDescription,
                      directives: valueDirectives,
                    },
                  };
                },
                Object.create(null),
              );

              const scope = {
                __origin: `makeExtendSchemaPlugin`,
                directives,
                ...scopeFromDirectives(directives),
                ...plans[name]?.__scope,
              };
              build.registerEnumType(
                name,
                scope,
                () => ({ values, description }),
                uniquePluginName,
              );
            } else if (def.type === GraphQLObjectType) {
              const definition = def.definition as ObjectTypeDefinitionNode;
              // https://graphql.org/graphql-js/type/#graphqlobjecttype
              const name = getName(definition.name);
              const description = getDescription(definition.description);
              const directives = getDirectives(definition.directives);
              const p = (plans[name] ?? {}) as DeprecatedObjectPlan;
              const scope = {
                __origin: `makeExtendSchemaPlugin`,
                directives,
                ...scopeFromDirectives(directives),
                ...p.__scope,
              };
              build.registerObjectType(
                name,
                scope,
                () => ({
                  interfaces: () => getInterfaces(definition.interfaces, build),
                  fields: (fieldsContext) =>
                    getFields(
                      fieldsContext.Self,
                      definition.fields,
                      resolvers,
                      plans,
                      fieldsContext,
                      build,
                    ),
                  ...(description
                    ? {
                        description,
                      }
                    : null),
                  ...(p.__isTypeOf
                    ? {
                        isTypeOf: p.__isTypeOf,
                      }
                    : null),
                  ...(p.__assertStep || p.__planType
                    ? {
                        extensions: {
                          grafast: {
                            assertStep: p.__assertStep as any,
                            planType: p.__planType as any,
                          },
                        } as GraphQLObjectTypeExtensions<any, any>,
                      }
                    : null),
                }),
                uniquePluginName,
              );
            } else if (def.type === GraphQLInputObjectType) {
              const definition =
                def.definition as InputObjectTypeDefinitionNode;
              // https://graphql.org/graphql-js/type/#graphqlinputobjecttype
              const name = getName(definition.name);
              const description = getDescription(definition.description);
              const directives = getDirectives(definition.directives);
              const scope = {
                __origin: `makeExtendSchemaPlugin`,
                directives,
                ...scopeFromDirectives(directives),
                ...plans[name]?.__scope,
              };
              build.registerInputObjectType(
                name,
                scope,
                () => ({
                  fields: ({ Self }) =>
                    getInputFields(Self, definition.fields, build),
                  ...(description
                    ? {
                        description,
                      }
                    : null),
                }),
                uniquePluginName,
              );
            } else if (def.type === GraphQLUnionType) {
              const definition = def.definition as UnionTypeDefinitionNode;
              // https://graphql.org/graphql-js/type/#graphqluniontype
              const name = getName(definition.name);
              const description = getDescription(definition.description);
              const directives = getDirectives(definition.directives);
              const tp = plans[name] as Maybe<TypeResolver>;
              const tr = resolvers[name] as Maybe<TypeResolver>;
              if (tp && tr) {
                throw new Error(
                  `You must set only plans.${name} or resolvers.${name} - not both!`,
                );
              }
              const t = tp ?? tr;
              const scope = {
                __origin: `makeExtendSchemaPlugin`,
                directives,
                ...scopeFromDirectives(directives),
                ...t?.__scope,
              };
              const resolveType = t?.__resolveType;
              const toSpecifier = t?.__toSpecifier;
              const planType = t?.__planType;
              build.registerUnionType(
                name,
                scope,
                () => ({
                  types: () => {
                    if (Array.isArray(definition.types)) {
                      return definition.types.map((typeAST: any) => {
                        if (typeAST.kind !== "NamedType") {
                          throw new Error("Only support unions of named types");
                        }
                        return getType(typeAST, build) as GraphQLObjectType;
                      });
                    } else {
                      return [];
                    }
                  },
                  ...(resolveType ? { resolveType } : null),
                  ...(toSpecifier ? { toSpecifier } : null),
                  ...(planType ? { planType } : null),
                  ...(description ? { description } : null),
                }),
                uniquePluginName,
              );
            } else if (def.type === GraphQLInterfaceType) {
              const definition = def.definition as InterfaceTypeDefinitionNode;
              // https://graphql.org/graphql-js/type/#graphqluniontype
              const name = getName(definition.name);
              const description = getDescription(definition.description);
              const directives = getDirectives(definition.directives);
              const tp = plans[name] as Maybe<TypeResolver>;
              const tr = resolvers[name] as Maybe<TypeResolver>;
              if (tp && tr) {
                throw new Error(
                  `You must set only plans.${name} or resolvers.${name} - not both!`,
                );
              }
              const t = tp ?? tr;
              const scope = {
                __origin: `makeExtendSchemaPlugin`,
                directives,
                ...scopeFromDirectives(directives),
                ...t?.__scope,
              };
              const resolveType = t?.__resolveType;
              const toSpecifier = t?.__toSpecifier;
              const planType = t?.__planType;
              build.registerInterfaceType(
                name,
                scope,
                () => ({
                  ...(resolveType ? { resolveType } : null),
                  ...(toSpecifier ? { toSpecifier } : null),
                  ...(planType ? { planType } : null),
                  ...(description ? { description } : null),
                  fields: (fieldsContext) =>
                    getFields(
                      fieldsContext.Self,
                      definition.fields,
                      Object.create(null), // Interface doesn't need resolvers
                      Object.create(null), // Interface doesn't need resolvers
                      fieldsContext,
                      build,
                    ),
                  ...(description
                    ? {
                        description,
                      }
                    : null),
                }),
                uniquePluginName,
              );
            } else if (def.type === GraphQLScalarType) {
              const definition = def.definition as ScalarTypeDefinitionNode;
              const name = getName(definition.name);
              const description = getDescription(definition.description);
              const directives = getDirectives(definition.directives);
              const scope = {
                __origin: `makeExtendSchemaPlugin`,
                directives,
                ...scopeFromDirectives(directives),
                ...plans[name]?.__scope,
              };
              const possiblePlan = plans[name];
              const possibleResolver = resolvers[name] as Maybe<
                GraphQLScalarType | GraphQLScalarTypeConfig<any, any>
              >;
              if (possiblePlan && possibleResolver) {
                throw new Error(
                  `You must set only plans.${name} or resolvers.${name} - not both!`,
                );
              }
              const rawConfig = possiblePlan ?? possibleResolver;
              const config = rawConfig
                ? rawConfig instanceof GraphQLScalarType
                  ? EXPORTABLE((rawConfig) => rawConfig.toConfig(), [rawConfig])
                  : (rawConfig as GraphQLScalarTypeConfig<any, any>)
                : null;
              build.registerScalarType(
                name,
                scope,
                () => ({
                  description,
                  astNode: definition,
                  extensions: config?.extensions,
                  specifiedByURL: config?.specifiedByURL,
                  serialize: config?.serialize
                    ? EXPORTABLE((config) => config.serialize, [config])
                    : EXPORTABLE(() => (value: any) => String(value), []),
                  parseValue: config?.parseValue
                    ? EXPORTABLE((config) => config.parseValue, [config])
                    : EXPORTABLE(() => (value: any) => String(value), []),
                  parseLiteral: config?.parseLiteral
                    ? EXPORTABLE((config) => config.parseLiteral, [config])
                    : EXPORTABLE(
                        (GraphQLError, Kind, name) => (ast: any) => {
                          if (ast.kind !== Kind.STRING) {
                            throw new GraphQLError(
                              `${name} can only parse string values`,
                            );
                          }
                          return ast.value;
                        },
                        [GraphQLError, Kind, name],
                      ),
                }),
                uniquePluginName,
              );
            } else if (def.type === GraphQLDirective) {
              const definition = def.definition as DirectiveDefinitionNode;
              // https://github.com/graphql/graphql-js/blob/3c54315ab13c6b9d337fb7c33ad7e27b92ca4a40/src/type/directives.js#L106-L113
              const name = getName(definition.name);
              const description = getDescription(definition.description);
              const locations = definition.locations.map(
                getName,
              ) as DirectiveLocation[];
              const args = getArguments(definition.arguments, build);
              // Ignoring isRepeatable and astNode for now
              const directive = new GraphQLDirective({
                name,
                locations,
                args,
                ...(description ? { description } : null),
              });
              typeExtensions.GraphQLSchema.directives.push(directive);
            } else {
              throw new Error(
                `We have no code to build an object of type '${def.type}'; it should not have reached this area of the code.`,
              );
            }
          });
          return _;
        },

        GraphQLSchema(schema, build, _context) {
          const {
            makeExtendSchemaPlugin: {
              [uniquePluginName]: { typeExtensions },
            },
          } = build;
          return {
            ...schema,
            directives: [
              ...(schema.directives || build.graphql.specifiedDirectives || []),
              ...typeExtensions.GraphQLSchema.directives,
            ],
            types: [
              ...(schema.types || []),
              ...typeExtensions.GraphQLSchema.types,
            ],
          };
        },

        GraphQLObjectType_fields(fields, build, context: any) {
          const {
            extend,
            makeExtendSchemaPlugin: {
              [uniquePluginName]: { typeExtensions, resolvers, plans },
            },
          } = build;
          const { Self } = context;
          if (typeExtensions.GraphQLObjectType[Self.name]) {
            const newFields = typeExtensions.GraphQLObjectType[
              Self.name
            ].reduce(
              (
                memo: GraphQLFieldConfigMap<any, any>,
                extension: ObjectTypeExtensionNode,
              ) => {
                const moreFields = getFields(
                  Self,
                  extension.fields,
                  resolvers,
                  plans,
                  context,
                  build,
                );
                return extend(
                  memo,
                  moreFields,
                  `Adding fields from ${uniquePluginName}`,
                );
              },
              Object.create(null),
            );
            return extend(
              fields,
              newFields,
              `Adding fields from ${uniquePluginName}`,
            );
          } else {
            return fields;
          }
        },

        GraphQLObjectType_interfaces(interfaces, build, context: any) {
          const {
            extend,
            makeExtendSchemaPlugin: {
              [uniquePluginName]: { typeExtensions },
            },
          } = build;
          const { Self } = context;
          if (typeExtensions.GraphQLObjectType[Self.name]) {
            const newInterfaces = typeExtensions.GraphQLObjectType[
              Self.name
            ].reduce(
              (
                memo: GraphQLInterfaceType[],
                extension: ObjectTypeExtensionNode,
              ) => {
                const moreInterfaces = getInterfaces(
                  extension.interfaces,
                  build,
                );
                return extend(
                  memo,
                  moreInterfaces,
                  `Adding interfaces from ${uniquePluginName}`,
                );
              },
              Object.create(null),
            );
            return extend(
              interfaces,
              newInterfaces,
              `Adding interfaces from ${uniquePluginName}`,
            );
          } else {
            return interfaces;
          }
        },

        GraphQLInputObjectType_fields(fields, build, context) {
          const {
            extend,
            makeExtendSchemaPlugin: {
              [uniquePluginName]: { typeExtensions },
            },
          } = build;
          const { Self } = context;
          if (typeExtensions.GraphQLInputObjectType[Self.name]) {
            const newFields = typeExtensions.GraphQLInputObjectType[
              Self.name
            ].reduce(
              (
                memo: GraphQLInputFieldConfigMap,
                extension: InputObjectTypeExtensionNode,
              ) => {
                const moreFields = getInputFields(
                  Self,
                  extension.fields,
                  build,
                );
                return extend(
                  memo,
                  moreFields,
                  `Adding fields from ${uniquePluginName}`,
                );
              },
              Object.create(null),
            );
            return extend(
              fields,
              newFields,
              `Adding fields from ${uniquePluginName}`,
            );
          } else {
            return fields;
          }
        },

        GraphQLInterfaceType_fields(fields, build, context: any) {
          const {
            extend,
            makeExtendSchemaPlugin: {
              [uniquePluginName]: { typeExtensions },
            },
          } = build;
          const { Self } = context;
          if (typeExtensions.GraphQLInterfaceType[Self.name]) {
            const newFields = typeExtensions.GraphQLInterfaceType[
              Self.name
            ].reduce(
              (
                memo: GraphQLFieldConfigMap<any, any>,
                extension: InterfaceTypeExtensionNode,
              ) => {
                const moreFields = getFields(
                  Self,
                  extension.fields,
                  Object.create(null), // No resolvers for interfaces
                  Object.create(null), // No resolvers for interfaces
                  context,
                  build,
                );
                return extend(
                  memo,
                  moreFields,
                  `Adding fields from ${uniquePluginName}`,
                );
              },
              Object.create(null),
            );
            return extend(
              fields,
              newFields,
              `Adding fields from ${uniquePluginName}`,
            );
          } else {
            return fields;
          }
        },

        GraphQLInterfaceType_interfaces(interfaces, build, context: any) {
          const {
            extend,
            makeExtendSchemaPlugin: {
              [uniquePluginName]: { typeExtensions },
            },
          } = build;
          const { Self } = context;
          if (typeExtensions.GraphQLInterfaceType[Self.name]) {
            const newInterfaces = typeExtensions.GraphQLInterfaceType[
              Self.name
            ].reduce(
              (
                memo: GraphQLInterfaceType[],
                extension: InterfaceTypeExtensionNode,
              ) => {
                const moreInterfaces = getInterfaces(
                  extension.interfaces,
                  build,
                );
                return extend(
                  memo,
                  moreInterfaces,
                  `Adding interfaces from ${uniquePluginName}`,
                );
              },
              Object.create(null),
            );
            return extend(
              interfaces,
              newInterfaces,
              `Adding interfaces from ${uniquePluginName}`,
            );
          } else {
            return interfaces;
          }
        },
      },
    },
  };

  function getName(name: NameNode) {
    if (name && name.kind === "Name" && name.value) {
      return name.value;
    }
    throw new Error("Could not extract name from AST");
  }

  function getDescription(desc: StringValueNode | undefined) {
    if (!desc) {
      return null;
    } else if (desc.kind === "StringValue") {
      return desc.value;
    } else {
      throw new Error(
        `AST issue, we weren't expecting a description of kind '${desc.kind}' - PRs welcome!`,
      );
    }
  }

  function getType(type: TypeNode, build: GraphileBuild.Build): GraphQLType {
    if (type.kind === "NamedType") {
      const Type = build.getTypeByName(getName(type.name));
      if (!Type) {
        throw new Error(`Could not find type named '${getName(type.name)}'.`);
      }
      return Type;
    } else if (type.kind === "NonNullType") {
      return new build.graphql.GraphQLNonNull(getType(type.type, build));
    } else if (type.kind === "ListType") {
      return new build.graphql.GraphQLList(getType(type.type, build));
    } else {
      throw new Error(
        `We don't support AST type definition of kind '${
          (type as any).kind
        }' yet... PRs welcome!`,
      );
    }
  }

  function getInterfaces(
    interfaces: ReadonlyArray<NamedTypeNode> | undefined,
    build: GraphileBuild.Build,
  ): GraphQLInterfaceType[] {
    if (!interfaces) return [];
    return interfaces.map(
      (i) => build.getTypeByName(i.name.value) as GraphQLInterfaceType,
    );
  }

  function getValue(
    value: ValueNode,
    inType?: GraphQLType | null,
  ):
    | boolean
    | string
    | number
    | null
    | Array<boolean | string | number | null>
    | any {
    const type =
      inType && graphql.isNonNullType(inType) ? inType.ofType : inType;
    if (value.kind === "BooleanValue") {
      return !!value.value;
    } else if (value.kind === "StringValue") {
      return value.value;
    } else if (value.kind === "IntValue") {
      return parseInt(value.value, 10);
    } else if (value.kind === "FloatValue") {
      return parseFloat(value.value);
    } else if (value.kind === "EnumValue") {
      if (!type) {
        throw new Error(
          "We do not support EnumValue arguments in directives at this time",
        );
      }
      const enumValueName = value.value;
      const enumType: GraphQLEnumType | null = graphql.isEnumType(type)
        ? type
        : null;
      if (!enumType) {
        throw new Error(
          `Tried to interpret an EnumValue for non-enum type ${type}`,
        );
      }

      const values = enumType.getValues();
      const enumValue = values.find((v) => v.name === enumValueName);
      return enumValue ? enumValue.value : undefined;
    } else if (value.kind === "NullValue") {
      return null;
    } else if (value.kind === "ListValue") {
      // This is used in directives, so we cannot assume the type is known.
      const childType: GraphQLType | null =
        type && graphql.isListType(type) ? type.ofType : null;
      return value.values.map((value) => getValue(value, childType));
    } else {
      throw new Error(
        `Value kind '${value.kind}' not supported yet. PRs welcome!`,
      );
    }
  }

  function getDirectives(
    directives: ReadonlyArray<DirectiveNode> | undefined,
  ): GraphileBuild.DirectiveDetails[] {
    return (directives || []).reduce((directivesList, directive) => {
      if (directive.kind !== "Directive") {
        throw new Error(
          `Unexpected '${directive.kind}', we were expecting 'Directive'`,
        );
      }
      const name = getName(directive.name);
      const value = (directive.arguments || []).reduce(
        (argumentValues, arg) => {
          if (arg.kind === "Argument") {
            const argName = getName(arg.name);
            const argValue = getValue(arg.value);
            if (argumentValues[name]) {
              throw new Error(
                `Argument '${argName}' of directive '${name}' must only be used once.`,
              );
            }
            argumentValues[argName] = argValue;
          } else {
            throw new Error(
              `Unexpected '${arg.kind}', we were expecting 'Argument'`,
            );
          }
          return argumentValues;
        },
        Object.create(null),
      );
      directivesList.push({ directiveName: name, args: value });
      return directivesList;
    }, [] as GraphileBuild.DirectiveDetails[]);
  }

  function getArguments(
    args: ReadonlyArray<InputValueDefinitionNode> | undefined,
    build: GraphileBuild.Build,
  ) {
    if (args && args.length) {
      return args.reduce((memo, arg) => {
        if (arg.kind === "InputValueDefinition") {
          const name = getName(arg.name);
          const type = getType(arg.type, build);
          const description = getDescription(arg.description);
          let defaultValue;
          if (arg.defaultValue) {
            defaultValue = getValue(arg.defaultValue, type);
          }
          const argDirectives = getDirectives(arg.directives);
          const deprecatedDirective = argDirectives.find(
            (d) => d.directiveName === "deprecated",
          );
          const deprecationReason = deprecatedDirective?.args.reason;
          memo[name] = {
            type,
            deprecationReason,
            ...(defaultValue != null ? { defaultValue } : null),
            ...(description ? { description } : null),
          } as GraphQLArgumentConfig;
        } else {
          throw new Error(
            `Unexpected '${arg.kind}', we were expecting an 'InputValueDefinition'`,
          );
        }
        return memo;
      }, Object.create(null));
    }
    return {};
  }

  function getFields<TSource>(
    SelfGeneric: TSource,
    fields: ReadonlyArray<FieldDefinitionNode> | undefined,
    resolvers: Resolvers,
    plans: Plans,
    context:
      | GraphileBuild.ContextInterfaceFields
      | GraphileBuild.ContextObjectFields,
    build: GraphileBuild.Build,
  ) {
    const {
      graphql: { getNullableType, getNamedType },
    } = build;
    const { fieldWithHooks } = context;
    const isRootSubscription =
      "isRootSubscription" in context.scope && context.scope.isRootSubscription;
    if (!build.graphql.isNamedType(SelfGeneric)) {
      throw new Error("getFields only supports named types");
    }
    const Self: GraphQLNamedType = SelfGeneric as any;
    if (fields && fields.length) {
      return fields.reduce((memo, field) => {
        if (field.kind === "FieldDefinition") {
          const description = getDescription(field.description);
          const fieldName = getName(field.name);
          const args = getArguments(field.arguments, build);
          const type = getType(field.type, build);
          const directives = getDirectives(field.directives);
          const deprecatedDirective = directives.find(
            (d) => d.directiveName === "deprecated",
          );
          const deprecationReason = deprecatedDirective?.args.reason;

          /*
           * We accept a plan resolver function directly, or an object which
           * can define 'plan', 'subscribePlan', 'resolve', 'subscribe' and
           * other relevant methods.
           */
          const possiblePlan = (
            plans[Self.name] as Maybe<DeprecatedObjectPlan>
          )?.[fieldName];
          build.exportNameHint(possiblePlan, `${Self.name}_${fieldName}_plan`);
          const possibleResolver = (
            resolvers[Self.name] as Maybe<ObjectResolver>
          )?.[fieldName] as
            | GraphQLFieldResolver<TSource, any>
            | ObjectFieldConfig;
          build.exportNameHint(
            possibleResolver,
            `${Self.name}_${fieldName}_resolver`,
          );
          if (possiblePlan && possibleResolver) {
            throw new Error(
              `You must set only plans.${Self.name}.${fieldName} or resolvers.${Self.name}.${fieldName} - not both!`,
            );
          }
          const spec = possiblePlan ?? possibleResolver;
          const fieldSpecGenerator = () => {
            return {
              ...(deprecationReason
                ? {
                    deprecationReason,
                  }
                : null),
              ...(description
                ? {
                    description,
                  }
                : null),
              ...(typeof spec === "function"
                ? {
                    [possiblePlan
                      ? isRootSubscription
                        ? "subscribePlan"
                        : "plan"
                      : "resolve"]: spec as any,
                  }
                : typeof spec === "object" && spec
                  ? spec
                  : null),
              type: type as GraphQLOutputType,
              args,
            };
          };
          const nullableType = getNullableType(type);
          const namedType = getNamedType(type) as GraphQLNamedOutputType;
          const typeScope = build.scopeByType.get(namedType) as
            | GraphileBuild.ScopeScalar
            | GraphileBuild.ScopeEnum
            | GraphileBuild.ScopeInterface
            | GraphileBuild.ScopeUnion
            | GraphileBuild.ScopeObject
            | undefined;
          const scope: GraphileBuild.ScopeObjectFieldsField = {
            fieldDirectives: directives,

            // Guess a codec and resource
            ...(typeScope && "pgCodec" in typeScope && typeScope.pgCodec
              ? {
                  pgFieldCodec: typeScope.pgCodec,
                  // First guess at a resource; may be overwritten
                  pgFieldResource: Object.values(
                    build.input.pgRegistry.pgResources,
                  ).find(
                    (r) =>
                      r.codec === typeScope.pgCodec &&
                      !r.isUnique &&
                      !r.parameters &&
                      !r.isVirtual &&
                      !r.isList &&
                      !r.codec.polymorphism,
                  ),
                }
              : null),

            // Guess (more accurately) a resource
            ...(typeScope &&
            "pgTypeResource" in typeScope &&
            typeScope.pgTypeResource
              ? { pgFieldResource: typeScope.pgTypeResource }
              : null),

            // Guess if it's a connection
            ...(nullableType === namedType &&
            typeScope &&
            "isConnectionType" in typeScope
              ? { isPgFieldConnection: typeScope.isConnectionType }
              : null),

            // Allow user to overwrite
            ...scopeFromDirectives(directives),
            ...(typeof spec === "object" && spec !== null ? spec.scope : null),

            // fieldName always wins
            fieldName,
          };
          return build.extend(
            memo,
            {
              [fieldName]: fieldWithHooks(scope, fieldSpecGenerator),
            },
            `Adding '${fieldName}' to '${Self.name}' from '${uniquePluginName}'`,
          );
        } else {
          throw new Error(
            `AST issue: expected 'FieldDefinition', instead received '${field.kind}'`,
          );
        }
      }, Object.create(null));
    }
    return {};
  }

  function getInputFields<TSource>(
    _Self: TSource,
    fields: ReadonlyArray<InputValueDefinitionNode> | undefined,
    build: GraphileBuild.Build,
  ) {
    if (fields && fields.length) {
      return fields.reduce((memo, field) => {
        if (field.kind === "InputValueDefinition") {
          const description = getDescription(field.description);
          const fieldName = getName(field.name);
          const type = getType(field.type, build);
          const defaultValue = field.defaultValue
            ? getValue(field.defaultValue, type)
            : undefined;
          memo[fieldName] = {
            type,
            defaultValue,
            ...(description
              ? {
                  description,
                }
              : null),
          };
        } else {
          throw new Error(
            `AST issue: expected 'FieldDefinition', instead received '${field.kind}'`,
          );
        }
        return memo;
      }, Object.create(null));
    }
    return {};
  }
}

function scopeFromDirectives(
  directives: GraphileBuild.DirectiveDetails[],
): any {
  return {
    ...directives
      .filter((d) => d.directiveName === "scope")
      .map((d) => d.args)
      .reduce((memo, a) => Object.assign(memo, a), Object.create(null)),
  };
}

function isNotNullish<T>(v: Maybe<T>): v is T {
  return v != null;
}

/** @deprecated Renamed to 'extendSchema' */
export const makeExtendSchemaPlugin = extendSchema;
