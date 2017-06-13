import React from 'react'

// getFieldValues :: Object -> Object
const getFieldValues = (fields) => {
  return Object.keys(fields).reduce((obj, key) => {
    obj[key] = fields[key].value
    return obj
  }, {})
}

// TODO: Implement Form Components

class RegisterForm extends React.Component {
  fields = {}

  onSubmit = (event) => {
    const { onSubmit } = this.props
    event.preventDefault()
    onSubmit(getFieldValues(this.fields))
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <div>
          <label htmlFor="firstName">First Name</label>
          <input ref={(ref) => this.fields.firstName = ref} name="givenName" type="text"/>
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <input ref={(ref) => this.fields.lastName = ref} name="familyName" type="text"/>
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input ref={(ref) => this.fields.email = ref} name="email" type="text"/>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input ref={(ref) => this.fields.password = ref} name="password" type="text"/>
        </div>
        <input type="submit"/>
      </form>
    )
  }
}

export default RegisterForm
