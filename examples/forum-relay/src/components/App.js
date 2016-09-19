import React from 'react'
import Relay from 'react-relay'
import { StyleSheet, css } from 'aphrodite'
import Match from 'react-router/Match'
import Link from 'react-router/Link'
import Miss from 'react-router/Miss'
import authDecorator from '../utils/authDecorator'
import Logo from './Logo'
import HomePage from './HomePage'
import PostIndexPage from './PostIndexPage'
import PostPage from './PostPage'
import RegisterPage from './RegisterPage'
import LoginPage from './LoginPage'
import {
  HomeQueries,
  PostIndexQueries,
  PostQueries,
  RegisterQueries
} from '../queries'

const MatchRelay = ({ component, queries, ...rest }) =>
  <Match {...rest} render={(props) => {
    const queryConfig = {
      name: props.pathname,
      params: props.params,
      queries,
    }
    return (
      <Relay.Renderer
        {...props}
        Container={component}
        queryConfig={queryConfig}
        environment={Relay.Store}
      />
    )
  }}/>

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

  render() {
    return (
      <div className={css(styles.container)}>
        <header className={css(styles.header)}>
          <Logo />
          <Navigation auth={this.props.auth} user={this.props.user} />
        </header>
        <main>
          <MatchRelay exactly pattern="/" component={HomePage} queries={HomeQueries} />
          <MatchRelay exactly pattern="/posts" component={PostIndexPage} queries={PostIndexQueries} />
          <MatchRelay pattern="/posts/:postId" component={PostPage} queries={PostQueries} />
          <MatchRelay pattern="/register" component={RegisterPage} queries={RegisterQueries} />
          <Match pattern="/login" component={LoginPage} />
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
