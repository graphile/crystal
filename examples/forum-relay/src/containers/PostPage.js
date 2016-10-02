import React from 'react'
import Relay from 'react-relay'
import { Link, withRouter } from 'react-router'
import { StyleSheet, css } from 'aphrodite'
import ContentEditable from '../components/ContentEditable'
import { UpdatePostMutation, DeletePostMutation } from '../mutations'

class PostPage extends React.Component {
  static contextTypes = {
    user: React.PropTypes.object,
  }

  render() {
    const { post } = this.props
    const { token, personId } = this.context.user
    const authAndOwn = personId === post.authorId && !!token

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

  handleChange = (event) => {
    const propName = event.target.dataset.prop
    const newValue = event.target.innerText
    const oldValue = this.props.post[propName]

    if (newValue === oldValue) return

    // PostGrahpQL expects the prop names of the
    // new values to be prefixed with `new`
    this.props.relay.commitUpdate(
      new UpdatePostMutation({
        post: this.props.post,
        newPost: {
          [`new${capitalizeFirstLetter(propName)}`]: newValue,
        },
      })
    )
  }

  handleDelete = (event) => {
    this.props.router.push('/posts')
    this.props.relay.commitUpdate(
      new DeletePostMutation({
        post: this.props.post,
        viewer: this.props.viewer,
      })
    )
  }

}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export default Relay.createContainer(withRouter(PostPage), {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        ${DeletePostMutation.getFragment('viewer')}
      }
    `,
    post: () => Relay.QL`
      fragment on Post {
        ${UpdatePostMutation.getFragment('post')}
        ${DeletePostMutation.getFragment('post')}
        headline
        body
        authorId
        author: personByAuthorId {
          fullName
        }
      }
    `,
  },
})
