import React from 'react'
import Relay from 'react-relay'
import jwtDecode from 'jwt-decode'
import { RelayNetworkLayer, authMiddleware, urlMiddleware } from 'react-relay-network-layer'

const AUTH_URL = 'http://localhost:3000/token'

const authDecorator = WrappedComponent => 
  class AuthDecorator extends React.Component {
    state = { ...defaultState }

    componentWillMount() {
      const token = localStorage.getItem('token')
      if (!token)
        return
      else if (isTokenExpired(token))
        this.clearAuth()
      else
        this.setAuth(token)
    }

    setAuth(token) {
      setupNetwork(token)
      this.setState({
        token,
        authenticated: true,
        ...jwtDecode(token),
      })
    }

    clearAuth() {
      localStorage.removeItem('token')
      setupNetwork(null) // removes token from fetch headers
      this.setState({
        ...defaultState
      })
    }

    // use async here (babel)
    handleLogin = (data) => {
      return fetchToken(data)
        .then((token) => (this.setAuth(token), token))
        .then((token) => localStorage.setItem('token', token))
        .catch((err) => console.error(err))
    }

    handleLogout = () => {
      this.clearAuth()
    }

    render() {
      return (
        <WrappedComponent
          user={this.state}
          auth={{
            handleLogin: this.handleLogin,
            handleLogout: this.handleLogout,
          }}
          {...this.props}
        />
      )
    }
  }

const defaultState = {
  authenticated: false,
  token: null,
}

const setupNetwork = (token) => {
  Relay.injectNetworkLayer(new RelayNetworkLayer([
    authMiddleware({
      allowEmptyToken: true,
      token,
    }),
  ], { disableBatchQuery: true }))
}

const isTokenExpired = (token) => {
  const tokenPayload = jwtDecode(token)
  const expiryDate = new Date(tokenPayload.exp * 1000)
  const currentDate = new Date()
  return expiryDate < currentDate
}

const fetchToken = (data) => {
  const options = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  }
  return fetch(AUTH_URL, options)
    .then(res => res.json())
    .then(({ err, token }) => {
      if (err) throw new Error(err.message)
      else return token
    })
    .then((token) => token)
}


export default authDecorator
