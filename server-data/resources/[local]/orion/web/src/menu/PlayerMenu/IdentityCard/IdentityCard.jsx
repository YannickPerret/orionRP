import React, { useState } from 'react'
import './identityCard.css'

export default function IdentityCard({player}) {


  return (
    <div className='identityCard'>
        <div className='identityCard__container'>
            <div className='identityCard__left'>
                <img src={`nui://${player.mugshot}`} alt='Mugshot' />
            </div>

            <div className='identityCard__right'>
                <ul>
                    <li>Nom : {player.lastname}</li>
                    <li>Prénom : {player.firstname}</li>
                    <li>phone : {player.phone}</li>
                </ul>
            </div>
        </div>
    </div>
  )
}
