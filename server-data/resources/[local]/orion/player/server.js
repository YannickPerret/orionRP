(async () => {

  const { db, r } = require('./core/server/database.js');
  const PlayerManager = require('./core/server/playerManager.js');
  const Player = require('./player/player.js');
  const Phone = require('./phone/phone.js');
  const { Inventory } = require('./inventory/inventory.js');


  // Position par défaut du joueur
  const playerPosition = [-530.77, -2113.83, 9.0];

  const enableDiscordWhitelist = true;
  const discordGuildId = '1234567890';
  const discordBotToken = '';

  const discordWhiteList = ['admin', 'moderateur', 'developpeur', 'helper'];
  const discordBlackList = ['guest', 'muted', 'banned'];

  const discordNotWhitelistedMessage = "Vous n'êtes pas whitelisté sur le discord du serveur !";
  const discordBlacklistedMessage = 'Vous êtes blacklisté sur le discord du serveur !';
  const discordNotInGuildMessage = "Vous n'êtes pas dans le discord du serveur !";

  const discordRefreshCacheTime = '1h';

  function getIdentifier(source) {
    let steamId = null;
    let license = null;

    for (let i = 0; i < GetNumPlayerIdentifiers(source); i++) {
      let identifier = GetPlayerIdentifier(source, i);
      if (identifier.includes('steam:')) {
        steamId = identifier;
        break;
      } else if (identifier.includes('license:')) {
        license = identifier;
        break;
      }
    }

    return [steamId, license];
  }

  onNet('orion:savePlayerPosition', async (x, y, z) => {
    const source = global.source;
    const player = PlayerManager.getPlayerBySource(source);
    if (player) {
      player.position = { x, y, z };
      await player.save();
      emitNet('orion:showNotification', source, 'Position sauvegardée !');
    }
  });

  onNet('orion:player:s:giveAmount', (target, amount) => {
    if (isNaN(amount) || amount <= 0) {
      emitNet('orion:showNotification', source, 'Montant invalide !');
      return;
    }

    if (!target) {
      emitNet('orion:showNotification', source, 'Joueur invalide !');
      return;
    }

    if (PlayerManager.getPlayerBySource(source).money < amount) {
      emitNet('orion:showNotification', source, "Vous n'avez pas assez d'argent !");
      return;
    }

    PlayerManager.getPlayerBySource(source).money -= amount;
    PlayerManager.getPlayerBySource(target).money += amount;

    PlayerManager.getPlayerBySource(source).save();
    PlayerManager.getPlayerBySource(target).save();

    emitNet('orion:showNotification', target, `Vous avez reçu ${amount} $ !`);
    emitNet('orion:showNotification', global.source, `Vous avez donné ${amount} $ !`);
  });

  onNet('orion:player:s:playerSpawned', async () => {
    //deferrals.defer();

    const source = global.source;
    let [steamId, license] = getIdentifier(source);

    console.log(`[Orion] ${steamId || license} se connecte au serveur`);

    if (!steamId && !license) {
      console.error('Erreur lors de la récupération du SteamID ou de la licence');
      return;
    }

    try {
      const filters = { steamId: steamId, license: license };
      const playerData = await db.getByWithFilter('players', filters);

      if (playerData.length > 0) {

        // Traitement pour un joueur existant
        const newPlayer = new Player({
          id: playerData[0].id,
          source: source,
          steamId: steamId,
          firstname: playerData[0].firstname,
          lastname: playerData[0].lastname,
          phone: playerData[0].phone,
          money: playerData[0].money,
          accountId: playerData[0].accountId,
          position: playerData[0].position,
          license: playerData[0].license,
          discord: playerData[0].discord,
          mugshot: playerData[0].mugshot,
          skin: playerData[0].skin,
          inventoryId: playerData[0].inventoryId,
        });

        PlayerManager.addPlayer(newPlayer.source, newPlayer);

        emitNet('orion:showNotification', source, `Bienvenue ${newPlayer.firstname} sur Orion !`);
        emitNet('orion:playerConnected', source, newPlayer);
        //deferrals.done();
      } else {
        console.log("Le joueur n'existe pas, création en cours...");
        // Emit on client to open new player menu
        emitNet('orion:c:player:createNewPlayer', source);
      }
    } catch (erreur) {
      // deferalls.done('Erreur lors de la récupération/création du joueur');
      console.error(erreur);
    }
  });

  onNet('orion:player:s:createNewPlayer', async data => {
    const source = global.source;
    const skin = data.finalSkin;
    const firstname = data.firstname;
    const lastname = data.lastname;
    let [steamId, license] = getIdentifier(source);

    try {
      const phoneNumber = await Phone.generateNewNumber();
      const playerInventory = Inventory.createEmpty();
      const itemsStarter = await db.getByWithFilter('items', starter.enabled = true);

      itemsStarter.forEach(item => {
        console.log("item", item);
        playerInventory.addItem(item, item.starter.quantity);
      });

      if (playerInventory.save()) {

        const newPlayer = new Player({
          id: r.uuid(),
          source: source,
          steamId: steamId,
          license: license,
          firstname: firstname,
          lastname: lastname,
          phone: Number(phoneNumber),
          money: 500,
          accountId: null,
          position: {
            x: playerPosition[0],
            y: playerPosition[1],
            z: playerPosition[2],
          },
          discord: null,
          mugshot: null,
          skin: skin,
          inventoryId: playerInventory.id,
        });

        if (await newPlayer.save()) {
          PlayerManager.addPlayer(source, newPlayer);
          emitNet('orion:player:c:completRegister', source, newPlayer);
        } else {
          emitNet('orion:showNotification', source, `Erreur lors de la création du joueur`);
          throw new Error('Erreur lors de la création du joueur');
        }
      }
      else {
        emitNet('orion:showNotification', source, `Erreur lors de la création du joueur`);
        throw new Error('Erreur lors de la création du joueur');
      }
    } catch (erreur) {
      console.error(erreur);
    }
  });

  onNet('orion:getPlayerData', () => {
    const source = global.source;
    const playerData = PlayerManager.getPlayerBySource(source);
    if (playerData) {
      emitNet('orion:openPlayerMenu', source, {
        firstname: playerData.firstname,
        lastname: playerData.lastname,
        money: playerData.money,
        mugshot: playerData.mugshot,
      });
    }
  });

  onNet('orion:saveMugshotUrl', async mugshotUrl => {
    const source = global.source;
    const playerData = PlayerManager.getPlayerBySource(source);
    if (playerData) {
      console.log('Mugshot URL : ', mugshotUrl);
      playerData.mugshot = mugshotUrl;
      await playerData.save();
    }
  });

})()