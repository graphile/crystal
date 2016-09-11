import React from 'react'
import Relay from 'react-relay'
import { Link, withRouter } from 'react-router'
import { UpdatePostMutation, DeletePostMutation } from '../mutations'

class Post extends React.Component {
  static contextTypes = {
    user: React.PropTypes.object,
  }

  handleUpdate(event) {
    this.props.relay.commitUpdate(
      new UpdatePostMutation({
        post: this.props.post,
        newPost: {
          // PostGrahpQL expects the prop names of the new values to be prefixed with `new`
          [`new${capitalizeFirstLetter(event.target.dataset.name)}`]: event.target.innerText,
        },
      })
    )
  }

  handleDelete(event) {
    this.props.router.replace('/')
    this.props.relay.commitUpdate(
      new DeletePostMutation({
        post: this.props.post,
        viewer: this.props.viewer,
      })
    )
  }

  // contenteditable is used here out of simplicity, for the moment
  // react complains; I chose to ignore it
  render() {
    const { authenticated } = this.context.user
    return (
      <div>
        <Link to="/">back to Posts</Link>
        <h1 data-name="headline" contentEditable={authenticated} onBlur={::this.handleUpdate}>{this.props.post.headline}</h1>
        <p data-name="body" contentEditable={authenticated} onBlur={::this.handleUpdate}>{this.props.post.body}</p>
        {authenticated &&
          <button onClick={::this.handleDelete}>Delete Post</button>
        }
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
      }
    `,
  },
})
