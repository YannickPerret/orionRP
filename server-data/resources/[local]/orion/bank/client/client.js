(async () => {
  const bankCoordsJson = JSON.parse(LoadResourceFile(GetCurrentResourceName(), 'bank/bank.json'));
  const atmModelHash = [-1364697528, 506770882, -870868698, -1126237515];
  let showBankInterface = false;

  const showManagementDialog = (playerName) => {
    return {
      1: {
        text: `Bonjour ${playerName}, je suis Amanda, ravie de vous aider aujourd'hui. Que puis-je faire pour vous ?`,
        title: "Conseillière Amanda",
        options: [
          { text: "Ouvrir un nouveau compte", nextPageId: null, action: "orion:bank:s:createAccount" },
          { text: "Demande de renouvellement de carte bancaire", nextPageId: null, action: "orion:bank:s:renewCard" },
        ]
      },
      "cancel": {
        options: [
          { text: "Annuler", nextPageId: null, action: 'orion:bank:c:showNoAccountInterface' }
        ]
      }
    }
  }

  onNet('orion:bank:c:showBankInterface', (player, account, card) => {
    showBankInterface = !showBankInterface;
    SendNuiMessage(JSON.stringify({
      action: 'showBankInterface',
      payload: {
        type: 'bank',
        bankHUD: showBankInterface,
        player: player,
        account: account,
        card: card,
      }
    }));

    SetNuiFocus(showBankInterface, showBankInterface);
  })

  onNet('orion:bank:c:showATMInterface', (player, account, card) => {
    showBankInterface = !showBankInterface;
    SendNuiMessage(JSON.stringify({
      action: 'showBankInterface',
      payload: {
        type: 'atm',
        atmHUD: showBankInterface,
        player: player,
        account: account,
        card: card,
      }
    }));
    SetNuiFocus(showBankInterface, showBankInterface);
  })

  onNet('orion:bank:c:showNoAccountInterface', (message) => {
    showBankInterface = false;
    emit('orion:showNotification', message);
  })


  setTick(async () => {
    while (true) {
      await exports['orion'].delay(5);
      let playerCoords = GetEntityCoords(PlayerPedId(), false);

      for (let bankCoords of bankCoordsJson.banks) {
        let distance = GetDistanceBetweenCoords(playerCoords[0], playerCoords[1], playerCoords[2], bankCoords.coords.X, bankCoords.coords.Y, bankCoords.coords.Z, true)
        if (distance <= 1.3) {
          if (!showBankInterface) {
            emit('orion:showText', 'Appuyez sur ~g~E~w~ pour accéder à la banque');
            if (IsControlJustReleased(0, 38)) {
              console.log("baaaaaank")
              emitNet('orion:bank:s:getAccountInterface', "bank");
              showBankInterface = true;
            }
          }
        }
      }

      for (let atmCoords of bankCoordsJson.atms) {
        let distance = GetDistanceBetweenCoords(playerCoords[0], playerCoords[1], playerCoords[2], atmCoords.X, atmCoords.Y, atmCoords.Z, true)
        if (distance <= 2) {
          if (!showBankInterface) {
            emit('orion:showText', 'Appuyez sur ~g~E~w~ pour accéder à l\'ATM');

            if (IsControlJustReleased(0, 38)) {
              emitNet('orion:bank:s:getAccountInterface', "atm");
              showBankInterface = true;
            }
          }
        }
      }

      for (const mangement of bankCoordsJson.managements) {
        let distance = GetDistanceBetweenCoords(playerCoords[0], playerCoords[1], playerCoords[2], mangement.coords.X, mangement.coords.Y, mangement.coords.Z, true)
        if (distance <= 2) {
          if (!showBankInterface) {
            emit('orion:showText', 'Appuyez sur ~g~E~w~ pour accéder au conseiller');
            if (IsControlJustReleased(0, 38)) {
              const player = exports['orion'].getPlayerData();
              exports['orion'].createPnjDialog(showManagementDialog(`${player.firstname} ${player.lastname}`));
              showBankInterface = true;
            }
          }
        }
      }
    }
  })

  RegisterCommand('bank', async () => {
    showATMInterface();
  }, false);

})();
// créer une interaction pour chaque banque
// créer un interaction pour chaque atm

// banque à un montant de fond (current, max)
// chaque banque à un export pour recharger les fonds
// chaque banque doit demander une carte pour pouvoir retirer de l'argent

/* banque centrale
    Permet de faire une demande de rénouvellement de carte (si item procuration nouvelle carte est possédé)
    Un compte peut avoir 0 ou plusieurs cartes associées

    Il existe des comptes Personnel, Entreprise, Blanchiment

    Les actions possible pour la banque centrale : retirer, déposer, transférer, créer un compte

    Il est possible qu'une autorité puisse faire des recherches dans les accès du compte et de voir l'historique des transactions
    - Un hacker peut retirer de l'argent sur un autre compte (si il a les accès) et rester anonyme s'il à les compétences (hacker peut retirer max 2000 par semaine sur un compte)

    Un client peut configurer son compte pour recevoir l'historique de transaction (cout cher) ou créer une limite de retrait sur le compte (modifiable tout les 7 jours)
*/

/* banque
    Si une carte est possédé, permet de faire :
        - un retrait
        - un dépôt
        - un transfert
*/

/* atm
    Si une carte est possédé, permet de faire :
        - un retrait
        - un transfert
*/
/* accounts
    player -> account_player -> account

    bank
    - id
    - title
    - currentAmount
    - maxAmount
    - type (bank, atm)
    - coords
    - blip
*/

//create interaction input for each model atm and bank
