import React, {useState, useEffect} from 'react';
import './App.css'
import {sendNui} from '../utils/fetchNui'

const App = () => {
  const [playerData, setPlayerData] = useState({ firstname: 'John', lastname: 'Doe', money: 100 });
  const [showNui, setShowNui] = useState(false);

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

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleCloseMenu = () => {
    setShowNui(false);
    sendNui('closeNUI',null);
  }
  const handleSavePosition = () => {
    sendNui('savePosition',null);
  }

  if (!showNui) {
    return null;
  }

  return (
    <div className="playerInfo">
      <header className='playerInfo__header'>
        <h1>{playerData.firstname} {playerData.lastname}</h1>
      </header>
      <div className='playerInfo__body'>
        <ul className='playerInfo__list'>
          <li className='playerInfo__list__item'>Argent liquide : ${playerData.money}</li>
          <li className='playerInfo__list__item'>Carte identité</li>
          <li className='playerInfo__list__item'>Permis de conduire</li>
          <li className='playerInfo__list__item'>Permis de port d'arme</li>
          <li className='playerInfo__list__item' onClick={handleSavePosition}>Sauvegarder</li>
          <li className='playerInfo__list__item' onClick={handleCloseMenu}>Fermer</li>
        </ul>
      </div>
    </div>
  );
};

export default App;