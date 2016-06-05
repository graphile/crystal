import React from 'react';
import Relay from 'react-relay';

class App extends React.Component {
  render() {
    return (
      <main>
        <h1>Posts</h1>
        <ul>
          {this.props.viewer.posts.edges.map(({ node: post }) =>
            <li key={post.id}>
              <h2><a href={`#posts/${post.id}`}>{post.headline}</a></h2>
              <p>by {post.author.fullName}</p>
              <div><p>{post.summary}</p></div>
              {post.topic && <p>Filed under <span>{post.topic}</span></p>}
              <PostTimestamp date={post.createdAt}/>
            </li>
          )}
        </ul>
      </main>
    );
  }
}

function PostTimestamp({ date }) {
  const timestamp = new Date(date)
  return (
    <p>Created on <time>{timestamp.toDateString()}</time></p>
  )
}

export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        posts: postNodes(first: 10) {
          edges {
            node {
              id
              headline
              createdAt
              topic
              summary
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
