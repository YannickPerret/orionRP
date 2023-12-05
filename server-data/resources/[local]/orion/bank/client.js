(async () => {
  const bankCoordsJson = JSON.parse(LoadResourceFile(GetCurrentResourceName(), 'bank/bank.json'));
  const atmModelHash = [-1364697528, 506770882, -870868698, -1126237515];
  let bankIsOpen = false

  const bankBlips = [];
  for (const bankCoords of bankCoordsJson.bank) {
    createBlip(bankCoords.coords, 108, 0, 'Banque');
    bankBlips.push(bankCoords.coords);
  }

  
  while (true) {
    await Wait(1000);
    let playerCoords = GetEntityCoords(PlayerPedId(), false);

    for (const atmHash of atmModelHash) {
      const atmHandle = GetClosestObjectOfType(playerCoords[0], playerCoords[1], playerCoords[2], 2.0, atmHash, false, false, false);

      if (atmHandle !== 0) {
        let atmCoords = GetEntityCoords(atmHandle, false);
        if (GetDistanceBetweenCoords(playerCoords[0], playerCoords[1], playerCoords[2], atmCoords[0], atmCoords[1], atmCoords[2], true) <= 2) {
          if (!bankIsOpen) {
            DisplayHelpText('Appuyez sur ~INPUT_CONTEXT~ pour accéder à la banque');
            if (IsControlJustReleased(0, 51)) {
              console.log('bank atm open');
              bankIsOpen = true;
            }
          } else {
            DisplayHelpText('Appuyez sur ~INPUT_CONTEXT~ pour fermer la banque');
            if (IsControlJustReleased(0, 51)) {
              console.log('bank atm close');
              bankIsOpen = false;
            }
          }
        }
      }
    }
  }
})();

const Wait = ms => new Promise(resolve => setTimeout(resolve, ms));

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
