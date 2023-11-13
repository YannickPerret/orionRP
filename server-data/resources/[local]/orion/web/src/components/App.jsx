import React, {useState, useEffect} from 'react';
import './App.css'
import {sendNui} from '../utils/fetchNui'
import Amount from './amount';
import IdentityCard from './identityCard';

const player = {
  firstname: 'John',
  lastname: 'Doe',
  money: 100,
  phone: '06 06 06 06 06'
}

const App = () => {
  const [playerData, setPlayerData] = useState({ firstname: 'John', lastname: 'Doe', money: 100 });
  const [showNui, setShowNui] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [showAmountMenu, setShowAmountMenu] = useState(false);
  const [showTextMenu, setShowTextMenu] = useState(false);
  const [showIdentityCard, setShowIdentityCard] = useState(false);

  useEffect(() => {
    const handleMessage = (event) => {
      const { action, data } = event.data;
      if (action === "setPlayerData") {
        setPlayerData(data);
        setShowNui(true);
      } else if (action === "closeNUI") {
        console.log("closeNUI");
        setShowNui(false);
      }
    }

    window.addEventListener("keydown", (e) => {
      if (e.key === "F2") {
        handleCloseMenu();
      }
    });

    const handleBackspace = (e) => {
      if (e.key === "Backspace") {
        // Ici, vous pouvez ajouter la logique pour revenir au menu principal
        if (showSubMenu || showAmountMenu || showTextMenu || showIdentityCard) {
          setShowSubMenu(false);
          setShowAmountMenu(false);
          setShowTextMenu(false);
          setShowIdentityCard(false);
        }
      }
    };

    window.addEventListener("keydown", handleBackspace);
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
      window.removeEventListener("keydown", handleBackspace);
    }
    
  }, [showSubMenu, showAmountMenu, showTextMenu, showIdentityCard]);

  

  const handleCloseMenu = () => {
    setShowNui(false);
    sendNui('closeNUI',null);
  }
  const handleSavePosition = () => {
    sendNui('savePosition',null);
  }
  const handleGiveMoney = (amount) => {
    sendNui('giveMoney', amount);
    setShowAmountMenu(false);
    setShowNui(false);
  }
  const handleCancelAmount = () => {
    setShowAmountMenu(false);
    setShowNui(false);
  }

  const handleIdentityCardClick = (e) => {
    e.preventDefault(); // Pour empêcher l'affichage du menu contextuel par défaut
    console.log(e.type)
    if (e.type === 'click') {
      // Clic gauche
      setShowIdentityCard(true);
      setShowNui(false);
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

 if (showNui) {
  return (
    <div className="playerInfo">
      <header className='playerInfo__header'>
        <h1>{playerData.firstname} {playerData.lastname}</h1>
      </header>
      <div className='playerInfo__body'>
        {showSubMenu ? (
          <ul className='playerInfo__list'>
            <li></li>
          </ul>
        ):(
          <ul className='playerInfo__list'>
            <li className='playerInfo__list__item' onClick={handleGiveMoney}>Argent liquide : ${playerData.money}</li>
            <li className='playerInfo__list__item' onClick={handleIdentityCardClick} onContextMenu={handleIdentityCardClick}>Carte identité</li>
            <li className='playerInfo__list__item'>Permis de conduire</li>
            <li className='playerInfo__list__item'>Permis de port d'arme</li>
            <li className='playerInfo__list__item' onClick={handleSavePosition}>Sauvegarder</li>
            <li className='playerInfo__list__item' onClick={handleCloseMenu}>Fermer</li>
          </ul>
        )}
      </div>
    </div>
  );
  }
  else if (showIdentityCard) {
    return (
      <IdentityCard player={player} />
    )
  }
  else if (showAmountMenu) {
    return (
      <Amount confirm={handleGiveMoney} cancel={handleCancelAmount}>
        Insérer un montant
      </Amount>
    )
  }
  else {
    return null;
  }
};

export default App;