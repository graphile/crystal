import type { GraphiQL } from "graphiql";
import type { GraphQLSchema } from "graphql";
import { GraphQLObjectType, isType } from "graphql";

/**
 * Updates the GraphiQL documentation explorer’s navigation stack. This
 * depends on private API. By default the GraphiQL navigation stack uses
 * objects from a GraphQL schema. Therefore if the schema is updated, the
 * old objects will still be in the navigation stack. This is bad for us
 * because we want to reflect the new schema information! So, we manually
 * update the navigation stack with this function.
 *
 * I’m sorry Lee Byron.
 */
// TODO: Submit a PR which adds this as a non-hack.
export function updateGraphiQLDocExplorerNavStack(
  nextSchema: GraphQLSchema,
  graphiql: GraphiQL,
) {
  // Get the documentation explorer component from GraphiQL. Unfortunately
  // for them this looks like public API. Muwahahahaha.
  const { docExplorerComponent } = graphiql;
  if (!docExplorerComponent) {
    console.log("No docExplorerComponent, could not update navStack");
    return;
  }
  const { navStack } = docExplorerComponent.state;

  // If one type/field isn’t find this will be set to false and the
  // `navStack` will just reset itself.
  let allOk = true;
  let exitEarly = false;

  // Ok, so if you look at GraphiQL source code, the `navStack` is made up of
  // objects that are either types or fields. Let’s use that to search in
  // our new schema for matching (updated) types and fields.
  const nextNavStack = navStack
    .map((navStackItem, i) => {
      // If we are not ok, abort!
      if (exitEarly || !allOk) return null;

      // Get the definition from the nav stack item.
      const typeOrField = navStackItem.def;

      // If there is no type or field then this is likely the root schema view,
      // or a search. If this is the case then just return that nav stack item!
      if (!typeOrField) {
        return navStackItem;
      } else if (isType(typeOrField)) {
        // If this is a type, let’s do some shenanigans...
        // Let’s see if we can get a type with the same name.
        const nextType = nextSchema.getType(typeOrField.name);

        // If there is no type with this name (it was removed), we are not ok
        // so set `allOk` to false and return undefined.
        if (!nextType) {
          exitEarly = true;
          return null;
        }

        // If there is a type with the same name, let’s return it! This is the
        // new type with all our new information.
        return { ...navStackItem, def: nextType };
      } else {
        // If you thought this function was already pretty bad, it’s about to get
        // worse. We want to update the information for an object field.
        // Ok, so since this is an object field, we will assume that the last
        // element in our stack was an object type.
        const nextLastType = nextSchema.getType(
          navStack[i - 1] ? navStack[i - 1].name : "",
        );

        // If there is no type for the last type in the nav stack’s name.
        // Panic!
        if (!nextLastType) {
          allOk = false;
          return null;
        }

        // If the last type is not an object type. Panic!
        if (!(nextLastType instanceof GraphQLObjectType)) {
          allOk = false;
          return null;
        }

        // Next we will see if the new field exists in the last object type.
        const nextField = nextLastType.getFields()[typeOrField.name];

        // If not, Panic!
        if (!nextField) {
          allOk = false;
          return null;
        }

        // Otherwise we hope very much that it is correct.
        return { ...navStackItem, def: nextField };
      }
    })
    .filter((_) => _);

  // This is very hacky but works. React is cool.
  if (allOk) {
    graphiql.docExplorerComponent?.setState({
      // If we are not ok, just reset the `navStack` with an empty array.
      // Otherwise use our new stack.
      navStack: nextNavStack as any[],
    });
  }
}
