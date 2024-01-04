import React, { createContext, useContext, useEffect, useState } from "react";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { sendNui } from "../utils/fetchNui";

const VisibilityCtx = createContext(null);

export const VisibilityProvider = ({ children }) => {
  // Définir l'état initial pour la visibilité de différents composants
  const [visible, setVisible] = useState({
    main: false,
    playerMenu: false,
    showPlayerHUD: false,
    jobMenu: false,
    amountMenu: false,
    skinCreator: false,
    bankHUD: false,
    atmHUD: false,
    vehicleHUD: false,
    inventoryHUD: false,
    dialogHUD: false,
    garageHUD: false,
  });

  // Utiliser useNuiEvent pour écouter les événements NUI spécifiques et mettre à jour la visibilité
  useNuiEvent("setVisible", setVisible);

  // Effet pour gérer les interactions clavier
  useEffect(() => {

    if (!visible) return;

    const keyHandler = (e) => {
      // "Backspace", 
      if (["Escape"].includes(e.code)) {
        closeAllMenus();
        sendNui("hideFrame");
      }
    };

    window.addEventListener("keydown", keyHandler);

    return () => {
      window.removeEventListener("keydown", keyHandler);
    };
  }, [visible]);

  // Fonction pour fermer tous les menus
  const closeAllMenus = (sendToNui = true) => {
    setVisible({
      main: false,
      showPlayerHUD: false,
      playerMenu: false,
      jobMenu: false,
      amountMenu: false,
      skinCreator: false,
      inventoryHUD: false,
      vehicleHUD: false,
      bankHUD: false,
      atmHUD: false,
      dialogHUD: false,
      garageHUD: false,
    });
    if (sendToNui) {
      sendNui("hideFrame");
    }
  };

  return (
    <VisibilityCtx.Provider value={{ visible, setVisible, closeAllMenus }}>
      <div style={{ visibility: visible ? "visible" : "hidden", height: "100%" }}>
        {children}
      </div>
    </VisibilityCtx.Provider>
  );
};

export const useVisibility = () => useContext(VisibilityCtx);
