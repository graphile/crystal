import React from 'react'
import Relay from 'react-relay'
import { Link } from 'react-router'

class PostIndex extends React.Component {
  render() {
    return (
      <div>
        <h1>Posts</h1>
        <ul>
          {this.props.viewer.posts.edges.map(({ node: post }) =>
            <li key={post.id}>
              <PostItem {...post}/>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

function PostItem ({
  id,
  headline,
  topic,
  summary,
  author,
  createdAt
}) {
  return (
    <div>
      <h2><Link to={`posts/${id}`}>{headline}</Link></h2>
      <h3>by {author.fullName}</h3>
      <div><p>{summary}</p></div>
      {topic && <p>Filed under <span>{topic}</span></p>}
      <PostTimestamp date={createdAt}/>
    </div>
  )
}

function PostTimestamp ({ date }) {
  const timestamp = new Date(date)
  return (
    <p>Created on <time>{timestamp.toDateString()}</time></p>
  )
}

export default Relay.createContainer(PostIndex, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        posts: postNodes(first: 10) {
          edges {
            node {
              id
              headline
              topic
              summary
              createdAt
              author: personByAuthorId {
                fullName
              }
            },
          },
        },
      }
    `,
  },
});
