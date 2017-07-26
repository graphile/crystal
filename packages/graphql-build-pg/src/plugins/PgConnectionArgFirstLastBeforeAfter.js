// @flow
import type { Plugin } from "graphql-build";

const base64Decode = str => new Buffer(String(str), "base64").toString("utf8");

export default (function PgConnectionArgs(builder) {
  builder.hook(
    "GraphQLObjectType:fields:field:args",
    (
      args,
      { extend, getTypeByName, graphql: { GraphQLInt } },
      {
        scope: { isPgConnectionField, pgIntrospection: source },
        addArgDataGenerator,
      }
    ) => {
      if (
        !isPgConnectionField ||
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
          pgQuery: queryBuilder => {
            if (first != null) {
              queryBuilder.limit(first);
            }
            if (offset != null) {
              queryBuilder.offset(offset);
            }
            if (first != null && last != null) {
              throw new Error("We don't support setting both first and last");
            }
            if (last != null) {
              queryBuilder.limit(last);
              queryBuilder.flip();
            }
            if (after != null) {
              addCursorConstraint(after, true);
            }
            if (before != null) {
              addCursorConstraint(before, false);
            }

            function addCursorConstraint(cursor, isAfter) {
              const cursorValues = JSON.parse(base64Decode(cursor));
              queryBuilder.whereBound(() => {
                return queryBuilder.cursorCondition(cursorValues, isAfter);
              }, isAfter);
            }
          },
        };
      });

      return extend(args, {
        first: {
          description: "Only read the first `n` values of the set.",
          type: GraphQLInt,
        },
        last: {
          description: "Only read the last `n` values of the set.",
          type: GraphQLInt,
        },
        offset: {
          description:
            "Skip the first `n` values from our `after` cursor, an alternative to cursor based pagination. May not be used with `last`.",
          type: GraphQLInt,
        },
        before: {
          description: "Read all values in the set before (above) this cursor.",
          type: Cursor,
        },
        after: {
          description: "Read all values in the set after (below) this cursor.",
          type: Cursor,
        },
      });
    }
  );
}: Plugin);
