import React from 'react'
import Relay from 'react-relay'
import { StyleSheet, css } from 'aphrodite'
import PostItem from './PostItem'
import PostForm from './PostForm'
import RegisterPage from './RegisterPage'
import ScrollBottomNotifier from '../utils/ScrollBottomNotifier'
import { InsertPostMutation } from '../mutations'

class PostIndex extends React.Component {
  static contextTypes = {
    user: React.PropTypes.object,
  }

  state = {
    addingPost: false,
    loading: false,
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

  handleScrollBottom = () => {
    const { relay, viewer } = this.props
    //if (!viewer.posts.pageInfo.hasNextPage) return
    relay.setVariables({
      count: relay.variables.count + 3,
    }, ({ready, done, error, aborted}) => {
      this.setState({
        loading: !ready && !(done || error || aborted)
      })
    })
  }

  render() {
    const { posts } = this.props.viewer

    return (
      <div>
        <h1>Topics</h1>
        {this.context.user.token &&
          <div>
          <button onClick={this.setAddingPost}>
            {this.state.addingPost ? 'Cancel' : 'Add Topic'}
          </button>
          {this.state.addingPost &&
            <PostForm user={this.context.user} onSubmit={this.insertPost}/>
          }
          </div>
        }
        <ScrollBottomNotifier onScrollBottom={this.handleScrollBottom}>
          {posts.edges && posts.edges.map(({ node: post }) =>
            <div key={post.id}>
              <PostItem {...post}/>
            </div>
          )}
        </ScrollBottomNotifier>
      </div>
    )
  }
}

export default Relay.createContainer(PostIndex, {
  initialVariables: {
    count: 3,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        ${InsertPostMutation.getFragment('viewer')}
        posts: postNodes(
          first: $count,
          orderBy: ROW_ID,
        ) {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
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
