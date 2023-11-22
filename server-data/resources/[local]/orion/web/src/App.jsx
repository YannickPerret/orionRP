import React, {useState, useEffect, useReducer} from 'react';
import './styles/App.css';
import {playSound} from './utils/sound'
import PlayerMenu from './menu/playerMenu/PlayerMenu';
import MainWindow from './window/MainWindow';
import { sendNui } from './utils/fetchNui';
import { SideMenu } from './menu/SideMenu';

const initialState = {
  player: {
    firstname: 'John',
    lastname: 'Doe',
    money: 100,
    phone: '06 06 06 06 06'
  },
  isPlayerDead: false,
  playerDeadMessage: '',
  sideMenuUi: true,
  showPlayerMenu: true,
  mainMenuWindow: false,
  isDriver: false,
  speed: 0
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SHOW_DEATH_MESSAGE':
      return { ...state, isPlayerDead: true, playerDeadMessage: action.data.message };
    case 'SHOW_PLAYER_MENU':
      return { ...state, sideMenuUi: true, showPlayerMenu: true, player: action.data };
    case 'CLOSE_NUI':
      return { ...state, sideMenuUi: false, showPlayerMenu: false };
    case 'UPDATE_SPEED':
      return { ...state, speed: action.data.speed, isDriver: action.data.isDriver };
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const handleMessage = (event) => {
      const { action, data } = event.data;
      switch (action) {
        case "showDeathMessage":
          dispatch({ type: 'SHOW_DEATH_MESSAGE', data });
          break;
        case "ShowPlayerMenu":
          dispatch({ type: 'SHOW_PLAYER_MENU', data });
          break;
        case "closeNUI":
          dispatch({ type: 'CLOSE_NUI' });
          break;
        case "playSound":
          playSound(data.sound, data.volume);
          break;
        case 'updateSpeed':
          dispatch({ type: 'UPDATE_SPEED', data });
          break;
        // Autres cas si nécessaire
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleCloseMenu = () => {
    dispatch({ type: 'CLOSE_NUI' });
    sendNui('closeNUI', null)
  };


  if (state.isPlayerDead) {
    return (
      <div className='death'>
        <div className='death__message'>{state.playerDeadMessage}</div>
      </div>
    );
  } else if (state.sideMenuUi) {
    return (
        state.showPlayerMenu && (
          <SideMenu>
            <header className='SideMenu__header'>
              <h1>{state.player.firstname} {state.player.lastname}</h1>
            </header>
            <PlayerMenu playerData={state.player} onCloseMenu={handleCloseMenu} />
          </SideMenu>
        )
    );
  } else if (state.mainMenuWindow) {
    return (
      <MainWindow>
        test
      </MainWindow>
    );
  } else if (state.isDriver) {
    return (
      <div className='driver'>
        <div className='driver__speed'>{state.speed} km/h</div>
      </div>
    );
  }
 
};

export default App;