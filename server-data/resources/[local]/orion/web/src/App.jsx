import React, {useState, useEffect, useReducer} from 'react';
import './styles/App.css';
import {playSound} from './utils/sound'
import PlayerMenu from './menu/playerMenu/PlayerMenu';
import MainWindow from './window/MainWindow';
import { sendNui } from './utils/fetchNui';
import { SideMenu } from './menu/SideMenu';
import JobMenu from './menu/JobMenu/JobMenu';
import Amount from './components/input/amount/Amount';

const initialState = {
  player: {
    firstname: 'John',
    lastname: 'Doe',
    money: 100,
    phone: '06 06 06 06 06'
  },
  job:{
    name: 'Chômeur',
    grade: 'Aucun',
    salary: 0
  },
  isPlayerDead: false,
  playerDeadMessage: '',
  sideMenuUi: false,
  showPlayerMenu: false,
  mainMenuWindow: false,
  showJobMenu: false,
  showAmountMenu: false,
  isDriver: false,
  speed: 0,
  amount: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SHOW_DEATH_MESSAGE':
      return { ...state, isPlayerDead: true, playerDeadMessage: action.data.message };
    case 'SHOW_PLAYER_MENU':
      return { ...state, sideMenuUi: true, showPlayerMenu: true, player: action.data };
    case 'SHOW_JOB_MENU':
      return { ...state, sideMenuUi: true, showJobMenu: true };
    case 'SHOW_GIVE_AMOUNT_MENU':
      console.log('show give amount menu');
      return { ...state, showAmountMenu: true };
    case 'CLOSE_NUI':
      return { ...state, sideMenuUi: false, showPlayerMenu: false, showJobMenu: false, showAmountMenu: false };
    case "CLOSE_SIDE_MENU":
      return { ...state, sideMenuUi: false, showPlayerMenu: false, showJobMenu: false };
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
        case "showGiveAmountMenu" :
          dispatch({type: 'SHOW_GIVE_AMOUNT_MENU', data});
          break;
        case "closeSideMenu":
          dispatch({ type: 'CLOSE_SIDE_MENU' });
          break;
        case "ShowPlayerMenu":
          dispatch({ type: 'SHOW_PLAYER_MENU', data });
          break;
        case "ShowJobMenu":
          dispatch({ type: 'SHOW_JOB_MENU', data });
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

  const handleGiveAmount = (amount) => {
    sendNui('giveAmount', {amount: amount});
    dispatch({type: 'CLOSE_NUI'});
  }


  if (state.isPlayerDead) {
    return (
      <div className='death'>
        <div className='death__message'>{state.playerDeadMessage}</div>
      </div>
    );
  } else if (state.sideMenuUi && !state.mainMenuWindow && !state.showAmountMenu) {
    return (
      [
        state.showPlayerMenu && (
          <SideMenu>
            <header className='SideMenu__header'>
              <h1>{state.player.firstname} {state.player.lastname}</h1>
            </header>
            <PlayerMenu playerData={state.player} onCloseMenu={handleCloseMenu} />
          </SideMenu>
        ),

        state.showJobMenu && (
          <SideMenu>
            <header className='SideMenu__header'>
              <h1>{state.job.name}</h1>
            </header>
            <JobMenu jobData={state.job} onCloseMenu={handleCloseMenu} />
          </SideMenu>
        )
      ]
       
    );
  } else if (state.mainMenuWindow && !state.showAmountMenu && !state.sideMenuUi) {
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
  if (state.showAmountMenu && !state.sideMenuUi && !state.showPlayerMenu) {
    return (
      <Amount confirm={handleGiveAmount}>
        Donner de l'argent liquide :
      </Amount>
    );
  }
 
};

export default App;