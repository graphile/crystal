import React from 'react'
import Relay from 'react-relay'
import Match from 'react-router/Match'

const MatchRelay = ({ component, queries, ...rest }) => {
  return <Match {...rest} render={(props) => {
    const queryConfig = {
      name: props.pathname,
      params: props.params,
      queries,
    }
    return (
      <Relay.Renderer
        {...props}
        Container={component}
        queryConfig={queryConfig}
        environment={Relay.Store}
      />
    )
  }}/>
}

export default MatchRelay
