import memoize from '../memoize'

class Test {
  @memoize
  method <T>({ a }: { a: T }): { a: T } {
    return { a }
  }
}

test('will return the exact same output for the exact same input', () => {
  const input1 = { a: 1 }
  const input2 = { a: 2 }
  const test = new Test()
  const output1 = test.method(input1)
  const output2 = test.method(input2)
  expect(test.method(input1)).toBe(output1)
  expect(test.method(input2)).toBe(output2)
})

test('will return different outputs on different instances', () => {
  const input1 = { a: 1 }
  const input2 = { a: 1 }
  const testA = new Test()
  const testB = new Test()
  const output1A = testA.method(input1)
  const output2A = testA.method(input2)
  const output1B = testB.method(input1)
  const output2B = testB.method(input2)
  expect(output1A).not.toBe(output1B)
  expect(output2A).not.toBe(output2B)
  expect(testA.method(input1)).toBe(output1A)
  expect(testA.method(input2)).toBe(output2A)
  expect(testB.method(input1)).toBe(output1B)
  expect(testB.method(input2)).toBe(output2B)
})
