import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import { Link } from 'react-router'
import Logo from './Logo'
import authDecorator from '../utils/authDecorator'

class App extends React.Component {
  // We use React Context to share state
  // Redux might make sense though …
  static childContextTypes = {
    user: React.PropTypes.object,
    auth: React.PropTypes.object,
  }

  getChildContext() {
    return {
      user: this.props.user,
      auth: this.props.auth,
    }
  }

  // TODO: Implement Navigation component

  render() {
    return (
      <div className={css(styles.container)}>
        <header className={css(styles.header)}>
          <Logo />
          <Navigation auth={this.props.auth} user={this.props.user} />
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

// TODO: Implement Navigation component
function Navigation({ auth, user }) {
  return (
    <nav>
      <Link to="/">Home</Link>{' '}
      <Link to="/posts">Posts</Link>
      {user.authenticated
        ? <button onClick={auth.handleLogout}>Logout</button>
        : (
          <div>
            <Link to="/login">Login</Link>{' '}
            <Link to="/register">Register</Link>
          </div>
        )
      }
    </nav>
  )
}


export default authDecorator(App)
