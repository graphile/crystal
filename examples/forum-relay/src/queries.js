import Relay from 'react-relay'

export const homeQueries = {
  query: () => Relay.QL`query { query }`,
}

export const postIndexQueries = {
  query: () => Relay.QL`query { query }`,
}

export const postQueries = {
  query: () => Relay.QL`query { query }`,
  post: () => Relay.QL`query { post(id: $postId) }`,
}
