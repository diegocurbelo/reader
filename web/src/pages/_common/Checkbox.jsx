import React from 'react'
import './Checkbox.css'

const Checkbox = ({ name, title, checked, onChange }) => (
  <div>
    <input className="Checkbox" id={name} name={name} type="checkbox" defaultChecked={checked} onChange={onChange} />
    <label htmlFor={name}>{title}</label>
  </div>
)

export default Checkbox;