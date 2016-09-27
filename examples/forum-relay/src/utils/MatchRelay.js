import React from 'react'
import Relay from 'react-relay'
import Match from 'react-router/Match'

const MatchRelay = ({
  component:Component,
  queries,
  prepareParams,
  render,
  ...rest
}) => {
  return <Match {...rest} render={(matchProps) => {
    let { pathname, params, location } = matchProps

    // Not sure wether this is actuall ok …
    params = { ...params, ...location.query }

    if (prepareParams)
      params = prepareParams(params)

    const queryConfig = {
      name: pathname,
      params,
      queries,
    }

    const render = ({ props, ...readyState }) => {
      if (props)
        return <Component {...matchProps} {...props} />
      else
        return null
    }

    return (
      <Relay.Renderer
        Container={Component}
        queryConfig={queryConfig}
        environment={Relay.Store}
        render={render}
      />
    )
  }}/>
}

export default MatchRelay
