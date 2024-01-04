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
import DialogBox from './components/dialogBox/dialogBox';
import Garage from './window/garage/Garage';

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
        case "updatePlayerStatus":
          setVisible(prevData => ({ ...prevData, showPlayerHUD: payload.showPlayerHUD }));
          setData(prevData => ({ ...prevData, player: { ...prevData.player, hunger: payload.hunger, thirst: payload.thirst } }))
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
          setData(prevData => ({ ...prevData, player: { ...prevData.player, skin: payload.skin } }))
          break;
        case "showBankInterface":
          if (payload.type == 'bank') {
            setVisible(prevState => ({ ...prevState, bankHUD: payload.bankHUD }));
          }
          else if (payload.type == 'atm') {
            setVisible(prevState => ({ ...prevState, atmHUD: payload.atmHUD }));
          }
          setData(prevData => ({ ...prevData, bankMaxWithdraw: payload.maxWithdraw, player: { ...prevData.player, money: payload.player.money, lastname: payload.player.lastname, firstname: payload.player.firstname, account: payload.account, card: payload.card } }))
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
        case "hideFrame":
          closeAllMenus();
          break;
        case "pnjDialog":
          setVisible(prevState => ({ ...prevState, dialogHUD: payload.dialogHUD }));
          setData(prevData => ({ ...prevData, dialogData: payload.dialogData }));
          break;
        case "showGarage":
          setVisible(prevState => ({ ...prevState, garageHUD: payload.garageHUD }));
          setData(prevData => ({ ...prevData, garage: payload.garage }));
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

      {visible.bankHUD && (
        <Bank onClose={() => handleCloseMenu('bankInterface')} />
      )}

      {visible.garageHUD && (
        <Garage />
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

      {visible.dialogHUD && (
        <DialogBox />
      )}
    </>
  );
};

export default App;