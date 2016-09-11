import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import { Link } from 'react-router'

const styles = StyleSheet.create({
  container: {
    marginBottom: '2.25em',
  },
})

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
    <article className={css(styles.container)}>
      <header>
        <h2><Link to={`/${id}`}>{headline}</Link></h2>
        <p>by {author.fullName}</p>
      </header>
      <div><p>{summary}</p></div>
      <aside>
        <Timestamp label="Created on " date={createdAt}/>
        <Timestamp label="Updated on " date={updatedAt}/>
        <p>Filed under <span>{topic ? topic : 'n/a'}</span></p>
      </aside>
    </article>
  )
}

function Timestamp ({ label, date }) {
  const timestamp = new Date(date)
  return (
    <p>{label}<time>{timestamp.toDateString()}</time></p>
  )
}

export default PostItem
