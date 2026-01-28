/*
 * This file is not used, it is purely for documentation (whilst being
 * type-checked).
 */
import type {} from "./index.ts";

// Declaration merging:
declare global {
  namespace GraphileBuild {
    interface Build {
      // Declare extra properties added via `plugin.schema.hooks.build` here
    }
  }
}

export const AllHooksNoopPlugin: GraphileConfig.Plugin = {
  name: "AllHooksNoopPlugin",
  description:
    "This plugin doesn't make any changes, just demonstrates all the schema hooks",
  schema: {
    hooks: {
      build(mutableBuild, build, context) {
        // This hook is for adding helpers to the `GraphileBuild.Build` object
        // that will be accessible by all other hooks.

        // NOTE: use declaration merging to add your new properties to the
        // GraphileBuild.Build TypeScript type (see above)

        // NOTE: `mutableBuild === build` at this point

        return mutableBuild;
      },
      init(_, build, context) {
        // Ensure no changes are actually made:
        if (Math.random() < 2) return _;

        // NOTE: `_` should not be modified or replaced; init phase is for
        // registering types/etc

        build.registerObjectType(
          "MyObjectType",
          {
            // Add extra details to scope so later plugins can hook it here
          },
          () => {
            return {
              description: "...",
              fields: {
                // ...
              },
            };
          },
          "Reason we're defining this object type",
        );

        return _;
      },
      finalize(constructedSchema, build, context) {
        // NOTE: never perform mutations in this hook, the schema has already
        // been built! It's primarily useful for performing assertions to catch
        // development errors.

        return constructedSchema;
      },

      GraphQLSchema(schema, build, context) {
        // Here's where you can add a query/mutation/subscription type to
        // the schema, or add schema extensions.

        if (Math.random() > 2) {
          // To add extensions to the schema, mutate directly
          schema.extensions = build.extend(
            schema.extensions ?? {},
            {
              // Add extensions here:
              myExtension: 27,
            },
            "Reason extensions are being added",
          );
        }

        return build.extend(
          schema,
          {
            // Add operation types here:
            // query: build.getTypeByName("Query"),
            // mutation: build.getTypeByName("Mutation"),
            // subscription: build.getTypeByName("Subscription"),
          },
          "Reason we're adding an operation type",
        );
      },
      GraphQLSchema_types(types, build, context) {
        // NOTE: the schema config is at context.config (but don't mutate it)

        return build.append(
          types,
          [
            // Add types here that aren't discoverable by walking the root
            // operation types - i.e. implementations of interfaces (`type Foo
            // implements Iface {...}`) where that type may not ever otherwise
            // be referenced.
          ],
          "name",
          "Reason we're adding types to the schema",
          "recoverable",
        );
      },

      GraphQLObjectType(objectType, build, context) {
        if (objectType.name !== "__MyObject__") return objectType;

        objectType.description ??= "Some default description";
        // Or mod extensions as in GraphQLSchema hook

        return objectType;
      },
      GraphQLObjectType_interfaces(interfaces, build, context) {
        if (context.Self.name !== "__MyObject__") return interfaces;

        // This hook is to add additional interfaces to the given object type.

        return build.append(
          interfaces,
          [
            // Add interface types here:
            // build.getTypeByName("InterfaceTypeName"),
          ],
          "name",
          "Description of why we're adding interfaces",
          "recoverable",
        );
      },
      GraphQLObjectType_fields(fields, build, context) {
        if (context.Self.name !== "__MyObject__") return fields;

        const {
          graphql: { isOutputType },
          inflection,
        } = build;

        // This hook is meant for adding fields to object type context.Self

        const fieldName = inflection.camelCase(
          inflection.coerceToGraphQLName("..."),
        );
        const FieldType = build.getTypeByName("...");
        if (!isOutputType(FieldType)) {
          throw new Error("...");
        }

        // Adds the field to `fields`
        return build.extend(
          fields,
          {
            [fieldName]: context.fieldWithHooks(
              // "scope" additions, available in context.scope in hooks below
              {
                fieldName, // Required
                // Add extra scope info here
              },

              // The field spec itself:
              {
                type: FieldType,
                description: "...",
                args: {
                  /* ... */
                },
                // ...
              },
            ),
          },
          "Description of why we're adding fields",
        );
      },
      // For the following GraphQLObjectType_fields_field* hooks, the field name
      // is available at `context.scope.fieldName`
      GraphQLObjectType_fields_field(field, build, context) {
        if (
          context.Self.name !== "__MyObject__" ||
          context.scope.fieldName !== "__myField__"
        ) {
          return field;
        }

        // Your chance to mutate the field spec, e.g.:
        field.deprecationReason ??= "I just don't like it";

        return field;
      },
      GraphQLObjectType_fields_field_args(args, build, context) {
        if (
          context.Self.name !== "__MyObject__" ||
          context.scope.fieldName !== "__myField__"
        ) {
          return args;
        }

        const {
          inflection,
          graphql: { isInputType },
        } = build;
        const argName = inflection.camelCase(
          inflection.coerceToGraphQLName("..."),
        );
        const ArgType = build.getTypeByName("...");
        if (!isInputType(ArgType)) {
          throw new Error("...");
        }

        return build.extend(
          args,
          {
            // Add more arguments here
            [argName]: {
              type: ArgType,
              description: "...",
            },
          },
          "Reason we're adding args",
          "throw",
        );
      },
      GraphQLObjectType_fields_field_args_arg(arg, build, context) {
        if (
          context.Self.name !== "__MyObject__" ||
          context.scope.fieldName !== "__myField__" ||
          context.scope.argName !== "__myArg__"
        ) {
          return arg;
        }

        // Your chance to mutate the arg spec, e.g.:
        arg.deprecationReason ??= "I just don't like it";

        return arg;
      },

      GraphQLInterfaceType(interfaceType, build, context) {
        // Essentially identical to GraphQLObjectType but for interfaces
        return interfaceType;
      },
      GraphQLInterfaceType_interfaces(interfaces, build, context) {
        // Essentially identical to GraphQLObjectType_interfaces but for interfaces
        return interfaces;
      },
      GraphQLInterfaceType_fields(fields, build, context) {
        // Essentially identical to GraphQLObjectType_fields but for interfaces
        return fields;
      },
      GraphQLInterfaceType_fields_field(field, build, context) {
        // Essentially identical to GraphQLObjectType_fields_field but for interfaces
        return field;
      },
      GraphQLInterfaceType_fields_field_args(args, build, context) {
        // Essentially identical to GraphQLObjectType_fields_field_args but for interfaces
        return args;
      },
      GraphQLInterfaceType_fields_field_args_arg(arg, build, context) {
        // Essentially identical to GraphQLObjectType_fields_field_args_arg but for interfaces
        return arg;
      },

      GraphQLInputObjectType(inputObjectType, build, context) {
        if (inputObjectType.name !== "__MyInputObject__") {
          return inputObjectType;
        }

        inputObjectType.description ??= "Some default description";
        // Or mod extensions as in GraphQLSchema hook

        return inputObjectType;
      },
      GraphQLInputObjectType_fields(fields, build, context) {
        if (context.Self.name !== "__MyInputObject__") {
          return fields;
        }

        const {
          graphql: { isInputType },
          inflection,
        } = build;

        // This hook is meant for adding fields to input object type context.Self

        const myName = "...";
        const fieldName = inflection.camelCase(
          inflection.coerceToGraphQLName(myName),
        );
        const FieldType = build.getTypeByName("...");
        if (!isInputType(FieldType)) {
          throw new Error("...");
        }

        // Adds the field to `fields`
        return build.extend(
          fields,
          {
            [fieldName]: context.fieldWithHooks(
              // "scope" additions, available in context.scope in hooks below
              {
                fieldName, // Required
                // Add extra scope info here
              },

              // The field spec itself:
              {
                type: FieldType,
                description: "...",
                // ...
              },
            ),
          },
          "Description of why we're adding fields",
        );
      },
      GraphQLInputObjectType_fields_field(field, build, context) {
        if (
          context.Self.name !== "__MyInputObject__" ||
          context.scope.fieldName !== "__myField__"
        ) {
          return field;
        }

        field.description ??= "Some default description";

        return field;
      },

      GraphQLEnumType(enumType, build, context) {
        if (enumType.name !== "__MyEnum__") return enumType;

        enumType.description ??= "Some default description";
        // Or mod extensions as in GraphQLSchema hook

        return enumType;
      },
      GraphQLEnumType_values(values, build, context) {
        if (context.Self.name !== "__MyEnum__") return values;

        const { inflection } = build;

        const valueName = inflection.constantCase(
          inflection.coerceToGraphQLName("Twenty seven"),
        );

        return build.extend(
          values,
          {
            [valueName]: {
              value: 27,
              description: "Represents 27 of something",
              // ...
            },
          },
          "Reason we're adding values",
        );
      },
      GraphQLEnumType_values_value(value, build, context) {
        if (
          context.Self.name !== "__MyEnum__" ||
          context.scope.valueName !== "TWENTY_SEVEN"
        ) {
          return value;
        }

        value.deprecationReason = "I just don't like it";

        return value;
      },

      GraphQLUnionType(unionType, build, context) {
        if (unionType.name !== "__MyUnion__") return unionType;

        unionType.description ??= "Some default description";
        // Or mod extensions as in GraphQLSchema hook

        return unionType;
      },
      // For the following GraphQLUnionType_* hooks, the union type instance
      // is available at `context.Self`
      GraphQLUnionType_types(types, build, context) {
        if (context.Self.name !== "__MyUnion__") return types;

        return build.append(
          types,
          [
            // Add object types here:
            // build.getTypeByName("ObjectTypeName"),
          ],
          "name",
          "Description of why we're adding types",
          "recoverable",
        );
      },

      // NOTE: you cannot hook the builtin scalars `Boolean`, `Int`, `Float`,
      // `ID`, `String`
      GraphQLScalarType(scalarType, build, context) {
        if (scalarType.name !== "__MyScalar__") {
          return scalarType;
        }

        scalarType.description ??= "Some default description";
        // Or mod extensions as in GraphQLSchema hook

        return scalarType;
      },
    },
  },
};
