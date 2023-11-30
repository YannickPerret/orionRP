import React from 'react'
import './fuel.css'

export default function Fuel({fuel}) {
  return (
    <div className="progress">
        <div className="progress-bar" role="progressbar" style={{width: fuel + '%'}} aria-valuenow={fuel} aria-valuemin="0" aria-valuemax="100"></div>
    </div>
  )
}
