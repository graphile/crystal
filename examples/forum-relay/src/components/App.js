import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import { Link } from 'react-router'
import Logo from './Logo'
import Navigation from './Navigation'
import authDecorator from '../utils/authDecorator'

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
    paddingTop: '1.5em',
    marginTop: '1.5em',
    color: '#0095ff',
  },
})

export default authDecorator(App)
