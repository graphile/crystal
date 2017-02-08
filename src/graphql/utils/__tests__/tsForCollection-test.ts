import tsForCollection from '../tsForCollection'
import Collection from '../../../interface/collection/Collection'

/* tslint:disable:no-any */
function cast<TType>(input: any): TType {
  return input
}
/* tslint:enable:no-any */

test('no timestamps, no fields', () => {
  expect(tsForCollection(cast<Collection<mixed>>({
    type: {
      fields: {},
    },
  }), undefined)).toBe(undefined)
})

test('empty timestamps should result in undefined timestamps', () => {
  expect(tsForCollection(cast<Collection<mixed>>({
    type: {
      fields: {},
    },
  }), {})).toBe(undefined)
})

test('no fields should result in no timestamps', () => {
  expect(tsForCollection(cast<Collection<mixed>>({
    type: {
      fields: {},
    },
  }), {
    created: 'x',
    modified: 'y',
  })).toBe(undefined)
})

test('created fields should result in created timestamps', () => {
  expect(tsForCollection(cast<Collection<mixed>>({
    type: {
      fields: {
        x: 'a',
      },
    },
  }), {
    created: 'x',
    modified: 'y',
  })).toEqual({
    created: 'x',
  })
})
test('created fields should result in created timestamps', () => {
  expect(tsForCollection(cast<Collection<mixed>>({
    type: {
      fields: {
        y: 'a',
      },
    },
  }), {
    created: 'x',
    modified: 'y',
  })).toEqual({
    modified: 'y',
  })
})
