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
import { useData } from './providers/dataContext';
import { useVisibility } from './providers/visibilityProvider';
import Speed from './components/vehicle/speed';
import Inventory from './window/inventory/Inventory';

const App = () => {
  const { visible, setVisible, closeAllMenus } = useVisibility();
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
        case "inventoryHUD":
          setVisible(prevData => ({ ...prevData, inventoryHUD: payload.inventoryHUD }));
          setData(prevData => ({ ...prevData, inventory: payload.inventory }));
          break;
        case "updateInventory":
          setData(prevData => ({ ...prevData, inventory: payload.inventory }));
          break;
        case "closeMenus":
          closeAllMenus();
          break;
        case "showAmountMenu":
          setVisible('amountMenu', true);
          break;
        case "showSkinCreator":
          setVisible(prevState => ({ ...prevState, skinCreator: payload.skinCreator }));
          break;
        case "showBankInterface":
          setVisible('bankInterface', true);
          break;
        case "playSound":
          playSound(data);
          break;
        case "showVehicleUI":
          setVisible(prevState => ({ ...prevState, vehicleHUD: payload.pedInVehicle }));
          setData(prevData => ({ ...prevData, vehicle: { isDriver: payload.isDriver, seatbelt: payload.seatbelt, speed: payload.speed, fuel: payload.fuel } }));
          break;
        case "seatbelt":
          setData(prevData => ({ ...prevData, vehicle: { ...prevData.vehicle, seatbelt: payload.seatbelt } }));
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
      {visible.playerMenu && (
        <SideMenu>
          <PlayerMenu onCloseMenu={() => handleCloseMenu('playerMenu')} />
        </SideMenu>
      )}

      {visible.inventoryHUD && (
        <Inventory />
      )}

      {visible.jobMenu && (
        <SideMenu>
          <JobMenu onCloseMenu={() => handleCloseMenu('jobMenu')} />
        </SideMenu>
      )}

      {visible.amountMenu && (
        <SideMenu>
          <Amount onGiveAmount={handleGiveAmount} />
        </SideMenu>
      )}

      {visible.skinCreator && (
        <SkinCreator onClose={() => closeAllMenus} />
      )}

      {visible.bankInterface && (
        <Bank onClose={() => handleCloseMenu('bankInterface')} />
      )}

      {visible.vehicleHUD && (
        <>
          {data.vehicle?.isDriver && (
            <>
              <Fuel />
              <Speed />
            </>
          )}
          {data.vehicle?.seatbelt && (
            <Seatbelt />
          )}
        </>
      )}
      {// <Voice />
      }
    </>
  );
};

export default App;