import React from 'react'
import { Link } from 'react-router'

function Navigation({ auth, user }) {
  return (
    <nav>
      <Link to="/">Home</Link>{' '}
      <Link to="/posts">Posts</Link>
      {user.token
        ? <button onClick={auth.handleLogout}>Logout</button>
        : (
          <div>
            <Link to="/login">Login</Link>{' '}
            <Link to="/register">Register</Link>
          </div>
        )
      }
    </nav>
  )
}

export default Navigation
