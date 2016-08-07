import React from 'react'
import Relay from 'react-relay'
import { Link } from 'react-router'
import { UpdatePostMutation, DeletePostMutation } from '../mutations'

class Post extends React.Component {
  handleEdit(event) {
    this.props.relay.commitUpdate(
      new UpdatePostMutation({
        post: {
          id: this.props.post.id,
          rowId: this.props.post.rowId,
          // PostGrahpQL expects the prop names of the new values
          // to be prefixed with `new`
          [`new${capitalizeFirstLetter(event.target.dataset.name)}`]:
            event.target.innerText
        }
      })
    )
  }

  handleDelete(event) {
    this.props.relay.commitUpdate(
      new DeletePostMutation({
        post: { rowId: this.props.post.rowId },
        viewer: { id: this.props.viewer.id },
      })
    )
  }

  // contenteditable is used here out of simplicity, for the moment
  render() {
    return (
      <div>
        <h1 data-name="headline" contentEditable={true} onBlur={::this.handleEdit}>{this.props.post.headline}</h1>
        <p data-name="body" contentEditable={true} onBlur={::this.handleEdit}>{this.props.post.body}</p>
        <Link to="/posts">back to Posts</Link>
        <button onClick={::this.handleDelete}>Delete Post</button>
      </div>
    )
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export default Relay.createContainer(Post, {
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
