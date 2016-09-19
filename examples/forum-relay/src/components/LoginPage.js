import React from 'react'
import LoginForm from './LoginForm'
import Redirect from 'react-router/Redirect'

class LoginPage extends React.Component {
  static contextTypes = {
    auth: React.PropTypes.object,
  }

  state = {
    success: null,
  }

  onSubmit = ({ email, password }) => {
    this.context.auth.handleLogin({ email, password })
      .then(() => this.setState({ success: true }))
      .catch(() => this.setState({ success: false }))
  }

  render() {
    if (this.state.success)
      return <Redirect to="/posts" />

    return <LoginForm onSubmit={this.onSubmit} />
  }
}

export default LoginPage
