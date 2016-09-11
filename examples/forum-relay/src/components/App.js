import React from 'react'
import { Link } from 'react-router'
import { StyleSheet, css } from 'aphrodite'
import authDecorator from '../utils/authDecorator'
import 'sanitize.css/sanitize.css'

class App extends React.Component {
  static childContextTypes = {
    user: React.PropTypes.object,
  }

  getChildContext() {
    return { user: this.props.user }
  }

  render() {
    return (
      <div className={css(styles.container)}>
        <header className={css(styles.header)}>
          <Logo />
          {this.props.user.authenticated
            ? <button onClick={this.props.handleLogout}>Logout</button>
            : <LoginForm handleLogin={this.props.handleLogin}>Login</LoginForm>
          }
        </header>
        <main>
          {this.props.children}
        </main>
        <footer className={css(styles.footer)}>
          <p>An example application for PostGraphQL and Relay</p>
        </footer>
      </div>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: '0 1.5em',
  },
  header: {
    padding: '1.5em 0',
  },
  footer: {
    borderTop: '2px solid #0095ff',
    paddingTop: '1.5em',
    marginTop: '1.5em',
    color: '#0095ff',
  },
})

function Logo() {
  return (
    <Link className={css(logoStyles.link)} to="/">
      <h1 className={css(logoStyles.heading)}>
        <span className={css(logoStyles.db)}>Post</span>
        <span className={css(logoStyles.graphql)}>GraphQL</span>
      </h1>
      <p className={css(logoStyles.tagline)}>Forum Example with Relay</p>
    </Link>
  )
}

const logoStyles = StyleSheet.create({
  link: {
    textDecoration: 'none',
  },
  heading: {
    fontSize: '3em',
    margin: 0,
  },
  db: {
    color: '#0095ff',
  },
  graphql: {
    color: '#e535ab',
  },
  tagline: {
    margin: 0,
    fontSize: 1.25,
    color: '#333',
  }
})

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

export default authDecorator(App)
