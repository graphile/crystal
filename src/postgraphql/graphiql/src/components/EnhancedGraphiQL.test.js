import React from 'react'
import EnhancedGraphiQL from './EnhancedGraphiQL'
import { shallowToJson } from 'enzyme-to-json'
import { shallow } from 'enzyme'

const config = {
  graphqlPath: '/graphql',
  watchPg: true,
  jwt: true,
}

const setupEventSource = jest.fn()

test('will render component', () => {
  let component = shallow(
    <EnhancedGraphiQL
      config={config}
      setupEventSource={setupEventSource}
    />
  )
  expect(shallowToJson(component)).toMatchSnapshot()
})

test('will render component without TokenSetter', () => {
  let component = shallow(
    <EnhancedGraphiQL
      config={Object.assign({}, config, { jwt: false })}
      setupEventSource={setupEventSource}
    />
  )
  expect(shallowToJson(component)).toMatchSnapshot()
})
