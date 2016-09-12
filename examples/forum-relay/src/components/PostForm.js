import React from 'react'
import { StyleSheet, css } from 'aphrodite'

class PostForm extends React.Component {
  fields = {}

  handleSubmit = (event) => {
    event.preventDefault()
    const data = {
      authorId: this.props.user.personId,
      headline: this.fields.headline.value,
      body: this.fields.body.value,
    }
    this.props.onSubmit(data)
  }

  render() {
    const { onSubmit, post } = this.props
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label htmlFor="headline">Headline</label>
          <input ref={(ref) => this.fields.headline = ref} id="headline" type="text" defaultValue={post && post.headline}/>
        </div>
        <div>
          <label htmlFor="body">Body</label>
          <input ref={(ref) => this.fields.body = ref} id="body" type="text" defaultValue={post && post.body}/>
        </div>
        <input type="submit" value="Submit Post"/>
      </form>
    )
  }
}

export default PostForm
