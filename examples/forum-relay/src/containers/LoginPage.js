import React from 'react'
import LoginForm from '../components/LoginForm'
import { withRouter } from 'react-router'

class LoginPage extends React.Component {
  static contextTypes = {
    auth: React.PropTypes.object,
  }

  onSubmit = ({ email, password }) => {
    this.context.auth.handleLogin({ email, password })
      .then(() => this.props.router.push('/posts'))
  }

  render() {
    return <LoginForm onSubmit={this.onSubmit} />
  }
}

export default withRouter(LoginPage)
