import React from 'react'
import Relay from 'react-relay'
import jwtDecode from 'jwt-decode'
import { RelayNetworkLayer } from 'react-relay-network-layer'
import authMiddleware from './authMiddleware'
import { RegisterPersonMutation, AuthenticatePersonMutation } from '../mutations'

const TOKEN_KEY = 'token'
const { commitUpdate } = Relay.Store

const authDecorator = WrappedComponent => (
  class AuthDecorator extends React.Component {
    state = {
      token: null,
      currentPerson: null,
    }

    componentWillMount() {
      const token = localStorage.getItem(TOKEN_KEY)
      this.setToken(token)
      this.setupNetwork()
    }

    setToken(token) {
      const newState = { token }
      if (token) {
        localStorage.setItem(TOKEN_KEY, token)
        newState.currentPerson = jwtDecode(token)
      } else {
        localStorage.removeItem(TOKEN_KEY)
        newState.currentPerson = null
      }
      this.setState(newState)
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

    handleTokenInvalid = () => {
      this.setToken(null)
      return Promise.resolve()
    }

    loginPerson = (login) => {
      return new Promise((resolve, reject) => {
        commitUpdate(new AuthenticatePersonMutation({ login }), {
          onFailure: transaction => reject(transaction),
          onSuccess: response => {
            const { jwtToken } = response.authenticate
            this.setToken(jwtToken)
            resolve(response)
          }
        })
      })
    }

    registerPerson = (person) => {
      return new Promise((resolve, reject) => {
        commitUpdate(new RegisterPersonMutation({ person }), {
          onFailure: transaction => reject(transaction),
          onSuccess: response => {
            const { jwtToken } = response.authenticate
            this.setToken(jwtToken)
            resolve(response)
          }
        })
      })
    }

    logoutPerson = () => {
      this.setToken(null)
      return Promise.resolve()
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          auth={{
            loginPerson: this.loginPerson,
            logoutPerson: this.logoutPerson,
            registerPerson: this.registerPerson,
            currentPerson: this.state.currentPerson,
          }}
        />
      )
    }
  }
)

export default authDecorator
