import Relay from 'react-relay'
  
export class UpdatePostMutation extends Relay.Mutation {
  // This method should return a GraphQL operation that represents
  // the mutation to be performed.
  getMutation() {
    return Relay.QL`mutation {updatePost}`
  }

  // This method is used to prepare the variables that will be used as
  // input to the mutation.
  getVariables() {
    // We are omitting the relay id otherwise the server will complain
    // about an unknown field
    delete this.props.post.id
    return this.props.post
  }

  // Represents every field in your data model that could change
  // as a result of this mutation.
  getFatQuery() {
    return Relay.QL`
      fragment on UpdatePostPayload {
        post {
          headline,
          body,
          updatedAt,
        },
      }
    `
  }

  // This tells relay how to handle the payload of the update mutation.
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        post: this.props.post.id,
      },
    }]
  }

  // The update mutation depends on the Post `id` and `rowId` so we declare it here.
  static fragments = {
    post: () => Relay.QL`
      fragment on Post {
        id,
        rowId,
      }
    `,
  }
}
