import React from 'react'
import Relay from 'react-relay'
import { Link } from 'react-router'
import { UpdatePostMutation } from '../mutations'

class Post extends React.Component {
  handleEdit(event) {
    this.props.relay.commitUpdate(
      new UpdatePostMutation({post: {
        id: this.props.post.id,
        rowId: this.props.post.rowId,
        // PostGrahpQL expects the prop names of the new values
        // to be prefixed with `new`
        [`new${capitalizeFirstLetter(event.target.dataset.name)}`]: event.target.innerText
      }})
    )
  }

  // contenteditable is used here out of simplicity, for the moment
  render() {
    return (
      <div>
        <h1 data-name="headline" contentEditable={true} onBlur={::this.handleEdit}>{this.props.post.headline}</h1>
        <p data-name="body" contentEditable={true} onBlur={::this.handleEdit}>{this.props.post.body}</p>
        <Link to="/posts">back to Posts</Link>
      </div>
    )
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// for some reason I do not understand the `UpdatePostMutation.getFragment('post')`
// returns a `_fragment` of undefined. Hence I am including id and rowId in fragment
// of the container.
export default Relay.createContainer(Post, {
  fragments: {
    post: () => Relay.QL`
      fragment on Post {
        id,
        rowId,
        headline,
        body,
        ${UpdatePostMutation.getFragment('post')},
      }
    `,
  },
})
