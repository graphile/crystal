import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import Match from 'react-router/Match'
import Miss from 'react-router/Miss'
import MatchRelay from '../utils/MatchRelay'
import authDecorator from '../utils/authDecorator'
import Logo from './Logo'
import Navigation from './Navigation'
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

// We use React Context to share state
// Redux might make sense though …

class App extends React.Component {
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

export default authDecorator(App)
