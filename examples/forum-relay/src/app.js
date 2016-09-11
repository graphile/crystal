import React from 'react'
import Relay from 'react-relay'
import { render } from 'react-dom'
import { Router, Route, Redirect, IndexRoute, browserHistory, applyRouterMiddleware } from 'react-router'
import useRelay from 'react-router-relay'
import App from './components/App'
import PostIndex from './components/PostIndex'
import Post from './components/Post'
import { ViewerQueries, PostQueries } from './queries'

const routes = (
  <Route path="/" component={App}>
    <IndexRoute
      component={PostIndex}
      queries={ViewerQueries}
    />
    <Route
      path=":postId"
      component={Post}
      queries={PostQueries}
    />
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
