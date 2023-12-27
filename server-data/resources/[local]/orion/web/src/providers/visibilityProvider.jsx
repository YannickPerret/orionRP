import React, { createContext, useContext, useEffect, useState } from "react";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { sendNui } from "../utils/fetchNui";

const VisibilityCtx = createContext(null);

export const VisibilityProvider = ({ children }) => {
  // Définir l'état initial pour la visibilité de différents composants
  const [visible, setVisible] = useState({
    main: false,
    playerMenu: false,
    jobMenu: false,
    amountMenu: false,
    skinCreator: false,
    bankInterface: false,
    vehicleHUD: false,
    inventoryHUD: false,
  });

  // Utiliser useNuiEvent pour écouter les événements NUI spécifiques et mettre à jour la visibilité
  useNuiEvent("setVisible", setVisible);

  // Effet pour gérer les interactions clavier
  useEffect(() => {

    if (!visible) return;

    const keyHandler = (e) => {
      if (["Backspace", "Escape"].includes(e.code)) {
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
  const closeAllMenus = () => {
    setVisible({
      main: false,
      playerMenu: false,
      jobMenu: false,
      amountMenu: false,
      skinCreator: false,
      bankInterface: false,
      vehicleHUD: false,
      inventoryHUD: false,
    });

    sendNui("hideFrame")
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
