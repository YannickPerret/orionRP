const PlayerManager = require('./system/playerManager.js');
const Player = require('./player/player.js');
const { db, r } = require('./system/database.js');

// Position par défaut du joueur
const playerPosition = [-530.77, -2113.83, 9.0];

onNet('orion:playerSpawned', async () => {
  let steamId = null;
  let license = null;
  let source = global.source;

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
      });

      PlayerManager.addPlayer(player.source, player);
      console.log('[Orion] Joueur existant récupéré : ', player);
      emitNet('orion:showNotification', source, `Bienvenue ${playerData[0].firstname} sur Orion !`);
      emitNet('orion:sendPlayerData', source, playerData[0]);
    } else {
      // Emit on client to open new player menu
      emitNet('orion:createNewPlayer', source);

      // Traitement pour un nouveau joueur
      const newPlayerData = {
        id: r.uuid(),
        steamId: steamId,
        license: license,
        firstname: 'John',
        lastname: 'Doe',
        phone: '5552727',
        money: 500,
        bank: 0,
        position: {
          x: playerPosition[0],
          y: playerPosition[1],
          z: playerPosition[2],
        },
        discord: null,
        mugshot: null,
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
        });

        PlayerManager.addPlayer(newPlayer.source, newPlayer);
        emitNet('orion:mugshot', source);

        console.log('[Orion] Nouveau joueur créé : ', newPlayer.license);
      } else {
        throw new Error('Erreur lors de la création du joueur');
      }
    }
  } catch (erreur) {
    console.error('Erreur lors de la récupération/création du joueur : ', erreur);
  }
});

onNet('orion:player:createNewPlayer', async data => {
  const source = global.source;
});

on('playerDropped', reason => {
  let sourceId = global.source; // Obtenez l'ID unique du joueur
  PlayerManager.removePlayer(sourceId);
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

/*
AddEventHandler("spawn:PlayerSpawned",function()
    local source = source
    local Ped = GetPlayerPed(source)
    print(Ped) -- Here returns 0
    if Ped and DoesEntityExist(Ped) then
        SetPlayerRoutingBucket(source,3)
        -- Proceed to player login
    end
end)*/
