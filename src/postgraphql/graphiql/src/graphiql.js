import React from 'react'
import { render } from 'react-dom'
import EnhancedGraphiQL from './components/EnhancedGraphiQL'
import './styles/global/index.css'

function renderGraphiQL() {
  const { GRAPHIQL_CONFIG } = window
  render(
    <EnhancedGraphiQL config={GRAPHIQL_CONFIG}/>,
    document.getElementById('root')
  )
}

renderGraphiQL()
