import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router'

class Post extends React.Component {
  render() {
    const {post} = this.props
    return (
      <div>
        <h1>{post.headline}</h1>
        <p>{post.body}</p>
        <Link to="/posts">back to Posts</Link>
      </div>
    )
  }
}

export default Relay.createContainer(Post, {
  fragments: {
    post: () => Relay.QL`
      fragment on Post {
        id
        headline
        body
        createdAt
        updatedAt
        topic
        author: personByAuthorId {
          fullName
        }
      }
    `,
  },
})
