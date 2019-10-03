import React from 'react';
import GraphiQL from 'graphiql';
import { parse } from 'graphql';
import GraphiQLExplorer from 'graphiql-explorer';
import StorageAPI from 'graphiql/dist/utility/StorageAPI';
import './postgraphiql.css';
import { buildClientSchema, introspectionQuery, isType, GraphQLObjectType } from 'graphql';
import { SubscriptionClient } from 'subscriptions-transport-ws';

const defaultQuery = `\
# Welcome to PostGraphile's built-in GraphiQL IDE
#
# GraphiQL is an in-browser tool for writing, validating, and
# testing GraphQL queries.
#
# Type queries into this side of the screen, and you will see intelligent
# typeaheads aware of the current GraphQL type schema and live syntax and
# validation errors highlighted within the text.
#
# GraphQL queries typically start with a "{" character. Lines that starts
# with a # are ignored.
#
# An example GraphQL query might look like:
#
#     {
#       field(arg: "value") {
#         subField
#       }
#     }
#
# Keyboard shortcuts:
#
#  Prettify Query:  Shift-Ctrl-P (or press the prettify button above)
#
#     Merge Query:  Shift-Ctrl-M (or press the merge button above)
#
#       Run Query:  Ctrl-Enter (or press the play button above)
#
#   Auto Complete:  Ctrl-Space (or just start typing)
#
`;

const isSubscription = ({ query }) =>
  parse(query).definitions.some(
    definition =>
      definition.kind === 'OperationDefinition' && definition.operation === 'subscription',
  );

