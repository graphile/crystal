export const ViewerQueries = {
  viewer: () => Relay.QL`query { viewer }`
}

export const PostQueries = {
  post: () => Relay.QL`query { post(id: $postId) }`
}
