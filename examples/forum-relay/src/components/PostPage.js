import React from 'react'
import Relay from 'react-relay'
import { Link, withRouter } from 'react-router'
import { StyleSheet, css } from 'aphrodite'
import { UpdatePostMutation, DeletePostMutation } from '../mutations'

class Post extends React.Component {
  static contextTypes = {
    user: React.PropTypes.object,
  }

  handleUpdate = (event) => {
    const propName = event.target.dataset.prop
    const newValue = event.target.innerText
    const oldValue = this.props.post[propName]
    if (newValue === oldValue) return
    this.props.relay.commitUpdate(
      new UpdatePostMutation({
        post: this.props.post,
        newPost: {
          // PostGrahpQL expects the prop names of the new values to be prefixed with `new`
          [`new${capitalizeFirstLetter(propName)}`]: newValue,
        },
      })
    )
  }

  handleDelete = (event) => {
    this.props.router.replace('/posts')
    // TODO: Use applyUpdate and commit once navigated?
    this.props.relay.commitUpdate(
      new DeletePostMutation({
        post: this.props.post,
        viewer: this.props.viewer,
      })
    )
  }

  // TODO: get rid of warnings
  // contenteditable is used here out of simplicity, for the moment
  // react complains; I chose to ignore it
  render() {
    const { authenticated } = this.context.user
    const { post } = this.props
    return (
      <div>
        <Link to="/posts">back to Posts</Link>
        <header>
          <h1 data-prop="headline" contentEditable={authenticated} onBlur={this.handleUpdate}>{post.headline}</h1>
          <p>by {post.author.fullName}</p>
        </header>
        <p data-prop="body" contentEditable={authenticated} onBlur={this.handleUpdate}>{post.body}</p>
        <aside>
          {authenticated &&
            <button onClick={this.handleDelete}>Delete Post</button>
          }
        </aside>
      </div>
    )
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export default Relay.createContainer(withRouter(Post), {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        ${DeletePostMutation.getFragment('viewer')},
      }
    `,
    post: () => Relay.QL`
      fragment on Post {
        ${UpdatePostMutation.getFragment('post')},
        ${DeletePostMutation.getFragment('post')},
        headline,
        body,
        author: personByAuthorId {
          fullName,
        },
      }
    `,
  },
})
