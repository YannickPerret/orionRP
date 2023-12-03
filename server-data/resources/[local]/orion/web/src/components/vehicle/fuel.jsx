import React from 'react'
import './fuel.css'

export default function Fuel({fuel}) {
  return (
    <div className="fuel-bar-container">
    <div className="fuel-bar" style={{ width: `${fuel}%` }}></div>
  </div>
  )
}
