/* exemple des data du dialog */
/*
const dialogueData = {
  "1": {
    text: "Page 1: Bonjour, que souhaitez-vous faire ?",
    options: [
      { text: "Aller à la page 2", nextPageId: "2", action: "orion:bank:s:createAccount" },
      { text: "Aller à la page 3", nextPageId: null, action: null }
    ]
  },
  "2": {
    text: "Page 2: Vous avez choisi l'option 1.",
    options: [
      { text: "Retour à la page 1", nextPageId: "1" }
      // autres options...
    ]
  },
]
*/

(async () => {

    let dialogOpen = false;

    exports('createPnjDialog', (dialogData) => {
        dialogOpen = !dialogOpen;
        SetNuiFocus(dialogOpen, dialogOpen);
        SendNuiMessage(JSON.stringify({
            action: 'pnjDialog',
            payload: {
                dialogHUD: dialogOpen,
                dialogData: dialogData
            }
        }));
    })

    RegisterNuiCallbackType('dialogChoice');
    on('__cfx_nui:dialogChoice', (data, cb) => {
        console.log('Choix reçu du client:', data);
        if (data.choice == null) return;
        if (data.choice.value === 'close') {
            dialogOpen = false;
            SetNuiFocus(false, false);
            return;
        }
        emitNet(data.choice.action);
        cb('ok');
    });

})()

