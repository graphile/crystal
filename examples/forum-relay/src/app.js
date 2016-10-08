import './styles.css' // global css
import React from 'react'
import Relay from 'react-relay'
import { render } from 'react-dom'
import { Router, Route, Redirect, IndexRoute, browserHistory, applyRouterMiddleware } from 'react-router'
import useRelay from 'react-router-relay'
import App from './components/App'
import HomePage from './containers/HomePage'
import PostIndexPage from './containers/PostIndexPage'
import PostPage from './containers/PostPage'
import RegisterPage from './containers/RegisterPage'
import LoginPage from './containers/LoginPage'

import {
  homeQueries,
  postIndexQueries,
  postQueries,
  registerQueries
} from './queries'

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} queries={homeQueries} />
    <Route path="posts">
      <IndexRoute component={PostIndexPage} queries={postIndexQueries} />
      <Route path=":postId" component={PostPage} queries={postQueries} />
    </Route>
    <Route path="login" component={LoginPage} />
    <Route path="register" component={RegisterPage} queries={registerQueries} />
  </Route>
)

const mountNode = document.getElementById('root')

render(
  <Router
    history={browserHistory}
    routes={routes}
    render={applyRouterMiddleware(useRelay)}
    environment={Relay.Store}
  />,
  mountNode
)
