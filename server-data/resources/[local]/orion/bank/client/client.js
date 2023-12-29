(async () => {
  const bankCoordsJson = JSON.parse(LoadResourceFile(GetCurrentResourceName(), 'bank/bank.json'));
  const atmModelHash = [-1364697528, 506770882, -870868698, -1126237515];


  let bankIsOpen = false
  let showBankInterface = false;
  let showConseillerInterface = false;

  const showATMdisplay = () => {

    showBankInterface = !showBankInterface;
    //SendNuiMessage(JSON.stringify({ showATMInterface: showBankInterface }));
    SetNuiFocus(showBankInterface, showBankInterface);
  }

  const showBankDisplay = () => {
    // Tester si le joueur à un compte bancaire

    showBankInterface = !showBankInterface;
    //SendNuiMessage(JSON.stringify({ showBankInterface: showBankInterface }));
    SetNuiFocus(showBankInterface, showBankInterface);
  }

  const showConseillerDisplay = () => {
    //showConseillerInterface = !showConseillerInterface;
    /*SendNuiMessage(JSON.stringify({ showConseillerInterface: showConseillerInterface }));
    SetNuiFocus(showConseillerInterface, showConseillerInterface);*/

    console.log('showConseillerDisplay')
    emitNet('orion:bank:c:showConseillerInterface');
    emitNet('orion:bank:s:createAccount');
  }


  const renewCard = () => {
    console.log('renewCard');
    // create new item cards with id
    // set new card id into account
    // delete old card
    // save new account
  }

  const topUpMoneyBank = (bank, amount) => {
    console.log('topUpMoneyBank', bank, amount);
  }

  const withdrawMoneyBank = (bank, amount) => {
    console.log('withdrawMoneyBank', bank, amount);
  }

  const transferMoneyBank = (bank, amount) => {
    console.log('transferMoneyBank', bank, amount);
  }

  const createAccountBank = (bank, amount) => {
    emitNet('orion:bank:s:createAccount', bank, amount);
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
              showConseillerDisplay();
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
