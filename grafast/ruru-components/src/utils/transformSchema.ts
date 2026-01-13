import type {
  GraphQLEnumValueConfigMap,
  GraphQLFieldConfigArgumentMap,
  GraphQLInputType,
  GraphQLNamedType,
  GraphQLOutputType,
  GraphQLType,
} from "graphql";
import {
  GraphQLDirective,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLUnionType,
  isEnumType,
  isInputObjectType,
  isInterfaceType,
  isIntrospectionType,
  isListType,
  isNonNullType,
  isObjectType,
  isScalarType,
  isSpecifiedDirective,
  isSpecifiedScalarType,
  isUnionType,
} from "graphql";

export interface TransformOptions {
  trimDeprecated?: boolean;
  trimDescriptions?: boolean;
}

interface BaseArgs {
  deprecationReason?: string | null | undefined;
  type: GraphQLType;
  description?: string | null | undefined;
}

interface BaseField {
  type: GraphQLType;
  description?: string | null | undefined;
  deprecationReason?: string | null | undefined;
}
type BaseFieldMap = Record<string, BaseField>;
interface BaseOutputField {
  type: GraphQLType;
  description?: string | null | undefined;
  deprecationReason?: string | null | undefined;
  args?: GraphQLFieldConfigArgumentMap;
}
type BaseOutputFieldMap = Record<string, BaseOutputField>;

