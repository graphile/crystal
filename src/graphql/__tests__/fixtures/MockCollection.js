import { Collection } from '../../../catalog'

class MockCollection extends Collection {
  constructor () {
    super(...arguments)
    this._keys = new Set()
    this._primaryKey = undefined
    this._paginator = undefined
  }

  addKey (key) {
    if (key.getCollection() !== this)
      throw new Error('Key must reference this collection.')

    this._keys.add(key)

    return this
  }

  getKeys () {
    return Array.from(this._keys)
  }

  setPrimaryKey (key) {
    if (!this._keys.has(key))
      throw new Error('Key must be added first.')

    this._primaryKey = key

    return this
  }

  getPrimaryKey () {
    return this._primaryKey
  }

  setPaginator (paginator) {
    if (this.getType() !== paginator.getType())
      throw new Error('Type types of a collection and its paginator should match.')

    this._paginator = paginator

    return this
  }

  getPaginator () {
    return this._paginator
  }
}

export default MockCollection
