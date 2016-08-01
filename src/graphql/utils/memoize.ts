import memoize from '../../postgres/utils/memoize'

// We also need a memoization implementation for the `postgres` module. In the
// future when the `graphql` and `postgres` modules are seperated we’ll copy
// the memoization function over, but for now we can just re-export it.
//
// The utility just happened to be written in the `postgres` module first 😊
export default memoize
