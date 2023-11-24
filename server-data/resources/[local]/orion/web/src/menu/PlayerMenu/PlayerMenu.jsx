import React, { useState } from 'react'
import '../../styles/PlayerMenu.css'
import { sendNui } from '../../utils/fetchNui';

export default function PlayerMenu({playerData, onCloseMenu, dispatch}) {

  const [showIdentityCard, setShowIdentityCard] = useState(false);


  const handleCloseMenu = () => {
    onCloseMenu()
  }

  const handleCloseSideMenu = () => {
    dispatch({type:"closeSideMenu"})
    sendNui('closeNUI', null)
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

  const handleGiveMoney = (e) => {
    if (e.type === 'contextmenu') {
      console.log('clic droit1')
      handleCloseSideMenu();
      console.log('clic droit2')
      dispatch({type:"showGiveAmountMenu"})
    }
  }

  const handleSavePosition = () => {
    sendNui('savePosition',null);
    handleCloseMenu();
  }

  return (
        <ul className='playerInfo__list'>
            <li className='playerInfo__list__item' onClick={handleGiveMoney} onContextMenu={handleGiveMoney}>Argent liquide : ${playerData.money}</li>
            <li className='playerInfo__list__item' onClick={handleIdentityCardClick} onContextMenu={handleIdentityCardClick}>Carte identité</li>
            <li className='playerInfo__list__item'>Permis de conduire</li>
            <li className='playerInfo__list__item'>Permis de port d'arme</li>
            <li className='playerInfo__list__item' onClick={handleSavePosition}>Sauvegarder</li>
            <li className='playerInfo__list__item' onClick={handleCloseMenu}>Fermer</li>
        </ul>  
  )
}
