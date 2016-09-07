import React from 'react'
import Relay from 'react-relay'
import { Link } from 'react-router'
import { InsertPostMutation } from '../mutations'

class PostIndex extends React.Component {
  state = {
    addingPost: false,
  }

  insertPost(data) {
    this.props.relay.commitUpdate(
      new InsertPostMutation({
        viewer: this.props.viewer,
        post: data,
      }), {
      onSuccess: () => this.setAddingPost(false),
    })
  }

  setAddingPost(value) {
    this.setState({ addingPost: value })
  }

  render() {
    return (
      <div>
        <header>
          <h1>Posts</h1>
          <button onClick={this.setAddingPost.bind(this, !this.state.addingPost)}>
            {!this.state.addingPost ? 'Write Post' : 'Cancel'}
          </button>
        </header>

        {this.state.addingPost && <PostForm onSubmit={::this.insertPost}/>}

        <ul>
          {this.props.viewer.posts.edges.map(({ node: post }) =>
            <li key={post.id}>
              <PostItem {...post}/>
            </li>
          )}
        </ul>
      </div>
    )
  }
}

class PostForm extends React.Component {
  static defaultProps = { post: {} }

  fields = {}

  handleSubmit(event) {
    event.preventDefault()
    const userId = localStorage.getItem('userId')
    const data = {
      authorId: userId,
      headline: this.fields.headline.value,
      body: this.fields.body.value,
    }
    this.props.onSubmit(data)
  }

  render() {
    const { onSubmit, post } = this.props
    return (
      <form onSubmit={::this.handleSubmit}>
        <div>
          <label htmlFor="headline">Headline</label>
          <input ref={(ref) => this.fields.headline = ref} id="headline" type="text" defaultValue={post.headline}/>
        </div>
        <div>
          <label htmlFor="body">Body</label>
          <input ref={(ref) => this.fields.body = ref} id="body" type="text" defaultValue={post.body}/>
        </div>
        <input type="submit" value="Submit Post"/>
      </form>
    )
  }
}

function PostItem ({
  id,
  headline,
  topic,
  summary,
  author,
  createdAt,
  updatedAt,
}) {
  return (
    <div>
      <header>
        <h2><Link to={`posts/${id}`}>{headline}</Link></h2>
        <h3>by {author.fullName}</h3>
      </header>
      <div><p>{summary}</p></div>
      <aside>
        <Timestamp label="Created on " date={createdAt}/>
        <Timestamp label="Updated on " date={updatedAt}/>
        <p>Filed under <span>{topic ? topic : 'n/a'}</span></p>
      </aside>
    </div>
  )
}

function Timestamp ({ label, date }) {
  const timestamp = new Date(date)
  return (
    <p>{label}<time>{timestamp.toDateString()}</time></p>
  )
}

export default Relay.createContainer(PostIndex, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        ${InsertPostMutation.getFragment('viewer')},
        posts: postNodes(first: 20, orderBy: CREATED_AT, descending: true) {
          edges {
            node {
              id,
              headline,
              topic,
              summary,
              createdAt,
              updatedAt,
              author: personByAuthorId {
                fullName,
              },
            },
          },
        },
      }
    `,
  },
})
