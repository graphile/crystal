const base64Decode = str => Buffer.from(String(str), "base64").toString("utf8");
const { GraphQLInt } = require("graphql");

module.exports = function PgConnectionArgs(builder) {
  builder.hook(
    "field:args",
    (
      args,
      { extend, getTypeByName },
      {
        scope: { isPgConnectionField, pgIntrospection: table },
        addArgDataGenerator,
      }
    ) => {
      if (!isPgConnectionField || !table || table.kind !== "class") {
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
          type: GraphQLInt,
        },
        last: {
          type: GraphQLInt,
        },
        offset: {
          type: GraphQLInt,
        },
        before: {
          type: Cursor,
        },
        after: {
          type: Cursor,
        },
      });
    }
  );
};
