import React from 'react'
import 'sanitize.css/sanitize.css'
import { Link, withRouter } from 'react-router'
import jwtDecode from 'jwt-decode'
import Relay from 'react-relay'
import { RelayNetworkLayer, authMiddleware, urlMiddleware } from 'react-relay-network-layer'

const defaultState = {
  authenticated: false,
  token: null,
}

const fetchToken = (data) => {
  return fetch(AUTH_URL, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  })
  .then(res => res.json())
  .then(({ token }) => token)
  .catch(err => console.log(err))
}

const setupNetwork = (token) => {
  Relay.injectNetworkLayer(new RelayNetworkLayer([
    authMiddleware({
      allowEmptyToken: true,
      token,
    }),
  ], { disableBatchQuery: true }))
}

const isTokenExpired = (token) => {
  const tokenPayload = jwtDecode(token)
  const expiryDate = new Date(tokenPayload.exp * 1000)
  const currentDate = new Date()
  return expiryDate < currentDate
}

class App extends React.Component {
  state = { ...defaultState }

  static childContextTypes = {
    user: React.PropTypes.object,
  }

  getChildContext() {
    return { user: this.state }
  }

  componentWillMount() {
    const token = localStorage.getItem('token')
    if (!token)
      return
    else if (isTokenExpired(token))
      this.clearAuth()
    else
      this.setAuth(token)
  }

  setAuth(token) {
    setupNetwork(token)
    this.setState({
      token,
      authenticated: true,
      ...jwtDecode(token),
    })
  }

  clearAuth() {
    localStorage.removeItem('token')
    setupNetwork(null) // remove token from fetch headers
    this.setState({
      ...defaultState
    })
  }

  handleLogin = (data) => {
    fetchToken(data).then(token => {
      localStorage.setItem('token', token)
      this.setAuth(token)
    })
  }

  handleLogout = () => {
    this.clearAuth()
  }

  render() {
    return (
      <div>
        <header>
          <Link to="/"><h1>Forum Example</h1></Link>
          {this.state.authenticated
            ? <button onClick={this.handleLogout}>Logout</button>
            : <LoginForm handleLogin={this.handleLogin}>Login</LoginForm>
          }
        </header>
        <main>
          {this.props.children}
        </main>
        <footer>
          <p>An example application for PostGraphQL and Relay</p>
        </footer>
      </div>
    )
  }
}

class LoginForm extends React.Component {
  onSubmit = (event) => {
    event.preventDefault()
    this.props.handleLogin({
      email: this.email.value,
      password: this.password.value,
    })
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input ref={(ref) => this.email = ref} name="email" type="text"/>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input ref={(ref) => this.password = ref} name="password" type="text"/>
        </div>
        <input type="submit"/>
      </form>
    )
  }
}

export default App
