import React from 'react'
import Relay from 'react-relay'
import { Link, withRouter } from 'react-router'
import { StyleSheet, css } from 'aphrodite'
import ContentEditable from '../components/ContentEditable'
import { UpdatePostMutation, DeletePostMutation } from '../mutations'

class PostPage extends React.Component {
  render() {
    const { currentPerson, post } = this.props
    const authAndOwn = currentPerson && currentPerson.person_id === post.authorId

    return (
      <article>
        <Link to="/posts">back to Posts</Link>
        <header>
          <ContentEditable
            editable={authAndOwn}
            onChange={this.handleChange} 
            tagName="h1"
            text={post.headline}
            data-prop="headline"
          />
          <p>by {post.author.fullName}</p>
        </header>
        <ContentEditable
          editable={authAndOwn}
          onChange={this.handleChange} 
          tagName="div"
          text={post.body}
          data-prop="body"
        />
        <footer>
          {authAndOwn &&
            <button onClick={this.handleDelete}>Delete Post</button>
          }
        </footer>
      </article>
    )
  }

  handleChange = event => {
    const propName = event.target.dataset.prop
    const newValue = event.target.innerText
    const oldValue = this.props.post[propName]

    if (newValue === oldValue) return

    this.props.relay.commitUpdate(
      new UpdatePostMutation({
        post: this.props.post,
        postPatch: { [propName]: newValue },
      })
    )
  }

  handleDelete = event => {
    this.props.router.push('/posts')
    this.props.relay.commitUpdate(
      new DeletePostMutation({
        query: this.props.query,
        post: this.props.post,
      })
    )
  }

}

export default Relay.createContainer(withRouter(PostPage), {
  fragments: {
    query: () => Relay.QL`
      fragment on Query {
        ${DeletePostMutation.getFragment('query')}
      }
    `,
    post: () => Relay.QL`
      fragment on Post {
        headline
        body
        authorId
        author: personByAuthorId {
          fullName
        }
        ${UpdatePostMutation.getFragment('post')}
        ${DeletePostMutation.getFragment('post')}
      }
    `,
  },
})
