import React from 'react'

export default function PlayerMenu({children, playerData}) {
  return (
    <div className="playerInfo">
        <header className='playerInfo__header'>
            <h1>{playerData.firstname} {playerData.lastname}</h1>
        </header>
        <div className='playerInfo__body'>
            {children}
        </div>
    </div>
  )
}
