import React from 'react'
import Relay from 'react-relay'
import { render } from 'react-dom'
import Router from 'react-router/BrowserRouter'
import App from './components/App'
import './styles.css' // global css

const mountNode = document.getElementById('root')

render(
  <Router>
    <App />
  </Router>,
  mountNode
)
