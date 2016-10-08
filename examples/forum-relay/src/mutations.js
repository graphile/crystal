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
    return Relay.QL`mutation { updatePost }`
  }

  // This method is used to prepare the variables that will be used as
  // input to the mutation.
  getVariables() {
    return {
      rowId: this.props.post.rowId,
      ...this.props.newPost,
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
    viewer: () => Relay.QL`fragment on Viewer { id }`,
  }

  getMutation() {
    return Relay.QL`mutation { deletePost }`
  }

  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'postNodes',
      deletedIDFieldName: 'deletedPostId',
    }]
  }

  getVariables() {
    return { rowId: this.props.post.rowId }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on DeletePostPayload {
        deletedPostId,
        viewer { postNodes },
      }
    `
  }
}

export class InsertPostMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`fragment on Viewer { id }`,
  }

  getMutation() {
    return Relay.QL`mutation { insertPost }`
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'postNodes',
      edgeName: 'postEdge',
      rangeBehaviors: {
        '': 'append',
        'descending(true).orderBy(CREATED_AT)': 'prepend',
      },
    }]
  }

  getVariables() {
    return this.props.post
  }

  getFatQuery() {
    return Relay.QL`
      fragment on InsertPostPayload {
        postEdge
        viewer {
          postNodes
        }
      }
    `
  }
}

export class RegisterPersonMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`fragment on Viewer { id }`,
  }

  getMutation() {
    return Relay.QL`mutation { registerPerson }`
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'personNodes',
      edgeName: 'personEdge',
      rangeBehaviors: {
        '': 'append',
        'descending(true).orderBy(CREATED_AT)': 'prepend',
      },
    }]
  }

  getVariables() {
    return this.props.person
  }

  getFatQuery() {
    return Relay.QL`
      fragment on RegisterPersonPayload {
        viewer {
          personNodes
        }
      }
    `
  }
}
