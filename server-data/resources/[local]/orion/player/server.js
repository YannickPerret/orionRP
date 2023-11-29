const Player = require('./player/player.js');

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

  return { steamId, license };
}

/*onNet('orion:savePlayerPosition', async (x, y, z) => {
  const source = global.source;
  const player = PlayerManager.getPlayerBySource(source);
  if (player) {
    player.position = { x, y, z };
    await player.save();
    emitNet('orion:showNotification', source, 'Position sauvegardée !');
  }
});*/

onNet('orion:player:giveAmount', (target, amount) => {
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

  emitNet('orion:showNotification', target, `Vous avez reçu ${amount} $ !`);
  emitNet('orion:showNotification', global.source, `Vous avez donné ${amount} $ !`);

  PlayerManager.getPlayerBySource(source).money -= amount;
  PlayerManager.getPlayerBySource(target).money += amount;
});

onNet('orion:playerSpawned', async () => {
  let source = global.source;
  let steamId,
    license = getIdentifier(source);

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
      const player = new Player({
        id: playerData[0].id,
        source: source,
        steamId: steamId,
        firstname: playerData[0].firstname,
        lastname: playerData[0].lastname,
        phone: playerData[0].phone,
        money: playerData[0].money,
        bank: playerData[0].bank,
        position: playerData[0].position,
        license: playerData[0].license,
        discord: playerData[0].discord,
        mugshot: playerData[0].mugshot,
        skin: playerData[0].skin,
      });

      PlayerManager.addPlayer(player.source, player);
      emitNet('orion:showNotification', source, `Bienvenue ${playerData[0].firstname} sur Orion !`);
      emitNet('orion:playerConnected', source, playerData[0]);
    } else {
      // Emit on client to open new player menu
      emitNet('orion:createNewPlayer', source);
    }
  } catch (erreur) {
    console.error('Erreur lors de la récupération/création du joueur : ', erreur);
  }
});

onNet('orion:player:createNewPlayer', async data => {
  const source = global.source;
  const skin = data.finalSkin;
  const firstname = data.firstname;
  const lastname = data.lastname;

  const { steamId, license } = getIdentifier(source);

  const newPlayerData = {
    id: r.uuid(),
    steamId: steamId,
    license: license,
    firstname: firstname,
    lastname: lastname,
    phone: Phone.generateNewNumber(),
    money: 500,
    bank: 0,
    position: {
      x: playerPosition[0],
      y: playerPosition[1],
      z: playerPosition[2],
    },
    discord: null,
    mugshot: null,
    skin: skin,
  };
  const result = await db.insert('players', newPlayerData);

  if (result.inserted === 1) {
    const newPlayer = new Player({
      id: newPlayerData.id,
      source: source,
      steamId: newPlayerData.steamId,
      firstname: newPlayerData.firstname,
      lastname: newPlayerData.lastname,
      phone: newPlayerData.phone,
      money: newPlayerData.money,
      bank: newPlayerData.bank,
      position: newPlayerData.position,
      license: newPlayerData.license,
      discord: newPlayerData.discord,
      mugshot: newPlayerData.mugshot,
      skin: newPlayerData.skin,
    });

    PlayerManager.addPlayer(source, newPlayer);

    emitNet('orion:showNotification', source, `Bienvenue ${firstname} sur Orion !`);
  } else {
    emitNet('orion:showNotification', source, `Erreur lors de la création du joueur`);
    throw new Error('Erreur lors de la création du joueur');
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
