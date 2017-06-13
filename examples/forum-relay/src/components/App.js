import React from 'react'
import Relay from 'react-relay'
import { StyleSheet, css } from 'aphrodite'
import { Link } from 'react-router'
import authDecorator from '../utils/authDecorator'
import Navigation from './Navigation'
import Logo from './Logo'

const App = ({
  children,
  auth,
  query,
}) => (
  <div className={css(styles.container)}>
    <header className={css(styles.header)}>
      <Logo/>
      <Navigation
        currentPerson={auth.currentPerson}
        logoutPerson={auth.logoutPerson}
      />
    </header>
    <main>
      {React.Children.map(children, element =>
        React.cloneElement(element, auth)
      )}
    </main>
    <footer className={css(styles.footer)}>
      <p>An example application for PostGraphQL and Relay</p>
    </footer>
  </div>
)

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
