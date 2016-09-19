import React from 'react'
import Relay from 'react-relay'
import Redirect from 'react-router/Redirect'
import RegisterForm from './RegisterForm'
import { RegisterPersonMutation } from '../mutations'

class RegisterPage extends React.Component {
  static contextTypes = {
    auth: React.PropTypes.object,
  }

  state = {
    success: null,
  }

  onSubmit = (data) => {
    this.props.relay.commitUpdate(new RegisterPersonMutation({
      viewer: this.props.viewer,
      person: data,
    }), {
      onFailure: this.onFailure,
      onSuccess: this.onSuccess(data),
    })
  }

  onFailure = (transaction) => {
    this.setState({ success: false })
  }

  onSuccess = (data) => (response) => {
    this.context.auth.handleLogin({
      email: data.email,
      password: data.password,
    })
      .then(() => this.setState({ success: true }))
      .catch(() => this.setState({ success: false }))
  }

  render() {
    if (this.state.success)
      return <Redirect to="/" />

    return <RegisterForm onSubmit={this.onSubmit} />
  }
}

export default Relay.createContainer(RegisterPage, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        ${RegisterPersonMutation.getFragment('viewer')}
      }
    `,
  },
})
