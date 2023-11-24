import React from 'react'

export default function JobMenu({job}) {
  return (
    <div>
      <ul>
        <li>{job.name}</li>
        <li>{job.grade}</li>
        <li>{job.salary}</li>
        <li>{job.service}</li>
      </ul>
    </div>
  )
}
