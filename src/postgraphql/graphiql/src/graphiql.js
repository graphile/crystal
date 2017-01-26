import React from 'react'
import { render } from 'react-dom'
import EnhancedGraphiQL from './components/EnhancedGraphiQL'
import setupEventSource from './setupEventSource'
import './styles/global/index.css'

const renderGraphiQL = () => {
  const { GRAPHIQL_CONFIG } = window

  render(
    <EnhancedGraphiQL
      config={GRAPHIQL_CONFIG}
      setupEventSource={setupEventSource('/_postgraphql/stream')}
    />,
    document.getElementById('root')
  )
}

renderGraphiQL()
