import React from 'react';
import GraphiQL from 'graphiql';
import GraphiQLExplorer from 'graphiql-explorer';
import StorageAPI from 'graphiql/dist/utility/StorageAPI';
import './postgraphiql.css';
import { buildClientSchema, introspectionQuery, isType, GraphQLObjectType } from 'graphql';

const {
  POSTGRAPHILE_CONFIG = {
    graphqlUrl: 'http://localhost:5000/graphql',
    streamUrl: 'http://localhost:5000/graphql/stream',
    enhanceGraphiql: true,
  },
} = window;

const isValidJSON = json => {
  try {
    JSON.parse(json);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * The GraphiQL Explorer sidebar.
 */
class ExplorerWrapper extends React.PureComponent {
  state = {
    query: '',
  };
  componentDidMount() {
    const graphiql = this.props.graphiql;
    // Extract query from the graphiql ref
    if (graphiql) {
      this.setState({ query: graphiql.state.query });
    }
    // Set onEditQuery in the parent so that we can be notified of query changes
    this.props.setOnEditQuery(query => this.setState({ query }));
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.graphiql && this.props.graphiql) {
      // Extract query from the graphiql ref
      this.setState({ query: this.props.graphiql.state.query });
    }
  }

  _onEditQuery = query => {
    const graphiql = this.props.graphiql;
    if (graphiql) {
      graphiql.handleEditQuery(query);
    }
  };
  render() {
    return (
      <GraphiQLExplorer
        schema={this.props.schema}
        query={this.state.query}
        onEdit={this._onEditQuery}
        explorerIsOpen={this.props.explorerIsOpen}
        onToggleExplorer={this.props.onToggleExplorer}
      />
    );
  }
}

/**
 * The standard GraphiQL interface wrapped with some PostGraphile extensions.
 * Including a JWT setter and live schema udpate capabilities.
 */
class PostGraphiQL extends React.PureComponent {
  // Use same storage as GraphiQL to save explorer visibility state
  _storage = new StorageAPI();

  state = {
    // Our GraphQL schema which GraphiQL will use to do its intelligence
    // stuffs.
    schema: null,
    showHeaderEditor: false,
    headersText: '{\n"Authorization": null\n}\n',
    headersTextValid: true,
    explorerIsOpen: this._storage.get('explorerIsOpen') === 'false' ? false : true,
  };

  componentDidMount() {
    // Update the schema for the first time. Log an error if we fail.
    this.updateSchema().catch(error => console.error(error)); // tslint:disable-line no-console

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
        false
      );

      // Add event listeners that just log things in the console.
      eventSource.addEventListener(
        'open',
        () => {
          // tslint:disable-next-line no-console
          console.log('PostGraphile: Listening for server sent events');
          this.updateSchema();
        },
        false
      );
      eventSource.addEventListener(
        'error',
        // tslint:disable-next-line no-console
        () => console.log('PostGraphile: Failed to connect to server'),
        false
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
  async executeQuery(graphQLParams) {
    const { headersText } = this.state;
    let extraHeaders;
    try {
      extraHeaders = JSON.parse(headersText);
      for (const k in extraHeaders) {
        if (extraHeaders[k] == null) {
          delete extraHeaders[k];
        }
      }
    } catch (e) {
      // Do nothing
    }
    const response = await fetch(POSTGRAPHILE_CONFIG.graphqlUrl, {
      method: 'POST',
      headers: Object.assign(
        {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        extraHeaders
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
    try {
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
    } catch (e) {
      // tslint:disable-next-line no-console
      console.error('Error occurred when updating the schema:');
      // tslint:disable-next-line no-console
      console.error(e);
    }
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

  getQueryEditor = () => {
    return this.graphiql.getQueryEditor();
  };

  handlePrettifyQuery = () => {
    const editor = this.getQueryEditor();
    if (typeof window.prettier !== 'undefined' && typeof window.prettierPlugins !== 'undefined') {
      // TODO: window.prettier.formatWithCursor
      editor.setValue(
        window.prettier.format(editor.getValue(), {
          parser: 'graphql',
          plugins: window.prettierPlugins,
        })
      );
    } else {
      return this.graphiql.handlePrettifyQuery();
    }
  };

  handleToggleHistory = e => {
    this.graphiql.handleToggleHistory(e);
  };

  handleToggleHeaders = () => {
    this.setState({ showHeaderEditor: !this.state.showHeaderEditor });
  };

  handleToggleExplorer = () => {
    this.setState({ explorerIsOpen: !this.state.explorerIsOpen }, () =>
      this._storage.set(
        'explorerIsOpen',
        // stringify so that storage API will store the state (it deletes key if value is false)
        JSON.stringify(this.state.explorerIsOpen)
      )
    );
  };

  render() {
    const { schema } = this.state;
    const sharedProps = {
      ref: ref => {
        this.setState({ graphiql: ref });
        this.graphiql = ref;
      },
      schema: schema,
      fetcher: params => this.executeQuery(params),
    };
    if (!POSTGRAPHILE_CONFIG.enhanceGraphiql) {
      return <GraphiQL {...sharedProps} />;
    } else {
      return (
        <div className="postgraphiql-container graphiql-container">
          <ExplorerWrapper
            schema={schema}
            graphiql={this.state.graphiql}
            setOnEditQuery={onEditQuery => this.setState({ onEditQuery })}
            explorerIsOpen={this.state.explorerIsOpen}
            onToggleExplorer={this.handleToggleExplorer}
          />
          <GraphiQL onEditQuery={this.state.onEditQuery} {...sharedProps}>
            <GraphiQL.Logo>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div>
                  <img
                    src="https://www.graphile.org/images/postgraphile-tiny.optimized.svg"
                    width="32"
                    height="32"
                    style={{ marginTop: '4px', marginRight: '0.5rem' }}
                  />
                </div>
                <div>
                  PostGraph
                  <em>i</em>
                  QL
                </div>
              </div>
            </GraphiQL.Logo>
            <GraphiQL.Toolbar>
              <GraphiQL.Button
                onClick={this.handlePrettifyQuery}
                title="Prettify Query (Shift-Ctrl-P)"
                label="Prettify"
              />
              <GraphiQL.Button
                onClick={this.handleToggleHistory}
                title="Show History"
                label="History"
              />
              <GraphiQL.Button
                label="Headers"
                title="Modify the headers to be sent with the requests"
                onClick={this.handleToggleHeaders}
              />
              <GraphiQL.Button
                label="Explorer"
                title="Construct a query with the GraphiQL explorer"
                onClick={this.handleToggleExplorer}
              />
            </GraphiQL.Toolbar>
            <GraphiQL.Footer>
              <div className="postgraphile-footer">
                PostGraphile:{' '}
                <a
                  title="Open PostGraphile documentation"
                  href="https://graphile.org/postgraphile/introduction/"
                  target="new"
                >
                  Documentation
                </a>{' '}
                |{' '}
                <a
                  title="Open PostGraphile documentation"
                  href="https://graphile.org/postgraphile/examples/"
                  target="new"
                >
                  Examples
                </a>{' '}
                |{' '}
                <a
                  title="PostGraphile is supported by the community, please sponsor ongoing development"
                  href="https://graphile.org/sponsor/"
                  target="new"
                >
                  Sponsor Development
                </a>
              </div>
            </GraphiQL.Footer>
          </GraphiQL>
          <EditHeaders
            open={this.state.showHeaderEditor}
            value={this.state.headersText}
            valid={this.state.headersTextValid}
            onChange={e =>
              this.setState({
                headersText: e.target.value,
                headersTextValid: isValidJSON(e.target.value),
              })
            }
          >
            <div className="docExplorerHide" onClick={this.handleToggleHeaders}>
              {'\u2715'}
            </div>
          </EditHeaders>
        </div>
      );
    }
  }
}

function EditHeaders({ children, open, value, onChange, valid }) {
  return (
    <div
      className="graphiql-container not-really"
      style={{
        display: open ? 'block' : 'none',
        width: '300px',
        flexBasis: '300px',
      }}
    >
      <div className="docExplorerWrap">
        <div className="doc-explorer">
          <div className="doc-explorer-title-bar">
            <div className="doc-explorer-title">Edit Headers</div>
            <div className="doc-explorer-rhs">{children}</div>
          </div>
          <div className="doc-explorer-contents">
            <textarea
              value={value}
              onChange={onChange}
              style={valid ? {} : { backgroundColor: '#fdd' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostGraphiQL;
