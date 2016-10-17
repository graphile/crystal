import Relay from 'react-relay'

export class UpdatePostMutation extends Relay.Mutation {
  // The update mutation depends on the Post `id` and `rowId` so we declare it here.
  static fragments = {
    post: () => Relay.QL`
      fragment on Post {
        id,
        rowId,
      }
    `,
  }

  // This method should return a GraphQL operation that represents
  // the mutation to be performed.
  getMutation() {
    return Relay.QL`mutation { updatePostByRowId }`
  }

  // This method is used to prepare the variables that will be used as
  // input to the mutation.
  getVariables() {
    const { post, postPatch } = this.props
    return {
      rowId: post.rowId,
      postPatch,
    }
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
}

export class DeletePostMutation extends Relay.Mutation {
  static fragments = {
    post: () => Relay.QL`fragment on Post { rowId }`,
    query: () => Relay.QL`fragment on Query { id }`,
  }

  getMutation() {
    return Relay.QL`mutation { deletePostByRowId }`
  }

  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'query',
      parentID: this.props.query.id,
      connectionName: 'allPosts',
      deletedIDFieldName: 'deletedPostId',
    }]
  }

  getVariables() {
    return {
      rowId: this.props.post.rowId
    }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on DeletePostPayload {
        deletedPostId,
        query { allPosts },
      }
    `
  }
}

export class CreatePostMutation extends Relay.Mutation {
  static fragments = {
    query: () => Relay.QL`fragment on Query { id }`,
  }

  getMutation() {
    return Relay.QL`mutation { createPost }`
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'query',
      parentID: this.props.query.id,
      connectionName: 'allPosts',
      edgeName: 'postEdge',
      rangeBehaviors: {
        '': 'append',
        'orderBy(CREATED_AT_DESC)': 'prepend',
      },
    }]
  }

  getVariables() {
    return {
      post: this.props.post
    }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CreatePostPayload {
        postEdge
        query {
          allPosts
        }
      }
    `
  }
}

export class RegisterPersonMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation { registerPerson }`
  }

  getConfigs() {
    return [{
      type: 'REQUIRED_CHILDREN',
      children: [
        Relay.QL`
          fragment on RegisterPersonPayload {
            person {
              firstName
              lastName
            }
          } 
        ` 
      ],
    }]
  }

  getVariables() {
    return { ...this.props.person }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on RegisterPersonPayload {
        person
      }
    `
  }
}

export class AuthenticatePersonMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation { authenticate }`
  }

  getConfigs() {
    return [{
      type: 'REQUIRED_CHILDREN',
      children: [
        Relay.QL`
          fragment on AuthenticatePayload {
            jwtToken
          } 
        ` 
      ],
    }]
  }

  getVariables() {
    return { ...this.props.login }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AuthenticatePayload {
        jwtToken
      }
    `
  }
}
