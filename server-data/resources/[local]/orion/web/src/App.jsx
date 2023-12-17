import React, { useEffect } from 'react';
import './styles/App.css';
import { playSound } from './utils/sound'
import PlayerMenu from './menu/playerMenu/PlayerMenu';
import { sendNui } from './utils/fetchNui';
import { SideMenu } from './menu/SideMenu';
import JobMenu from './menu/JobMenu/JobMenu';
import Amount from './components/input/amount/Amount';
import SkinCreator from './window/SkinCreator/SkinCreator';
import Seatbelt from './components/vehicle/Seatbelt';
import Fuel from './components/vehicle/fuel';
import Bank from './window/bank/Bank';
import Voice from './voice/Voice';
import { useData } from './utils/dataContext';
import { useVisibility } from './providers/visibilityProvider';

const App = () => {
  const { visibility, setVisible, closeAllMenus } = useVisibility();
  const { data, setData } = useData();


  useEffect(() => {
    const handleMessage = async (event) => {
      const { action, payload } = event.data;
      switch (action) {
        case "showPlayerMenu":
          setVisible('playerMenu', true);
          break;
        case "showJobMenu":
          setVisible('jobMenu', true);
          break;
        case "closeMenus":
          closeAllMenus();
          break;
        case "showAmountMenu":
          setVisible('amountMenu', true);
          break;
        case "showSkinCreator":
          setVisible('skinCreator', true);
          break;
        case "showBankInterface":
          setVisible('bankInterface', true);
          break;
        case "playSound":
          playSound(data);
          break;
        case "showVehicleUI":
          setData({ ...data, vehicle: { ...data.vehicle, pedInVehicle: payload.pedInVehicle, isDriver: payload.isDriver, sealtbelt: payload.seatbelt } });
          break;
        case "speedometer":
          setData({ ...data, vehicle: { ...data.vehicle, speed: payload.speed } });
        case "fuel":
          setData({ ...data, vehicle: { ...data.vehicle, fuel: payload.fuel } });
          break;
        case "seatbelt":
          setData({ ...data, vehicle: { ...data.vehicle, seatbelt: payload.seatbelt } });
          break;
        default:
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [setVisible, closeAllMenus]);



  const handleCloseMenu = (menu) => {
    setVisible(menu, false);
  };

  const handleGiveAmount = async (amount) => {
    await sendNui('giveAmount', { amount: amount });
    dispatch({ type: 'CLOSE_NUI' });
  }

  return (
    <>
      {visibility.playerMenu && (
        <SideMenu>
          <PlayerMenu onCloseMenu={() => handleCloseMenu('playerMenu')} />
        </SideMenu>
      )}

      {visibility.jobMenu && (
        <SideMenu>
          <JobMenu onCloseMenu={() => handleCloseMenu('jobMenu')} />
        </SideMenu>
      )}

      {visibility.amountMenu && (
        <SideMenu>
          <Amount onGiveAmount={handleGiveAmount} />
        </SideMenu>
      )}

      {visibility.skinCreator && (
        <SkinCreator onClose={() => handleCloseMenu('skinCreator')} />
      )}

      {visibility.bankInterface && (
        <Bank onClose={() => handleCloseMenu('bankInterface')} />
      )}

      {visibility.vehicle?.pedInVehicle && (
        <>
          {visibility.vehicle?.isDriver && (
            <Fuel />
          )}
          <Seatbelt />
        </>
      )}
      <Voice />
    </>
  );
};

export default App;