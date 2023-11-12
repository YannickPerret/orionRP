const { getCurrentPlayerBySource } = require("../utils/player.js");

let isNuiOpen = false;

const toggleNui = (source) => {
  const currentPlayer = getCurrentPlayerBySource(source);
  if (!currentPlayer) {
    return; // Aucun joueur trouvé pour cette source
  }

  isNuiOpen = !isNuiOpen;
  SetNuiFocus(isNuiOpen, isNuiOpen);

  if (isNuiOpen) {
    // Envoie les données du joueur à la NUI pour ouvrir l'interface
    SendNuiMessage(
      JSON.stringify({
        action: "setPlayerData",
        data: {
          firstname: currentPlayer.firstname,
          lastname: currentPlayer.lastname,
          money: currentPlayer.money,
          bank: currentPlayer.bank,
        },
      })
    );
  } else {
    // Ferme l'interface NUI
    SendNuiMessage(JSON.stringify({ action: "closeNUI" }));
  }
};

// Commande pour ouvrir/fermer la NUI
RegisterCommand(
  "toggleNUI",
  (source) => {
    toggleNui(source);
  },
  false
);

// Mappage de touche pour la commande toggleNUI
RegisterKeyMapping("toggleNUI", "Toggle the NUI", "keyboard", "F2");

// Callback pour fermer la NUI depuis React
RegisterNuiCallbackType("closeNUI");
on("__cfx_nui:closeNUI", (data, cb) => {
  if (isNuiOpen) {
    toggleNui(global.source); // global.source devrait être la source du joueur actuel
  }
  cb({ ok: true });
});
