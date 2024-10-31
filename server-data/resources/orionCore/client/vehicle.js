let wasInVehicle = false;
let snowChainsEquipped = false;
let defaultTractionMax = null;
let defaultTractionMin = null;
let seatbeltOn = false;
let lastVelocity = 0;
const ejectionThreshold = 45.0;


RegisterCommand("toggleSnowChains", () => {
    snowChainsEquipped = !snowChainsEquipped;
    const status = snowChainsEquipped ? "équipées" : "retirées";
    console.log(`Les chaînes à neige sont maintenant ${status}.`);
    emitNet('chat:addMessage', -1, { args: ["Système", `Les chaînes à neige sont maintenant ${status}.`] });
}, false);

RegisterCommand("seatbelt", () => {
    seatbeltOn = !seatbeltOn;
    const message = seatbeltOn ? 'Ceinture attachée.' : 'Ceinture détachée.';
    emitNet('chat:addMessage', { args: ["Système", message] });
}, false);

onNet('orionCore:spawnVehicle', async (vehicleName) => {
    const playerPed = PlayerPedId();
    const coords = GetEntityCoords(playerPed);
    const vehicleHash = GetHashKey(vehicleName);

    // Charger le modèle
    RequestModel(vehicleHash);
    const modelLoaded = await new Promise((resolve) => {
        const interval = setInterval(() => {
            if (HasModelLoaded(vehicleHash)) {
                clearInterval(interval);
                resolve(true);
            }
        }, 100);
    });

    if (modelLoaded) {
        const vehicle = CreateVehicle(vehicleHash, coords[0], coords[1], coords[2], GetEntityHeading(playerPed), true, false);
        SetPedIntoVehicle(playerPed, vehicle, -1);
        emit('chat:addMessage', { args: ["Admin", `Véhicule ${vehicleName} apparu avec succès.`] });
    } else {
        emit('chat:addMessage', { args: ["Admin", `Le modèle du véhicule ${vehicleName} n'a pas pu être chargé.`] });
    }
});


setTick(() => {
    const playerPed = PlayerPedId();
    const vehicle = GetVehiclePedIsIn(playerPed, false);

    if (vehicle) {
        // Désactiver les contrôles si le véhicule est en l'air ou sur le côté/à l'envers
        if (!IsVehicleOnAllWheels(vehicle)) {
            DisableControlAction(2, 59)
            DisableControlAction(2, 60)
        }
    }

    Wait(100);
});

onNet('orionCore:goToGPSWithVehicle', () => {
    const playerPed = PlayerPedId();
    const waypointBlip = GetFirstBlipInfoId(8); // ID du blip GPS

    if (DoesBlipExist(waypointBlip)) {
        const coords = GetBlipCoords(waypointBlip);
        SetPedCoordsKeepVehicle(playerPed, coords[0], coords[1], coords[2] + 1.0);
        emit('chat:addMessage', { args: ["Admin", "Vous avez été téléporté au point GPS avec votre véhicule."] });
    } else {
        emit('chat:addMessage', { args: ["Admin", "Aucun point GPS trouvé."] });
    }
});

setTick(() => {
    if (IsControlJustPressed(0, 29)) { // Touche "B" pour activer/désactiver la ceinture
        seatbeltOn = !seatbeltOn;
        const message = seatbeltOn ? 'Ceinture attachée.' : 'Ceinture détachée.';
        emitNet('chat:addMessage', { args: ["Système", message] });
    }
});

// Surveillance de la vitesse et des collisions pour gérer les éjections
setTick(async () => {
    const playerPed = PlayerPedId();
    const vehicle = GetVehiclePedIsIn(playerPed, false);

    if (vehicle) {
        // Récupérer la vitesse actuelle du véhicule
        const velocity = GetEntitySpeedVector(vehicle, true);
        const currentSpeed = Math.sqrt(velocity[0] ** 2 + velocity[1] ** 2 + velocity[2] ** 2);

        // Si la vitesse de changement est importante, il y a eu un impact
        if (!seatbeltOn && lastVelocity - currentSpeed > ejectionThreshold) {
            TaskLeaveVehicle(playerPed, vehicle, 4160); // Ejecter le joueur du véhicule
            SetPedToRagdoll(playerPed, 5000, 5000, 0, false, false, false); // Activer le ragdoll pour simuler une chute
            emitNet('chat:addMessage', { args: ["Système", "Vous avez été éjecté !"] });
        }

        // Mettre à jour la vitesse précédente
        lastVelocity = currentSpeed;
    } else {
        // Remettre la vitesse à zéro lorsque le joueur n'est plus dans un véhicule
        lastVelocity = 0;
    }

    await Wait(100); // Intervalle pour éviter de surcharger la boucle
});

setTick(() => {
    const playerPed = PlayerPedId();
    const isInVehicle = IsPedInAnyVehicle(playerPed, false);

    if (isInVehicle) {
        // Si le joueur est dans un véhicule, forcer la vue à la première personne
        SetFollowVehicleCamViewMode(4); // Mode 4 = première personne
        wasInVehicle = true;
    } else if (wasInVehicle) {
        // Si le joueur est sorti du véhicule, revenir en vue à la troisième personne
        SetFollowPedCamViewMode(1); // Mode 1 = troisième personne
        wasInVehicle = false;
    }

    // Désactiver uniquement la touche de changement de vue tant que le joueur est dans un véhicule
    if (wasInVehicle) {
        DisableControlAction(0, 0x0F39D54E, true); // Désactiver la touche de changement de vue
    }

    Wait(50); // Délai pour optimiser les performances
});


function adjustTraction(vehicle, tractionMax, tractionMin) {
    SetVehicleHandlingFloat(vehicle, "CHandlingData", "fTractionCurveMax", tractionMax);
    SetVehicleHandlingFloat(vehicle, "CHandlingData", "fTractionCurveMin", tractionMin);
}

setTick(async () => {
    const playerPed = PlayerPedId();
    const isInVehicle = IsPedInAnyVehicle(playerPed, false);
    const vehicle = GetVehiclePedIsIn(playerPed, false);

    if (isInVehicle && vehicle) {
        const isSnowyWeather = IsWeatherSnowy();

        if (snowChainsEquipped && isSnowyWeather) {
            if (defaultTractionMax === null && defaultTractionMin === null) {
                defaultTractionMax = GetVehicleHandlingFloat(vehicle, "CHandlingData", "fTractionCurveMax");
                defaultTractionMin = GetVehicleHandlingFloat(vehicle, "CHandlingData", "fTractionCurveMin");
            }
            adjustTraction(vehicle, 3.0, 2.6);
        } else if (defaultTractionMax !== null && defaultTractionMin !== null) {
            adjustTraction(vehicle, defaultTractionMax, defaultTractionMin);
        }
    }

    await Wait(400);
});

function IsWeatherSnowy() {
    const currentWeather = GetPrevWeatherTypeHashName();
    return currentWeather === GetHashKey("XMAS") || currentWeather === GetHashKey("SNOW");
}