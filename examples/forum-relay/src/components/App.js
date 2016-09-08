import React from 'react';
import { Link, withRouter } from 'react-router'
import jwtDecode from 'jwt-decode'
import Relay from 'react-relay'
import { RelayNetworkLayer, authMiddleware } from 'react-relay-network-layer';

Relay.injectNetworkLayer(new RelayNetworkLayer([
  authMiddleware({
    token: localStorage.getItem('token'),
    allowEmptyToken: true,
  }),
]))

class App extends React.Component {
  state = {
    authenticated: false,
  }

  componentWillMount() {
    this.authenticate()
  }

  authenticate() {
    const token = localStorage.getItem('token')
    if (!token) return

    const payload = jwtDecode(token)
    const expiryDate = new Date(payload.exp * 1000)
    const currentDate = new Date()
    if (expiryDate < currentDate) {
      // TODO(Ferdi): notify that your token has expired
      this.handleLogout()
    }

    this.setState({ authenticated: true })
  }

  handleLogin = (data) => {
    return fetch(AUTH_URL, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
    .then(res => res.json())
    .then(({ success, token }) => {
      if (!success) return
      const { person_id } = jwtDecode(token)
      localStorage.setItem('token', token)
      localStorage.setItem('userId', person_id)
      this.setState({ authenticated: true })
      this.props.router.push('/posts')
    })
  }

  handleLogout = () => {
    localStorage.removeItem('token')
    this.props.router.push('/')
    this.setState({ authenticated: false })
    // TODO(Ferdi): Notify that you have logged out
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
          <nav>
            <Link to="/">Home</Link>
            <Link to="/posts">Posts</Link>
          </nav>
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

export default withRouter(App)
