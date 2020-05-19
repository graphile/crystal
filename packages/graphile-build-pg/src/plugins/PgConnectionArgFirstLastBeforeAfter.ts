const base64Decode = (str: string) =>
  Buffer.from(String(str), "base64").toString("utf8");

export default (function PgConnectionArgs(builder) {
  builder.hook(
    "GraphQLObjectType:fields:field:args",
    (args, build, context) => {
      const {
        extend,
        getTypeByName,
        graphql: { GraphQLInt },
      } = build;
      const {
        scope: {
          fieldName,
          isPgFieldConnection,
          isPgFieldSimpleCollection,
          pgFieldIntrospection: source,
        },

        addArgDataGenerator,
        Self,
      } = context;

      if (
        !(isPgFieldConnection || isPgFieldSimpleCollection) ||
        !source ||
        (source.kind !== "class" && source.kind !== "procedure")
      ) {
        return args;
      }
      const Cursor = getTypeByName("Cursor");

      addArgDataGenerator(function connectionFirstLastBeforeAfter({
        first,
        offset,
        last,
        after,
        before,
      }) {
        return {
          pgQuery: (queryBuilder) => {
            if (typeof first === "number") {
              queryBuilder.first(first);
            }
            if (typeof offset === "number") {
              queryBuilder.offset(offset);
            }
            if (isPgFieldConnection) {
              if (typeof after === "string") {
                addCursorConstraint(after, true);
              }
              if (typeof before === "string") {
                addCursorConstraint(before, false);
              }
              if (typeof last === "number") {
                if (first != null) {
                  throw new Error(
                    "We don't support setting both first and last",
                  );
                }
                if (offset != null) {
                  throw new Error(
                    "We don't support setting both offset and last",
                  );
                }
                queryBuilder.last(last);
              }
            }

            function addCursorConstraint(cursor: string, isAfter: boolean) {
              try {
                const cursorValues = JSON.parse(base64Decode(cursor));
                return queryBuilder.addCursorCondition(cursorValues, isAfter);
              } catch (e) {
                throw new Error(
                  "Invalid cursor, please enter a cursor from a previous request, or null.",
                );
              }
            }
          },
        };
      });

      return extend(
        args,
        {
          first: {
            description: "Only read the first `n` values of the set.",
            type: GraphQLInt,
          },

          ...(isPgFieldConnection
            ? {
                last: {
                  description: "Only read the last `n` values of the set.",
                  type: GraphQLInt,
                },
              }
            : null),
          offset: {
            description: isPgFieldConnection
              ? "Skip the first `n` values from our `after` cursor, an alternative to cursor based pagination. May not be used with `last`."
              : "Skip the first `n` values.",
            type: GraphQLInt,
          },

          ...(isPgFieldConnection
            ? {
                before: {
                  description:
                    "Read all values in the set before (above) this cursor.",
                  type: Cursor,
                },

                after: {
                  description:
                    "Read all values in the set after (below) this cursor.",
                  type: Cursor,
                },
              }
            : null),
        },

        isPgFieldConnection
          ? `Adding connection pagination args to field '${fieldName}' of '${Self.name}'`
          : `Adding simple collection args to field '${fieldName}' of '${Self.name}'`,
      );
    },
    ["PgConnectionArgFirstLastBeforeAfter"],
  );
} as GraphileEngine.Plugin);