const {
  POSTGRAPHILE_CONFIG = {
    graphqlUrl: 'http://localhost:5000/graphql',
    streamUrl: 'http://localhost:5000/graphql/stream',
    enhanceGraphiql: true,
    subscriptions: true,
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

const l = window.location;
const websocketUrl = POSTGRAPHILE_CONFIG.graphqlUrl.match(/^https?:/)
  ? POSTGRAPHILE_CONFIG.graphqlUrl.replace(/^http/, 'ws')
  : `ws${l.protocol === 'https:' ? 's' : ''}://${l.hostname}${
      l.port !== 80 && l.port !== 443 ? ':' + l.port : ''
    }${POSTGRAPHILE_CONFIG.graphqlUrl}`;

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
    query: '',
    showHeaderEditor: false,
    headersText: '{\n"Authorization": null\n}\n',
    headersTextValid: true,
    explorerIsOpen: this._storage.get('explorerIsOpen') === 'false' ? false : true,
    haveActiveSubscription: false,
    socketStatus:
      POSTGRAPHILE_CONFIG.enhanceGraphiql && POSTGRAPHILE_CONFIG.subscriptions ? 'pending' : null,
  };

  _onEditQuery = query => {
    this.setState({ query });
  };

  subscriptionsClient =
    POSTGRAPHILE_CONFIG.enhanceGraphiql && POSTGRAPHILE_CONFIG.subscriptions
      ? new SubscriptionClient(websocketUrl, {
          reconnect: true,
          connectionParams: () => this.getHeaders() || {},
        })
      : null;

  activeSubscription = null;

  componentDidMount() {
    // Update the schema for the first time. Log an error if we fail.
    this.updateSchema();

    if (this.subscriptionsClient) {
      const unlisten1 = this.subscriptionsClient.on('connected', () => {
        this.setState({ socketStatus: 'connected', error: null });
      });
      const unlisten2 = this.subscriptionsClient.on('disconnected', () => {
        this.setState({ socketStatus: 'disconnected' });
      });
      const unlisten3 = this.subscriptionsClient.on('connecting', () => {
        this.setState({ socketStatus: 'connecting' });
      });
      const unlisten4 = this.subscriptionsClient.on('reconnected', () => {
        this.setState({ socketStatus: 'reconnected', error: null });
        setTimeout(() => {
          this.setState(state =>
            state.socketStatus === 'reconnected' ? { socketStatus: 'connected' } : {},
          );
        }, 5000);
      });
      const unlisten5 = this.subscriptionsClient.on('reconnecting', () => {
        this.setState({ socketStatus: 'reconnecting' });
      });
      const unlisten6 = this.subscriptionsClient.on('error', error => {
        // tslint:disable-next-line no-console
        console.error('Client connection error', error);
        this.setState({ error: new Error('Subscriptions client connection error') });
      });
      this.unlistenSubscriptionsClient = () => {
        unlisten1();
        unlisten2();
        unlisten3();
        unlisten4();
        unlisten5();
        unlisten6();
      };
    }

    // If we were given a `streamUrl`, we want to construct an `EventSource`
    // and add listeners.
    if (POSTGRAPHILE_CONFIG.streamUrl) {
      // Starts listening to the event stream at the `sourceUrl`.
      const eventSource = new EventSource(POSTGRAPHILE_CONFIG.streamUrl);

      // When we get a change notification, we want to update our schema.
      eventSource.addEventListener(
        'change',
        () => {
          this.updateSchema();
        },
        false,
      );

      // Add event listeners that just log things in the console.
      eventSource.addEventListener(
        'open',
        () => {
          // tslint:disable-next-line no-console
          console.log('PostGraphile: Listening for server sent events');
          this.setState({ error: null });
          this.updateSchema();
        },
        false,
      );
      eventSource.addEventListener(
        'error',
        error => {
          // tslint:disable-next-line no-console
          console.error('PostGraphile: Failed to connect to event stream', error);
          this.setState({ error: new Error('Failed to connect to event stream') });
        },
        false,
      );

      // Store our event source so we can unsubscribe later.
      this._eventSource = eventSource;
    }
    const graphiql = this.graphiql;
    this.setState({ query: graphiql._storage.get('query') || defaultQuery });
    const editor = graphiql.getQueryEditor();
    editor.setOption('extraKeys', {
      ...(editor.options.extraKeys || {}),
      'Shift-Alt-LeftClick': this._handleInspectOperation,
    });
  }

  componentWillUnmount() {
    if (this.unlistenSubscriptionsClient) this.unlistenSubscriptionsClient();
    // Close out our event source so we get no more events.
    this._eventSource.close();
    this._eventSource = null;
  }

  _handleInspectOperation = (cm, mousePos) => {
    const parsedQuery = parse(this.state.query || '');

    if (!parsedQuery) {
      console.error("Couldn't parse query document");
      return null;
    }

    var token = cm.getTokenAt(mousePos);
    var start = { line: mousePos.line, ch: token.start };
    var end = { line: mousePos.line, ch: token.end };
    var relevantMousePos = {
      start: cm.indexFromPos(start),
      end: cm.indexFromPos(end),
    };

    var position = relevantMousePos;

    var def = parsedQuery.definitions.find(definition => {
      if (!definition.loc) {
        console.log('Missing location information for definition');
        return false;
      }

      const { start, end } = definition.loc;
      return start <= position.start && end >= position.end;
    });

    if (!def) {
      console.error('Unable to find definition corresponding to mouse position');
      return null;
    }

    var operationKind =
      def.kind === 'OperationDefinition'
        ? def.operation
        : def.kind === 'FragmentDefinition'
        ? 'fragment'
        : 'unknown';

    var operationName =
      def.kind === 'OperationDefinition' && !!def.name
        ? def.name.value
        : def.kind === 'FragmentDefinition' && !!def.name
        ? def.name.value
        : 'unknown';

    var selector = `.graphiql-explorer-root #${operationKind}-${operationName}`;

    var el = document.querySelector(selector);
    el && el.scrollIntoView();
  };

  cancelSubscription = () => {
    if (this.activeSubscription !== null) {
      this.activeSubscription.unsubscribe();
      this.setState({
        haveActiveSubscription: false,
      });
    }
  };

  /**
   * Get the user editable headers as an object
   */
  getHeaders() {
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
    return extraHeaders;
  }

  /**
   * Executes a GraphQL query with some extra information then the standard
   * parameters. Namely a JWT which may be added as an `Authorization` header.
   */
  async executeQuery(graphQLParams) {
    const extraHeaders = this.getHeaders();
    const response = await fetch(POSTGRAPHILE_CONFIG.graphqlUrl, {
      method: 'POST',
      headers: Object.assign(
        {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        extraHeaders,
      ),
      credentials: 'same-origin',
      body: JSON.stringify(graphQLParams),
    });

    const result = await response.json();

    return result;
  }

  /**
   * Routes the request either to the subscriptionClient or to executeQuery.
   */
  fetcher = graphQLParams => {
    this.cancelSubscription();
    if (isSubscription(graphQLParams) && this.subscriptionsClient) {
      return {
        subscribe: observer => {
          observer.next('Waiting for subscription to yield data…');

          // Hack because GraphiQL logs `[object Object]` on error otherwise
          const oldError = observer.error;
          observer.error = function(error) {
            let stack;
            try {
              stack = JSON.stringify(error, null, 2);
            } catch (e) {
              stack = error.message || error;
            }
            oldError.call(this, {
              stack,
              ...error,
            });
          };

          const subscription = this.subscriptionsClient.request(graphQLParams).subscribe(observer);
          this.setState({ haveActiveSubscription: true });
          this.activeSubscription = subscription;
          return subscription;
        },
      };
    } else {
      return this.executeQuery(graphQLParams);
    }
  };

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

      // tslint:disable-next-line no-console
      console.log('PostGraphile: Schema updated');
      this.setState({ error: null });
    } catch (error) {
      // tslint:disable-next-line no-console
      console.error('Error occurred when updating the schema:');
      // tslint:disable-next-line no-console
      console.error(error);
      this.setState({ error });
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
        }),
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
        JSON.stringify(this.state.explorerIsOpen),
      ),
    );
  };

  renderSocketStatus() {
    const { socketStatus, error } = this.state;
    if (socketStatus === null) {
      return null;
    }
    const icon =
      {
        connecting: '🤔',
        reconnecting: '😓',
        connected: '😀',
        reconnected: '😅',
        disconnected: '☹️',
      }[socketStatus] || '😐';
    const tick = (
      <path fill="transparent" stroke="white" d="M30,50 L45,65 L70,30" strokeWidth="8" />
    );
    const cross = (
      <path fill="transparent" stroke="white" d="M30,30 L70,70 M30,70 L70,30" strokeWidth="8" />
    );
    const decoration =
      {
        connecting: null,
        reconnecting: null,
        connected: tick,
        reconnected: tick,
        disconnected: cross,
      }[socketStatus] || null;
    const color =
      {
        connected: 'green',
        reconnected: 'green',
        connecting: 'orange',
        reconnecting: 'orange',
        disconnected: 'red',
      }[socketStatus] || 'gray';
    const svg = (
      <svg width="25" height="25" viewBox="0 0 100 100" style={{ marginTop: 4 }}>
        <circle fill={color} cx="50" cy="50" r="45" />
        {decoration}
      </svg>
    );
    return (
      <>
        {error ? (
          <div
            style={{ fontSize: '1.5em', marginRight: '0.25em' }}
            title={error.message || `Error occurred: ${error}`}
            onClick={() => this.setState({ error: null })}
          >
            <span aria-label="ERROR" role="img">
              {'⚠️'}
            </span>
          </div>
        ) : null}
        <div
          style={{ fontSize: '1.5em', marginRight: '0.25em' }}
          title={'Websocket status: ' + socketStatus}
          onClick={this.cancelSubscription}
        >
          <span aria-label={socketStatus} role="img">
            {svg || icon}
          </span>
        </div>
      </>
    );
  }

  setGraphiqlRef = ref => {
    if (!ref) {
      return;
    }
    this.graphiql = ref;
    this.setState({ mounted: true });
  };

  render() {
    const { schema } = this.state;
    const sharedProps = {
      ref: this.setGraphiqlRef,
      schema: schema,
      fetcher: this.fetcher,
    };
    if (!POSTGRAPHILE_CONFIG.enhanceGraphiql) {
      return <GraphiQL {...sharedProps} />;
    } else {
      return (
        <div className="postgraphiql-container graphiql-container">
          <GraphiQLExplorer
            schema={schema}
            query={this.state.query}
            onEdit={this._onEditQuery}
            onRunOperation={operationName => this.graphiql.handleRunQuery(operationName)}
            explorerIsOpen={this.state.explorerIsOpen}
            onToggleExplorer={this.handleToggleExplorer}
            //getDefaultScalarArgValue={getDefaultScalarArgValue}
            //makeDefaultArg={makeDefaultArg}
          />
          <GraphiQL onEditQuery={this._onEditQuery} query={this.state.query} {...sharedProps}>
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
              {this.renderSocketStatus()}
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
              this.setState(
                {
                  headersText: e.target.value,
                  headersTextValid: isValidJSON(e.target.value),
                },
                () => {
                  if (this.state.headersTextValid && this.subscriptionsClient) {
                    // Reconnect to websocket with new headers
                    this.subscriptionsClient.close(false, true);
                  }
                },
              )
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
