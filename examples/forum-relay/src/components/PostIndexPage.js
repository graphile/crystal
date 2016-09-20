import React from 'react'
import Relay from 'react-relay'
import { StyleSheet, css } from 'aphrodite'
import PostItem from './PostItem'
import PostForm from './PostForm'
import { InsertPostMutation } from '../mutations'

// TODO:
// # Pagination
//   * Scrolling
//   * how does it handle mutations?
//   * Update url
//   * hide buttons if no prev/next page
//   * Button Component

class PostIndex extends React.Component {
  static contextTypes = {
    user: React.PropTypes.object,
  }

  state = {
    addingPost: false,
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

  handleNextPage = () => {
    const { totalCount } = this.props.viewer.posts
    const { offset, first } = this.props.relay.variables
    if (totalCount > offset + first) {
      this.props.relay.setVariables({
        offset: offset + first,
      })
    }
  }

  handlePrevPage = () => {
    const { offset, first } = this.props.relay.variables
    if (offset >= first) {
      this.props.relay.setVariables({
        offset: offset - first,
      })
    }
  }

  render() {
    return (
      <div>
        <h1>Posts</h1>
        <div>
          {this.context.user.token &&
            <button onClick={this.setAddingPost}>
              {this.state.addingPost ? 'Cancel' : 'Write Post'}
            </button>
          }
          {this.state.addingPost &&
            <PostForm user={this.context.user} onSubmit={this.insertPost}/>
          }
        </div>
        <div>
          <button onClick={this.handlePrevPage}>Previous Page</button>
          <button onClick={this.handleNextPage}>Next Page</button>
        </div>
        <ul>
          {this.props.viewer.posts.edges.map(({ node: post }) =>
            <li key={post.id}>
              <PostItem {...post}/>
            </li>
          )}
        </ul>
        <div>
          <button onClick={this.handlePrevPage}>Previous Page</button>
          <button onClick={this.handleNextPage}>Next Page</button>
        </div>
      </div>
    )
  }
}

export default Relay.createContainer(PostIndex, {
  initialVariables: {
    offset: 0,
    first: 5,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        ${InsertPostMutation.getFragment('viewer')}
        posts: postNodes(
          descending: true
          first: $first,
          offset: $offset,
          orderBy: CREATED_AT,
        ) {
          totalCount
          edges {
            node {
              id
              headline
              topic
              summary
              createdAt
              updatedAt
              author: personByAuthorId {
                fullName
              }
            }
          }
        }
      }
    `,
  },
})
