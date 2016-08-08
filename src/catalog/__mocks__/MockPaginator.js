const { Paginator } = require('../')

class MockPaginator extends Paginator {
  constructor () {
    super(...arguments)
    this._orderings = new Set()
    this._defaultOrdering = undefined
  }

  setOrderings (orderings) {
    this._orderings.clear()
    orderings.forEach(ordering => this._orderings.add(ordering))
    return this
  }

  getOrderings () {
    return Array.from(this._orderings)
  }

  setDefaultOrdering (ordering) {
    if (!this._orderings.has(ordering))
      throw new Error('Add the ordering before setting it as a default.')

    this._defaultOrdering = ordering
    return this
  }

  getDefaultOrdering () {
    return this._defaultOrdering
  }
}

module.exports = MockPaginator
