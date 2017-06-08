import React from 'react';
import { Link } from 'react-router'

export default class App extends React.Component {
  render() {
    return (
      <div>
        <header>
          <h1>Forum Example</h1>
          <Link to="/">Home</Link>
          <Link to="posts">Posts</Link>
        </header>
        <main>
          {this.props.children}
        </main>
        <footer>
          An example application for PostGraphQL and Relay
        </footer>
      </div>
    );
  }
}
