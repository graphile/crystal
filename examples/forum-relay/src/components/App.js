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
  homeQueries,
  postIndexQueries,
  postQueries,
  registerQueries
} from '../queries'

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
          <MatchRelay
            exactly
            pattern="/"
            component={HomePage}
            queries={homeQueries}
          />
          <MatchRelay
            exactly
            pattern="/posts"
            component={PostIndexPage}
            queries={postIndexQueries}
            prepareParams={(params) => { 
              const { offset } = params
              params = { ...params, offset: parseInt(offset) || 0 }
              return params
            }}
          />
          <MatchRelay
            exactly
            pattern="/posts/:postId"
            component={PostPage}
            queries={postQueries}
          />
          <MatchRelay
            pattern="/register"
            component={RegisterPage}
            queries={registerQueries}
          />
          <Match
            pattern="/login"
            component={LoginPage}
          />
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
    paddingTop: '1.5em',
    marginTop: '1.5em',
    color: '#0095ff',
  },
})

export default authDecorator(App)
