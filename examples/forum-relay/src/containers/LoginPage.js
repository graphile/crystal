import React from 'react'
import { withRouter } from 'react-router'
import LoginForm from '../components/LoginForm'

class LoginPage extends React.Component {
  onSubmit = (login) => {
    this.props.loginPerson(login).then(() => {
      this.props.router.push('/posts')
    }).catch(err => console.error(err))
  }

  render() {
    return <LoginForm onSubmit={this.onSubmit} />
  }
}

export default withRouter(LoginPage)
