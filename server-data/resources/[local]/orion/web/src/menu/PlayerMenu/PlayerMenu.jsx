import React, { useState } from 'react'
import { SideMenu } from '../SideMenu'
import '../../styles/PlayerMenu.css'

export default function PlayerMenu({playerData, sendNui}) {

  const [showIdentityCard, setShowIdentityCard] = useState(false);


  const handleCloseMenu = () => {
    sendNui('closeNUI',null);
  }

  const handleIdentityCardClick = (e) => {
    if (e.type === 'click') {
      // Clic gauche
      setShowIdentityCard(true);
      setShowNui(false);
      sendNui('identityCard', {mugshot: playerData.mugshot})
      setTimeout(() => {
        setShowIdentityCard(false);
        sendNui('closeNUI',null);

      }, 15000);
    } else if (e.type === 'contextmenu') {
      // Clic droit
      sendNui('showId', null);
      sendNui('closeNUI',null);
    }
  }

  const handleGiveMoney = () => {
    setShowAmountMenu(true);
  }

  const handleSavePosition = () => {
    sendNui('savePosition',null);
  }
  return (
    <SideMenu handleSideMenuIsOpen={handleCloseMenu}>
        <h1>{playerData.firstname} {playerData.lastname}</h1>
        <ul className='playerInfo__list'>
            <li className='playerInfo__list__item' onClick={handleGiveMoney}>Argent liquide : ${playerData.money}</li>
            <li className='playerInfo__list__item' onClick={handleIdentityCardClick} onContextMenu={handleIdentityCardClick}>Carte identité</li>
            <li className='playerInfo__list__item'>Permis de conduire</li>
            <li className='playerInfo__list__item'>Permis de port d'arme</li>
            <li className='playerInfo__list__item' onClick={handleSavePosition}>Sauvegarder</li>
            <li className='playerInfo__list__item' onClick={handleCloseMenu}>Fermer</li>
        </ul>
          
    
    </SideMenu>
  
  )
}
