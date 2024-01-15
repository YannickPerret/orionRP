//https://github.com/tringuyenk19/skincreator/blob/master/client.lua
//ReportCrime
//GetPedCauseOfDeath
//prop_ld_health_pack
//PlaceObjectOnGroundProperly

(async () => {
  let playerData = {};

  let handsUp = false;
  let playerIsDead = false;
  let mug = false;
  let playerNeedsActivated = false;
  let playerIsCuffed = false;
  let playerIsConnected = false;
  let hunger = 100;
  let thirst = 100;

  // sit down
  let playerIsSitting = false;
  let lastPositionPlayer = false;
  let currentObject = false;
  let currentScenario = {};



  const objectTypes = [
    {
      type: 'bank',
      objects: [
        GetHashKey('prop_atm_03'),
        GetHashKey('prop_fleeca_atm'),
        GetHashKey('prop_atm_02'),
        GetHashKey('prop_atm_01')
      ],
      message: 'Appuyez sur ~g~E~w~ pour utiliser le distributeur',
      action: () => {
        emitNet('orion:bank:s:getAccountInterface', "atm");
      }
    },
    {
      type: 'phone',
      objects: [
        GetHashKey('prop_phonebox_01a'),
        GetHashKey('prop_phonebox_03'),
        GetHashKey('prop_phonebox_01c'),
        GetHashKey('prop_phonebox_02'),
        GetHashKey('prop_phonebox_01b'),
        GetHashKey('prop_phonebox_04')
      ],
      message: 'Appuyez sur ~g~E~w~ pour utiliser le téléphone',
      action: () => {
        emitNet('orion:phone:s:getPhoneInterface');
      }
    },
    {
      type: 'water',
      objects: [
        GetHashKey('prop_watercooler'),
        GetHashKey('prop_watercooler_dark')
      ],
      message: 'Appuyez sur ~g~E~w~ pour boire de l\'eau',
      action: () => {
        emitNet('orion:shop:s:drinkWater');
      }
    },
    {
      type: 'drink',
      objects: [
        GetHashKey('prop_vend_soda_01'),
        GetHashKey('prop_vend_soda_02'),
        GetHashKey('prop_vend_coffe_01')
      ],
      message: 'Appuyez sur ~g~E~w~ pour acheter une boisson',
      action: () => {
        console.log('buyDrink')
        emitNet('orion:shop:s:buyDrink');
      }
    },
    {
      type: 'snack',
      objects: [
        GetHashKey('prop_vend_snak_01'),
        GetHashKey('prop_vend_snak_02')
      ],
      message: 'Appuyez sur ~g~E~w~ pour acheter un snack',
      action: () => {
        emitNet('orion:shop:s:buySnack');
      }
    },
    {
      type: 'newspaper',
      objects: [
        GetHashKey('p_cs_paper_disp_1'),
        GetHashKey('p_cs_paper_disp_2')
      ],
      message: 'Appuyez sur ~g~E~w~ pour lire le journal',
      action: () => {
        emitNet('orion:shop:s:buyNewspaper');
      }
    },
    {
      type: 'bin',
      objects: [
        GetHashKey('prop_bin_01a'),
        GetHashKey('prop_bin_01b'),
        GetHashKey('prop_cs_bin_03')
      ],
      message: 'Appuyez sur ~g~E~w~ pour jeter à la poubelle',
      action: () => {
        emitNet('orion:inventory:c:dropItem');
      }
    }
  ]

  function modelLoadedAsync() {
    return new Promise((resolve) => {
      const timer = setInterval(() => {
        const ped = PlayerPedId();
        const model = GetEntityModel(ped);

        if (model && HasModelLoaded(model)) {
          resolve(ped);
          clearInterval(timer);
        }
      }, 100);
    });
  }

  async function getMugshot() {
    const ped = await modelLoadedAsync();

    mug = RegisterPedheadshotTransparent(ped);

    const timer = setInterval(() => {
      if (!IsPedheadshotValid(mug)) {
        UnregisterPedheadshot(mug);

        mug = RegisterPedheadshotTransparent(ped);
      } else {
        if (IsPedheadshotReady(mug)) {
          SendNUIMessage({
            mugshot: GetPedheadshotTxdString(mug),
          });
          UnregisterPedheadshot(mug);
          clearInterval(timer);
        }
      }
    }, 100);
  }

  onNet('orion:player:c:handsUp', async () => {
    const playerPed = PlayerPedId();
    let dict = "missminuteman_1ig_2"
    let anim = "handsup_enter"

    if (IsPedInAnyVehicle(GetPlayerPed(-1), false)) {
      return;
    }
    if (IsPedArmed(GetPlayerPed(-1), 7)) {
      return;
    }
    if (IsPedCuffed(GetPlayerPed(-1))) {
      return;
    }
    if (IsPedSwimming(GetPlayerPed(-1))) {
      return;
    }
    if (IsPedRagdoll(GetPlayerPed(-1))) {
      return;
    }

    while (!HasAnimDictLoaded(dict)) {
      RequestAnimDict(dict);
      await exports['orion'].delay(100);
    }

    if (IsControlJustPressed(1, 323)) {
      if (!handsUp) {
        ClearPedTasks(playerPed);
        FreezeEntityPosition(playerPed, false)
        TaskPlayAnim(playerPed, dict, anim, 8.0, -8.0, -1, 50, 0, false, false, false);
      }
      else {
        ClearPedTasks(playerPed);
        ClearPedTasksImmediately(playerPed);
      }
    }
    handsUp = !handsUp;

  })

  exports('getPlayerIsConnected', () => {
    return playerIsConnected;
  });

  on('onClientGameTypeStart', () => {
    exports.spawnmanager.setAutoSpawn(false);
  });

  on('onClientResourceStart', async (resourceName) => {
    if (GetCurrentResourceName() != resourceName) {
      return;
    }
    getMugshot();
  });

  exports("getPlayerData", () => {
    return playerData;
  });

  onNet('orion:player:c:setPlayerData', data => {
    playerData = data;
  });

  exports("setPlayerData", (data) => {
    playerData = data;
  });

  onNet('orion:player:c:modifyNeeds', async (duration, hungerValue, thirstValue) => {
    await exports['orion'].delay(duration);

    if (Number(hungerValue)) {
      hunger = hunger + hungerValue;
      if (hunger > 100) {
        hunger = 100;
      }
    }

    if (Number(thirstValue)) {
      thirst = thirst + thirstValue;
      if (thirst > 100) {
        thirst = 100;
      }
    }

    SendNUIMessage({
      action: 'updatePlayerStatus',
      payload: {
        thirst: thirst,
        hunger: hunger,
      },
    });
  })

  RegisterCommand('tpto', (source, args) => {
    const playerPed = GetPlayerPed(-1);
    const blip = GetFirstBlipInfoId(8); // ID 8 correspond à un waypoint
    if (blip !== 0) {
      const coord = GetBlipInfoIdCoord(blip);
      RequestCollisionAtCoord(coord[0], coord[1], coord[2]);

      // Attendre que la hauteur du sol soit chargée
      let groundZ = 0;
      let groundCheck = false;

      setTimeout(() => {
        [groundCheck, groundZ] = GetGroundZFor_3dCoord(coord[0], coord[1], coord[2], 0, false);
        if (groundCheck) {
          SetEntityCoordsNoOffset(playerPed, coord[0], coord[1], groundZ + 1.0, false, false, true);
        } else {
          SetEntityCoords(playerPed, coord[0], coord[1], coord[2], false, false, false, true);
        }
      }, 1000);
    } else {
      console.log('Aucun waypoint trouvé.');
    }
  },
    false
  );

  RegisterNuiCallbackType('identityCard');
  on('__cfx_nui:identityCard', (data, cb) => {
    cb({ ok: true });
  });

  RegisterNuiCallbackType('giveAmount');
  on('__cfx_nui:giveAmount', (data, cb) => {
    const amount = parseInt(data.amount);
    const nearbyPlayers = exports['orion'].findNearbyPlayers(3);

    if (nearbyPlayers.length > 0) {
      emitNet('orion:player:s:giveAmount', nearbyPlayers[0], amount);
    } else {
      emit('orion:showNotification', 'Aucun joueur à proximité');
    }
    cb({ ok: true });
  });

  RegisterCommand('revive', (source, args) => {
    const myPlayer = GetPlayerServerId(PlayerId());

    SetEntityHealth(PlayerPedId(), 200);
    ClearPedBloodDamage(PlayerPedId());
    StopScreenEffect('DeathFailOut');

    let ped = PlayerPedId();
    let coords = GetEntityCoords(ped, false);
    let heading = GetEntityHeading(ped);
    NetworkResurrectLocalPlayer(coords[0], coords[1], coords[2], heading, true, false);
  });

  RegisterNuiCallbackType('validateSkin');
  on('__cfx_nui:validateSkin', (data, cb) => {
    const firstname = data.firstname;
    const lastname = data.lastname;

    // Face
    const finalSkin = {
      skin: data.skin,
      face: data.face,
      hair: data.hair,
      beard: data.beard,
      makeup: data.makeup,
    }

    if (firstname?.length >= 3 && lastname?.length >= 3 && finalSkin) {
      emit('orion:customization:c:ShowSkinCreator', false);
      emitNet('orion:player:s:createNewPlayer', { firstname, lastname, finalSkin });
      cb({ ok: true });
    } else {
      emit(
        'orion:showNotification',
        'Veuillez entrer un prénom et un nom de famille valide ainsi que créer un personnage.'
      );
      cb({ ok: false });
    }
  });

  RegisterNuiCallbackType('savePosition');
  on('__cfx_nui:savePosition', (data, cb) => {
    emitNet('orion:savePlayerPosition', GetEntityCoords(GetPlayerPed(-1), true));
    cb({ ok: true });
  });

  onNet('orion:player:c:playerDied', message => {
    SetEntityHealth(PlayerPedId(), 0);
    StartScreenEffect('DeathFailOut', 0, false);

    SendNUIMessage({
      action: 'showDeathMessage',
      data: {
        message,
      },
    });
  });

  onNet('orion:c:player:createNewPlayer', () => {
    emit('orion:customization:c:ShowSkinCreator', true);
  })

  onNet('orion:player:c:playerConnected', (playerData) => {

    exports['orion'].setPlayerData(playerData);
    playerNeedsActivated = true;
    playerIsConnected = true;

    SetEntityCoords(GetPlayerPed(-1), parseFloat(playerData.position.x), parseFloat(playerData.position.y), parseFloat(playerData.position.z), false, false, false, false);
    SetEntityHeading(GetPlayerPed(-1), parseFloat(playerData.position.heading));

    //SendNuiMessage(JSON.stringify({ action: 'switchToIngame' }));

    emitNet('orion:blips:s:initializeBlips')
    emitNet('orion:markers:s:initializeMarkers')
    emit('orion:target:c:initializeTargets')
    emitNet('orion:jobs:s:initializeJobs')

    setInterval(() => {
      const [playerPositionX, playerPositionY, playerPositionZ] = GetEntityCoords(GetPlayerPed(-1), true);
      emitNet('orion:savePlayerPosition', playerPositionX, playerPositionY, playerPositionZ);
    }, 900000);

  });

  onNet('orion:player:c:playerDead', (enable) => {
    let ped = PlayerPedId();
    playerIsDead = enable;
    if (enable) {
      if (IsPlayerDead(ped)) {
        SetEntityHealth(PlayerPedId(), 0);
        StartScreenEffect('DeathFailOut', 0, false);
        SendNUIMessage({
          action: 'showDeathMessage',
          payload: {
            playerDeadMessage: 'Vous êtes dans le coma, veuillez attendre un médecin'
          },
        });
      }
    }
    else {
      SetEntityHealth(PlayerPedId(), 200);
      ClearPedBloodDamage(PlayerPedId());
      StopScreenEffect('DeathFailOut');
      NetworkResurrectLocalPlayer(GetEntityCoords(ped, false), GetEntityHeading(ped), true, false);
    }
  })

  onNet('orion:player:c:sitDown', async ({ entity, coords, type }) => {
    const playerPed = PlayerPedId();
    if (entity && !IsEntityAttachedToAnyPed(entity) && coords && !playerIsSitting) {
      if (IsPositionOccupied(coords[0], coords[1], coords[2], 0.5, false, false, false, false, false, 0, false)) {
        return;
      }

      if (type == 'bed') {
        currentScenario = 'WORLD_HUMAN_SUNBATHE_BACK';
        let objectHeading = GetEntityHeading(entity);
        lastPositionPlayer = GetEntityCoords(playerPed, true);
        FreezeEntityPosition(playerPed, true);
        FreezeEntityPosition(entity, true);
        currentObject = entity;
        //set player is sitting*/
        SetEntityCoords(playerPed, coords[0], coords[1], coords[2] + 0.5);
        SetEntityHeading(playerPed, (objectHeading - 180));

        TaskStartScenarioAtPosition(playerPed, currentScenario, coords[0], coords[1], coords[2], (objectHeading - 180), -1, false, true, 0, false);
      }
      else if (type == 'chair') {
        currentScenario = 'PROP_HUMAN_SEAT_CHAIR_MP_PLAYER';

        let objectHeading = GetEntityHeading(entity);
        lastPositionPlayer = GetEntityCoords(playerPed, true);
        FreezeEntityPosition(playerPed, true);
        FreezeEntityPosition(entity, true);
        currentObject = entity;
        //set player is sitting*/
        SetEntityCoords(playerPed, coords[0], coords[1], coords[2] + 0.5);
        SetEntityHeading(playerPed, (objectHeading - 180));

        TaskStartScenarioAtPosition(playerPed, currentScenario, coords[0], coords[1], coords[2], (objectHeading - 180), -1, false, true, 0, false);
        await exports['orion'].delay(100)

      }
      else if (type == 'bench') {
        currentScenario = 'PROP_HUMAN_SEAT_BENCH';
        //seat posiiton in bench
        let seatPosition = GetEntityCoords(entity, true);
        let objectHeading = GetEntityHeading(entity);
        lastPositionPlayer = GetEntityCoords(playerPed, true);
        if (IsPositionOccupied(seatPosition[0], seatPosition[1], seatPosition[2] + 0.5, 0.5, false, false, false, false, false, 0, false)) {
          return;
        }

        FreezeEntityPosition(playerPed, true);
        FreezeEntityPosition(entity, true);

        currentObject = entity;

        TaskStartScenarioAtPosition(playerPed, currentScenario, seatPosition[0], seatPosition[1], seatPosition[2] + 0.5, (objectHeading - 180), -1, false, true, 0, false);
      }

      playerIsSitting = true;
    }
    else {

      TaskStartScenarioAtPosition(playerPed, currentScenario, 0.0, 0.0, 0.0, 180.0, 2, true, false)
      while (IsPedUsingScenario(playerPed, currentScenario)) {
        await exports['orion'].delay(100)
      }

      ClearPedTasks(playerPed);


      FreezeEntityPosition(playerPed, false);
      FreezeEntityPosition(currentObject, false);
      playerIsSitting = false;
    }

  })

  setInterval(() => {
    //const ped = PlayerPedId();
    SendNUIMessage({
      action: 'updatePlayerStatus',
      payload: {
        showPlayerHUD: !IsPauseMenuActive(),
        //health: GetEntityHealth(ped) - (GetEntityMaxHealth(ped) === 175 ? 75 : 100),
        //armor: GetPedArmour(ped),
      },
    });
  }, 100);

  setInterval(() => {
    if (playerNeedsActivated && !playerIsDead) {
      hunger = hunger - exports['orion'].getRandomBetween(1, 5);
      thirst = thirst - exports['orion'].getRandomBetween(1, 5);
      if (hunger <= 0) {
        hunger = 0;
        emit('orion:player:c:playerDead', true);
      }
      if (thirst <= 0) {
        thirst = 0;
        emit('orion:player:c:playerDead', true);
      }

      SendNUIMessage({
        action: 'updatePlayerStatus',
        payload: {
          hunger: hunger,
          thirst: thirst,
        },
      });
    }
  }, 150000);

  on('onClientResourceStop', (resourceName) => {
    if (GetCurrentResourceName() != resourceName) {
      return;
    }
    if (mug) UnregisterPedheadshot(mug);
  });

  onNet('orion:player:c:showIdCard', () => {
    console.log('showIdCard')
  });

  (async () => {
    try {
      const targetOptionsPlayer = [
        {
          label: 'Voir la carte d\'identité',
          icon: 'CircleUserRound',
          color: 'black',
          action: {
            type: 'client',
            event: 'orion:player:c:showIdCard',
          }
        },
      ];
      if (playerIsSitting) {
        targetOptionsPlayer.push({
          label: 'Se lever',
          icon: 'Sofa',
          color: 'black',
          action: {
            type: 'client',
            event: 'orion:player:c:sitDown',
          }
        })
      }

      const targetOptionsOtherPlayer = [
        {
          label: 'Montrer la carte d\'identité',
          icon: 'CircleUserRound',
          color: 'black',
          action: {
            type: 'client',
            event: 'orion:player:c:showIdCard',
          }
        }
      ];

      const targetOptionsObjects = [
        {
          label: 'Acheter une boisson pour 5$',
          icon: 'CupSoda',
          color: 'black',
          hash: [
            GetHashKey('prop_vend_soda_01'),
            GetHashKey('prop_vend_soda_02'),
            GetHashKey('prop_vend_coffe_01'),
            GetHashKey('prop_vend_fridge01'),
            GetHashKey('prop_vend_water_01'),
          ],
          action: {
            type: 'client',
            event: 'orion:shop:s:buyDrink',
          }
        },
        {
          label: 'Acheter un snack pour 5$',
          icon: 'Sandwich',
          color: 'black',
          hash: [
            GetHashKey('prop_vend_snak_01'),
            GetHashKey('prop_vend_snak_02'),
            GetHashKey('prop_vend_snak_01_tu')
          ],
          action: {
            type: 'client',
            event: 'orion:shop:s:buySnack',
          }
        },
        {
          label: 'Jeter à la poubelle',
          icon: 'Trash2',
          color: 'black',
          hash: [
            GetHashKey('prop_bin_01a'),
            GetHashKey('prop_bin_01b'),
            GetHashKey('prop_cs_bin_03')
          ],
          action: {
            type: 'client',
            event: 'orion:inventory:c:dropItem',
          }
        },
        {
          label: 'S\'asseoir',
          icon: 'Sofa',
          color: 'black',
          hash: [
            GetHashKey('prop_wheelchair_01'),
            GetHashKey('prop_rock_chair_01'),
            GetHashKey('p_yacht_chair_01_s'),
            GetHashKey('prop_off_chair_04_s'),
            GetHashKey('prop_cs_office_chair'),
            GetHashKey('prop_direct_chair_01'),
            GetHashKey('prop_direct_chair_02'),
            GetHashKey('prop_yaught_chair_01'),
            GetHashKey('prop_gc_chair02'),
            GetHashKey('prop_armchair_01'),
            GetHashKey('prop_chair_01a'),
            GetHashKey('prop_chair_08'),
            GetHashKey('prop_clown_chair'),
            GetHashKey('prop_chair_04a'),
            GetHashKey('prop_chateau_chair_01'),
            GetHashKey('prop_chair_02'),
            GetHashKey('prop_chair_05'),
            GetHashKey('prop_chair_07'),
            GetHashKey('prop_chair_01b'),
            GetHashKey('prop_chair_10'),
            GetHashKey('prop_chair_04b'),
            GetHashKey('prop_old_wood_chair'),
            GetHashKey('prop_chair_03'),
            GetHashKey('prop_chair_09'),
            GetHashKey('prop_chair_06'),
            GetHashKey('prop_off_chair_01'),
            GetHashKey('prop_off_chair_03'),
            GetHashKey('prop_off_chair_04b'),
            GetHashKey('prop_off_chair_04'),
            GetHashKey('v_corp_offchair'),
            GetHashKey('prop_off_chair_05'),
            GetHashKey('v_club_officechair'),
            GetHashKey('prop_sol_chair'),
            GetHashKey('hei_prop_heist_off_chair'),
            GetHashKey('hei_prop_hei_skid_chair'),
            GetHashKey('p_armchair_01_s'),
            GetHashKey('p_clb_officechair_s'),
            GetHashKey('p_ilev_p_easychair_s'),
            GetHashKey('p_soloffchair_s'),
            GetHashKey('v_ilev_m_dinechair'),
            GetHashKey('v_ilev_chair02_ped'),
            GetHashKey('prop_waiting_seat_01'),
            GetHashKey('prop_air_bench_01'),
            GetHashKey('prop_fib_3b_bench'),
            GetHashKey('v_club_stagechair'),
            GetHashKey('prop_old_deck_chair'),
            GetHashKey('prop_skid_chair_01'),
            GetHashKey('prop_skid_chair_02'),
            GetHashKey('prop_skid_chair_03'),
            GetHashKey('prop_wheelchair_01_s'),
            GetHashKey('p_dinechair_01_s'),
            GetHashKey('v_corp_bk_chair3'),
            GetHashKey('v_corp_cd_chair'),
            GetHashKey('v_ilev_hd_chair'),
            GetHashKey('v_ilev_p_easychair'),
            GetHashKey('v_ret_gc_chair03'),
            GetHashKey('prop_ld_farm_chair01'),
            GetHashKey('prop_table_04_chr'),
            GetHashKey('prop_table_05_chr'),
            GetHashKey('prop_table_06_chr'),
            GetHashKey('v_ilev_leath_chr'),
            GetHashKey('prop_table_01_chr_a'),
            GetHashKey('prop_table_01_chr_b'),
            GetHashKey('prop_table_02_chr'),
            GetHashKey('prop_table_03b_chr'),
            GetHashKey('prop_table_03_chr'),
            GetHashKey('prop_torture_ch_01'),
            GetHashKey('v_ilev_fh_dineeamesa'),

          ],
          action: {
            type: 'client',
            event: 'orion:player:c:sitDown',
          },
          args: {
            type: 'chair'
          }
        },
        {
          label: 'Se coucher sur le lit',
          icon: 'BedSingle',
          color: 'black',
          hash: [
            GetHashKey('p_mbbed_s'),
            GetHashKey('p_v_res_tt_bed_s'),
            GetHashKey('v_res_msonbed_s'),
            GetHashKey('p_lestersbed_s')

          ],
          event: {
            type: 'client',
            event: 'orion:player:c:sitDown',
          },
          args: {
            type: 'bed'
          }
        },
        {
          label: 'S\'asseoir sur le banc',
          icon: 'BedDouble',
          color: 'black',
          hash: [
            GetHashKey('prop_bench_09'),
            GetHashKey('prop_bench_08'),
            GetHashKey('prop_bench_01c'),
            GetHashKey('prop_bench_05'),
            GetHashKey('prop_bench_01a'),
            GetHashKey('prop_bench_02'),
            GetHashKey('prop_bench_10'),
            GetHashKey('prop_bench_01b'),
            GetHashKey('prop_bench_03'),
            GetHashKey('prop_bench_07'),
            GetHashKey('prop_bench_06'),
            GetHashKey('prop_rub_couch01'),
          ],
          action: {
            type: 'client',
            event: 'orion:player:c:sitDown',
          },
          args: {
            type: 'bench'
          }
        }
      ]

      emit('orion:target:c:registerNewOptions', "player", targetOptionsPlayer);
      emit('orion:target:c:registerNewOptions', "otherPlayer", targetOptionsOtherPlayer);
      emit('orion:target:c:registerNewOptions', "object", targetOptionsObjects);
    }
    catch (e) {
      console.log(e)
    }
  })();

})()
