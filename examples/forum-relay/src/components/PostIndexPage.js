import React from 'react'
import Relay from 'react-relay'
import { StyleSheet, css } from 'aphrodite'
import PostItem from './PostItem'
import PostForm from './PostForm'
import { InsertPostMutation } from '../mutations'

class PostIndex extends React.Component {
  state = {
    addingPost: false,
  }

  static contextTypes = {
    user: React.PropTypes.object,
  }

  insertPost = (data) => {
    this.props.relay.commitUpdate(
      new InsertPostMutation({
        viewer: this.props.viewer,
        post: data,
      }), {
      onSuccess: () => this.setAddingPost(false),
    })
  }

  setAddingPost = (event, value) => {
    const { addingPost } = this.state
    this.setState({ addingPost: value || !addingPost })
  }

  render() {
    return (
      <div>
        <h1>Posts</h1>
        <div>
          {this.context.user.authenticated &&
            <button onClick={this.setAddingPost}>
              {this.state.addingPost ? 'Cancel' : 'Write Post'}
            </button>
          }
          {this.state.addingPost &&
            <PostForm onSubmit={this.insertPost}/>
          }
        </div>
        <ul>
          {this.props.viewer.posts.edges.map(({ node: post }) =>
            <li key={post.id}>
              <PostItem {...post}/>
            </li>
          )}
        </ul>
      </div>
    )
  }
}

export default Relay.createContainer(PostIndex, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        ${InsertPostMutation.getFragment('viewer')},
        posts: postNodes(first: 20, orderBy: CREATED_AT, descending: true) {
          edges {
            node {
              id,
              headline,
              topic,
              summary,
              createdAt,
              updatedAt,
              author: personByAuthorId {
                fullName,
              },
            },
          },
        },
      }
    `,
  },
})
