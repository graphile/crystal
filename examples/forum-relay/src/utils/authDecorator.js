import React from 'react'
import Relay from 'react-relay'
import jwtDecode from 'jwt-decode'
import { RelayNetworkLayer } from 'react-relay-network-layer'
import authMiddleware from './authMiddleware'

const AUTH_URL = 'http://localhost:3000/token'

const authDecorator = WrappedComponent => 
  class AuthDecorator extends React.Component {
    state = {
      token: null,
    }

    componentWillMount() {
      const token = this.getTokenFromStorage()
      this.setToken(token)
      this.setupNetwork()
    }

    setToken(token) {
      let newState = { token }
      if (token) {
        newState = { ...jwtDecode(token), ...newState }
        this.saveTokenToStorage(token)
      } else {
        this.clearTokenFromStorage()
      }
      this.setState({ ...newState })
    }

    setupNetwork() {
      Relay.injectNetworkLayer(new RelayNetworkLayer([
        authMiddleware({
          allowEmptyToken: true,
          token: () => this.state.token,
          onTokenInvalid: this.handleTokenInvalid,
        }),
      ], { disableBatchQuery: true }))
    }

    getTokenFromStorage() {
      return localStorage.getItem('token')
    }

    saveTokenToStorage(token) {
      localStorage.setItem('token', token)
    }

    clearTokenFromStorage() {
      localStorage.removeItem('token')
    }

    handleTokenInvalid = () => {
      return new Promise((resolve) => {
        this.setToken(null, () => {
          resolve()
        })
      })
    }

    handleLogin = (data) => {
      return fetchToken(data)
        .then((token) => this.setToken(token))
        .catch((err) => console.error(err))
    }

    handleLogout = () => {
      this.setToken(null)
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
      if (err)
        throw new Error(err.message)
      else
        return token
    })
    .then((token) => token)
}


export default authDecorator
