import React from 'react'
import Relay from 'react-relay'
import { StyleSheet, css } from 'aphrodite'
import PostItem from '../components/PostItem'
import PostForm from '../components/PostForm'
import ScrollBottomNotifier from '../utils/ScrollBottomNotifier'
import { CreatePostMutation } from '../mutations'

class PostIndex extends React.Component {
  state = {
    addingPost: false,
    loading: false,
  }

  insertPost = (data) => {
    this.props.relay.commitUpdate(
      new CreatePostMutation({
        query: this.props.query,
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
    const { relay, query } = this.props
    relay.setVariables({
      count: relay.variables.count + 5,
    }, ({ready, done, error, aborted}) => {
      this.setState({
        loading: !ready && !(done || error || aborted)
      })
    })
  }

  renderPostForm() {
    return (
      <div>
        <button onClick={this.setAddingPost}>
          {this.state.addingPost ? 'Cancel' : 'Add Topic'}
        </button>
        {this.state.addingPost &&
          <PostForm
            currentPerson={this.props.currentPerson}
            onSubmit={this.insertPost}
          />
        }
      </div>
    )
  }

  render() {
    const { posts } = this.props.query

    return (
      <div>
        <h1>Topics</h1>
        {this.props.currentPerson && this.renderPostForm()}
        <ScrollBottomNotifier onScrollBottom={this.handleScrollBottom}>
          {posts.edges.length && posts.edges.map(({ node: post }) =>
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
    count: 5,
  },
  fragments: {
    query: () => Relay.QL`
      fragment on Query {
        posts: allPosts(
          first: $count
          orderBy: CREATED_AT_DESC
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
        ${CreatePostMutation.getFragment('query')}
      }
    `,
  },
})
