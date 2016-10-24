import React from 'react'
import TokenSetter from './TokenSetter'
import { mountToJson } from 'enzyme-to-json'
import { mount } from 'enzyme'

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJwb3N0Z3JhcGhxbCIsInJvbGUiOiJ0ZXN0X2p3dF9yb2xlIn0.26olvkrTeBD4UXTsKf15501wexCr47nx9AWgHIgi8a4'
const setToken = jest.fn()

test('will render component', () => {
  let component = mount(
    <TokenSetter token={TOKEN} setToken={setToken}/>
  )
  expect(mountToJson(component)).toMatchSnapshot()

  component.find('Token').find('span').simulate('click')
  expect(mountToJson(component)).toMatchSnapshot()
})
