export const ViewerQueries = {
  viewer: () => Relay.QL`query { viewer }`,
}

export const PostQueries = {
  viewer: () => Relay.QL`query { viewer }`,
  post: () => Relay.QL`query { post(id: $postId) }`,
}
