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
          <label htmlFor="givenName">Given Name</label>
          <input ref={(ref) => this.fields.givenName = ref} name="givenName" type="text"/>
        </div>
        <div>
          <label htmlFor="familyName">Family Name</label>
          <input ref={(ref) => this.fields.familyName = ref} name="familyName" type="text"/>
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
