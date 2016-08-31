import test from 'ava'
import memoize from '../memoize'

class Test {
  method ({ a }) {
    return { a }
  }
}

const descriptor = Object.getOwnPropertyDescriptor(Test.prototype, 'method')

memoize(Test.prototype, 'method', descriptor)

Object.defineProperty(Test.prototype, 'method', descriptor)

test('will return the exact same output for the exact same input', t => {
  const input1 = { a: 1 }
  const input2 = { a: 2 }
  const test = new Test()
  const output1 = test.method(input1)
  const output2 = test.method(input2)
  t.is(test.method(input1), output1)
  t.is(test.method(input2), output2)
})

test('will return different outputs on different instances', t => {
  const input1 = { a: 1 }
  const input2 = { a: 1 }
  const testA = new Test()
  const testB = new Test()
  const output1A = testA.method(input1)
  const output2A = testA.method(input2)
  const output1B = testB.method(input1)
  const output2B = testB.method(input2)
  t.not(output1A, output1B)
  t.not(output2A, output2B)
  t.is(testA.method(input1), output1A)
  t.is(testA.method(input2), output2A)
  t.is(testB.method(input1), output1B)
  t.is(testB.method(input2), output2B)
})