export function transformSchema(
  schema: GraphQLSchema,
  options: TransformOptions,
): GraphQLSchema {
  const { trimDeprecated = false, trimDescriptions = false } = options;
  const schemaConfig = schema.toConfig();

  const typeMap = new Map<string, GraphQLNamedType>();

  function maybeTrimDescription<
    T extends { description?: string | null | undefined },
  >(obj: T): Omit<T, "description"> & Partial<Pick<T, "description">> {
    if (!trimDescriptions) return obj;
    const { description, ...rest } = obj;
    return rest;
  }

  const remapType = (t: GraphQLType): GraphQLType => {
    if (isNonNullType(t)) {
      return new GraphQLNonNull(remapType(t.ofType));
    } else if (isListType(t)) {
      return new GraphQLList(remapType(t.ofType));
    } else {
      return typeMap.get(t.name) ?? t;
    }
  };

  function remapNamedType(t: GraphQLObjectType): GraphQLObjectType;
  function remapNamedType(
    t: GraphQLObjectType | null | undefined,
  ): GraphQLObjectType | undefined;
  function remapNamedType(t: GraphQLInterfaceType): GraphQLInterfaceType;
  function remapNamedType(
    t: GraphQLOutputType & GraphQLNamedType,
  ): GraphQLOutputType & GraphQLNamedType;
  function remapNamedType(
    t: GraphQLInputType & GraphQLNamedType,
  ): GraphQLInputType & GraphQLNamedType;
  function remapNamedType(
    t: GraphQLNamedType | null | undefined,
  ): GraphQLNamedType | undefined;
  function remapNamedType(
    t: GraphQLNamedType | null | undefined,
  ): GraphQLNamedType | undefined {
    return t ? (typeMap.get(t.name) ?? t) : undefined;
  }

  function remapArgs<T extends Record<string, BaseArgs>>(
    args: T | undefined,
  ): T | undefined {
    return args
      ? (Object.fromEntries(
          Object.entries(args)
            .filter(
              ([_argName, arg]) => !trimDeprecated || !arg.deprecationReason,
            )
            .map(([argName, arg]) => [
              argName,
              maybeTrimDescription(replaceType(arg)),
            ]),
        ) as T)
      : undefined;
  }

  function replaceType<T extends { type: GraphQLType }>(config: T): T {
    const { type, ...rest } = config;
    return { ...rest, type: remapType(type) } as T;
  }

  function replaceArgs<
    T extends { args?: Record<string, BaseArgs> | undefined },
  >(f: T): T {
    const { args, ...rest } = f;
    return { ...rest, args: remapArgs(args) } as T;
  }

  function remapFields<T extends BaseOutputFieldMap>(oldFields: T) {
    const fields: BaseOutputFieldMap = Object.create(null);
    for (const [fname, f] of Object.entries(oldFields)) {
      if (trimDeprecated && f.deprecationReason != null) continue;
      fields[fname] = maybeTrimDescription(replaceType(replaceArgs(f)));
    }
    return fields as T;
  }

  type Thunkify<T extends { [k in TProp]: any }, TProp extends string> = Omit<
    T,
    TProp
  > & {
    [k in TProp]: () => T[TProp];
  };

  function replaceFields<T extends { fields: BaseOutputFieldMap }>(obj: T) {
    const { fields, ...rest } = obj;
    return { ...rest, fields: () => remapFields(fields) } as Thunkify<
      T,
      "fields"
    >;
  }

  function remapInputFields<T extends BaseFieldMap>(oldFields: T) {
    const fields: BaseFieldMap = Object.create(null);
    for (const [fname, f] of Object.entries(oldFields)) {
      if (trimDeprecated && f.deprecationReason != null) continue;
      fields[fname] = maybeTrimDescription(replaceType(f));
    }
    return fields as T;
  }

  function replaceInputFields<T extends { fields: BaseFieldMap }>(obj: T) {
    const { fields, ...rest } = obj;
    return { ...rest, fields: () => remapInputFields(fields) } as Thunkify<
      T,
      "fields"
    >;
  }

  function replaceInterfaces<
    T extends { interfaces: ReadonlyArray<GraphQLInterfaceType> },
  >(obj: T) {
    const { interfaces, ...rest } = obj;
    return {
      ...rest,
      interfaces: () => interfaces.map((iface) => remapNamedType(iface)),
    } as Thunkify<T, "interfaces">;
  }

  function transformType(type: GraphQLNamedType) {
    switch (true) {
      case isScalarType(type): {
        return new GraphQLScalarType(maybeTrimDescription(type.toConfig()));
      }

      case isEnumType(type): {
        const config = type.toConfig();
        const values: GraphQLEnumValueConfigMap = Object.fromEntries(
          Object.entries(config.values)
            .filter(([, v]) => !trimDeprecated || !v.deprecationReason)
            .map(([k, v]) => [k, maybeTrimDescription(v)]),
        );
        return new GraphQLEnumType(
          maybeTrimDescription({
            ...config,
            values,
          }),
        );
      }

      case isUnionType(type): {
        const config = type.toConfig();
        return new GraphQLUnionType(
          maybeTrimDescription(
            maybeTrimDescription({
              ...config,
              types: () => config.types.map((t) => remapNamedType(t)),
            }),
          ),
        );
      }

      case isInterfaceType(type): {
        const config = type.toConfig();
        return new GraphQLInterfaceType(
          maybeTrimDescription(replaceFields(replaceInterfaces(config))),
        );
      }

      case isInputObjectType(type): {
        const config = type.toConfig();
        return new GraphQLInputObjectType(
          maybeTrimDescription(replaceInputFields(config)),
        );
      }

      case isObjectType(type): {
        const config = type.toConfig();
        return new GraphQLObjectType(
          maybeTrimDescription(replaceFields(replaceInterfaces(config))),
        );
      }
      default: {
        return type;
      }
    }
  }

  for (const t of schemaConfig.types) {
    if (typeMap.has(t.name)) continue;
    if (isIntrospectionType(t)) continue;
    if (isSpecifiedScalarType(t)) {
      typeMap.set(t.name, t);
    } else {
      const type = transformType(t);
      typeMap.set(t.name, type);
    }
  }

  const directives = schemaConfig.directives.map((d) =>
    isSpecifiedDirective(d)
      ? d
      : new GraphQLDirective(maybeTrimDescription(replaceArgs(d.toConfig()))),
  );

  return new GraphQLSchema(
    maybeTrimDescription({
      ...schemaConfig,
      types: Array.from(typeMap.values()),
      directives,
      query: remapNamedType(schemaConfig.query),
      mutation: remapNamedType(schemaConfig.mutation),
      subscription: remapNamedType(schemaConfig.subscription),
    }),
  );
}
