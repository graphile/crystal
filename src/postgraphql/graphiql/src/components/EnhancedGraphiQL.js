import React from 'react'
import GraphiQL from 'graphiql'
import { buildClientSchema, introspectionQuery } from 'graphql'
import { ToastContainer, ToastMessage } from 'react-toastr'
import TokenSetter from './TokenSetter'
import styles from './EnhancedGraphiQL.css'

const ToastMessageFactory = React.createFactory(ToastMessage.animation)

class EnhancedGraphiQL extends React.Component {
  static propTypes = {
    config: React.PropTypes.shape({
      graphqlPath: React.PropTypes.string.isRequired,
      watchPg: React.PropTypes.bool.isRequired,
      jwt: React.PropTypes.bool.isRequired,
    }),
    setupEventSource: React.PropTypes.func.isRequired,
  }

  state = {
    schema: undefined,
    token: undefined,
  }

  componentWillMount() {
    const { config, setupEventSource } = this.props
    if (config.watchPg) {
      this._eventSource = setupEventSource({
        onChange: this.onSchemaChange,
        onOpen: this.onSourceOpen,
        onError: this.onSourceError,
      })
    }
  }

  componentWillUnmount() {
    this._eventSource.close()
  }

  render() {
    let headers
    if (this.state.token)
      headers = { 'Authorization': `Bearer: ${this.state.token}` }

    const graphQLFetcher = this.configureGraphQLFetcher({ headers })

    return (
      <div className={styles.root}>
        <div className={styles.graphiql}>
          <GraphiQL
            schema={this.state.schema}
            fetcher={graphQLFetcher}
          />
        </div>
        <div className={styles.footer}>
          {this.props.config.jwt &&
            <TokenSetter
              setToken={this.setToken}
              token={this.state.token}
            />
          }
        </div>
        <ToastContainer
          toastMessageFactory={ToastMessageFactory}
          className="toast-top-right"
          ref="toaster"
        />
      </div>
    )
  }

  onSchemaChange = event => {
    const graphQLFetcher = this.configureGraphQLFetcher({})
    this.setState({ schema: undefined })
    graphQLFetcher({ query: introspectionQuery })
      .then(result => buildClientSchema(result.data))
      .then(schema => this.setState({ schema }))
      .then(() => this.renderToast('success', 'Schema updated.'))
      .catch(() => this.renderToast('error', 'Failed to update schema.'))
  }

  onSourceOpen = event => {
    console.log('PostGraphQL: Watching schema for changes.')
  }

  onSourceError = event => {
    console.log('PostGraphQL: The connection was lost. Attempting to reconnect …')
  }

  configureGraphQLFetcher = config => graphQLParams => {
    const headers = Object.assign({}, {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }, config.headers)

    return fetch(this.props.config.graphqlPath, {
      method: 'POST',
      headers,
      body: JSON.stringify(graphQLParams),
      credentials: 'include',
    }).then(response => response.json())
  }

  renderToast = (type, title, message) => {
    this.refs.toaster[type](title, message, {
      showAnimation: `animated slideInRight`,
      hideAnimation: `animated fadeOut`,
      timeOut: 4000,
    })
  }

  setToken = token => {
    this.setState({ token })
  }
}

export default EnhancedGraphiQL
