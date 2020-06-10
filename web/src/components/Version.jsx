import React from 'react'
import config from 'config'

import './Version.css';

const Version = () => (
  <div className="Version">
    <span>{config.VERSION.slice(0, 7)}</span>
  </div>
)

export default Version;
