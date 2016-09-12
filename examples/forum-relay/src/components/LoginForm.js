import React from 'react'

// getFieldValues :: Object -> Object
const getFieldValues = (fields) =>
  Object.keys(fields).reduce((obj, key) => {
    obj[key] = fields[key].value
    return obj
  }, {})

// TODO: Implement Form Components

class LoginForm extends React.Component {
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

export default LoginForm
