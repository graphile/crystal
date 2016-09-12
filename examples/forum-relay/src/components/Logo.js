import React from 'react'
import { Link } from 'react-router'
import { StyleSheet, css } from 'aphrodite'

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

export default Logo
