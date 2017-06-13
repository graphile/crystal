import React from 'react'
import { withRouter } from 'react-router'
import RegisterForm from '../components/RegisterForm'

class RegisterPage extends React.Component {
  onSubmit = person => {
    this.props.registerPerson(person).then(() => {
      this.props.router.push('/posts')
    }).catch(err => console.error(err))
  }

  render() {
    return <RegisterForm onSubmit={this.onSubmit}/>
  }
}

export default withRouter(RegisterPage)
