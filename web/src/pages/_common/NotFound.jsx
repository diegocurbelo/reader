import React from 'react'

const NotFound = ({ location }) => (
  <div>
    <h1>404 - <code>{location.pathname}</code></h1>
  </div>
)

export default NotFound;