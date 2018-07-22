/* tslint:disable:no-console */
/* eslint-disable no-console */
import React from 'react';
import GraphiQL from 'graphiql';
import { buildClientSchema, introspectionQuery, isType, GraphQLObjectType } from 'graphql';

const { POSTGRAPHILE_CONFIG } = window;

/**
 * The standard GraphiQL interface wrapped with some PostGraphile extensions.
 * Including a JWT setter and live schema udpate capabilities.
 */
class PostGraphiQL extends React.Component {
  state = {
    // Our GraphQL schema which GraphiQL will use to do its intelligence
    // stuffs.
    schema: null,
  };

  componentDidMount() {
    // Update the schema for the first time. Log an error if we fail.
    this.updateSchema().catch(error => console.error(error));

    // If we were given a `streamUrl`, we want to construct an `EventSource`
    // and add listeners.
    if (POSTGRAPHILE_CONFIG.streamUrl) {
      // Starts listening to the event stream at the `sourceUrl`.
      const eventSource = new EventSource(POSTGRAPHILE_CONFIG.streamUrl);

      // When we get a change notification, we want to update our schema.
      eventSource.addEventListener(
        'change',
        () => {
          this.updateSchema()
            .then(() => console.log('PostGraphile: Schema updated')) // tslint:disable-line no-console
            .catch(error => console.error(error)); // tslint:disable-line no-console
        },
        false,
      );

      // Add event listeners that just log things in the console.
      eventSource.addEventListener(
        'open',
        () => {
          // tslint:disable-next-line no-console
          console.log('PostGraphile: Listening for server sent events');
          this.updateSchema();
        },
        false,
      );
      eventSource.addEventListener(
        'error',
        // tslint:disable-next-line no-console
        () => console.log('PostGraphile: Failed to connect to server'),
        false,
      );

      // Store our event source so we can unsubscribe later.
      this._eventSource = eventSource;
    }
  }

  componentWillUnmount() {
    // Close out our event source so we get no more events.
    this._eventSource.close();
    this._eventSource = null;
  }

  /**
   * Executes a GraphQL query with some extra information then the standard
   * parameters. Namely a JWT which may be added as an `Authorization` header.
   */
  async executeQuery(graphQLParams, { jwtToken } = {}) {
    const response = await fetch(POSTGRAPHILE_CONFIG.graphqlUrl, {
      method: 'POST',
      headers: Object.assign(
        {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        jwtToken
          ? {
              Authorization: `Bearer ${jwtToken}`,
            }
          : {},
      ),
      credentials: 'same-origin',
      body: JSON.stringify(graphQLParams),
    });

    const result = await response.json();

    return result;
  }

  /**
   * When we recieve an event signaling a change for the schema, we must rerun
   * our introspection query and notify the user of the results.
   */
  // TODO: Send the introspection query results in the server sent event?
  async updateSchema() {
    // Fetch the schema using our introspection query and report once that has
    // finished.
    const { data } = await this.executeQuery({ query: introspectionQuery });

    // Use the data we got back from GraphQL to build a client schema (a
    // schema without resolvers).
    const schema = buildClientSchema(data);

    // Update our component with the new schema.
    this.setState({ schema });

    // Do some hacky stuff to GraphiQL.
    this._updateGraphiQLDocExplorerNavStack(schema);
  }

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
  _updateGraphiQLDocExplorerNavStack(nextSchema) {
    // Get the documentation explorer component from GraphiQL. Unfortunately
    // for them this looks like public API. Muwahahahaha.
    const { docExplorerComponent } = this.graphiql;
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
          const nextLastType = nextSchema.getType(navStack[i - 1] ? navStack[i - 1].name : null);

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
      .filter(_ => _);

    // This is very hacky but works. React is cool.
    if (allOk) {
      this.graphiql.docExplorerComponent.setState({
        // If we are not ok, just reset the `navStack` with an empty array.
        // Otherwise use our new stack.
        navStack: nextNavStack,
      });
    }
  }

  render() {
    const { schema } = this.state;
    return (
      <GraphiQL
        ref={ref => (this.graphiql = ref)}
        schema={schema}
        fetcher={params => this.executeQuery(params)}
      />
    );
  }
}

export default PostGraphiQL;
