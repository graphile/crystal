import React from 'react'
import { Link } from 'react-router'

function Navigation({ currentPerson, logoutPerson }) {
  return (
    <nav>
      <Link to="/">Home</Link>{' '}
      <Link to="/posts">Posts</Link>
      {currentPerson
        ? <button onClick={logoutPerson}>Logout</button>
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
