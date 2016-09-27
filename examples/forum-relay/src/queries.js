import Relay from 'react-relay'

const viewer = () => Relay.QL`query { viewer }`

export const postIndexQueries = {
  viewer,
}

export const postQueries = {
  post: () => Relay.QL`query { post(id: $postId) }`,
  viewer,
}

export const registerQueries = {
  viewer,
}

export const homeQueries = {
  viewer,
}
