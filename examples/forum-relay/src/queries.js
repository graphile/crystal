import Relay from 'react-relay'

const viewer = () => Relay.QL`query { viewer }`

export const PostIndexQueries = {
  viewer,
}

export const PostQueries = {
  post: () => Relay.QL`query { post(id: $postId) }`,
  viewer,
}

export const RegisterQueries = {
  viewer,
}

export const HomeQueries = {
  viewer,
}
