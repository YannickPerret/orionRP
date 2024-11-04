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




setTick(async () => {
    const playerPed = PlayerPedId();
    const vehicle = GetVehiclePedIsIn(playerPed, false);

    if (vehicle) {

        const speed = GetEntitySpeed(vehicle);
        const speedKmh = Math.floor(speed * 3.6);

        // Afficher le texte de la vitesse
        exports['orionCore'].DrawText(`Vitesse: ${speedKmh} km/h`, 0.9, 0.9, 0.5, 255, 255, 255, 200);

        if (!IsVehicleOnAllWheels(vehicle)) {
            DisableControlAction(2, 59)
            DisableControlAction(2, 60)
        }
    }

    await exports['orionCore'].Delay(100);
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

    await exports['orionCore'].Delay(100); // Intervalle pour éviter de surcharger la boucle
});

setTick(async () => {
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

    await exports['orionCore'].Delay(50); // Délai pour optimiser les performances
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


/*********** GESTION FUEL ***********/

function drawFuelGauge(fuelLevel, maxFuel) {
    const x = 0.85; // Position X de la jauge
    const y = 0.95; // Position Y de la jauge
    const width = 0.1; // Largeur de la jauge
    const height = 0.02; // Hauteur de la jauge
    const padding = 0.002; // Espace autour de la jauge

    // Calculer la largeur de la jauge de remplissage en fonction du niveau de carburant
    const filledWidth = (fuelLevel / maxFuel) * width;

    // Dessiner le fond de la jauge (gris)
    DrawRect(x + width / 2, y, width, height, 100, 100, 100, 200);
    // Dessiner la partie remplie de la jauge (vert)
    DrawRect(x + filledWidth / 2, y, filledWidth, height, 0, 255, 0, 200);
}



let lastFuelLevel = 100; // Niveau d'essence initial (peut être modifié)
const globalFuelConsumptionRateMultiplier = 1.0; // Multiplicateur global pour ajuster la consommation

// Fonction pour calculer et appliquer la consommation de carburant
function consumeFuel(vehicle) {
    const rpm = GetVehicleCurrentRpm(vehicle);
    const fuelLevel = GetVehicleFuelLevel(vehicle);
    const fuelConsumptionRate = GetVehicleHandlingFloat(vehicle, "CHandlingData", "fPetrolConsumptionRate") || 0.5;

    // Calcul de la consommation de carburant en fonction des RPM
    const consumption = GetFrameTime() * rpm * fuelConsumptionRate * globalFuelConsumptionRateMultiplier;

    // Mettre à jour le niveau de carburant
    const newFuelLevel = Math.max(fuelLevel - consumption, 0);
    SetVehicleFuelLevel(vehicle, newFuelLevel);

    return newFuelLevel;
}

// Boucle principale de gestion de l'essence
setTick(async () => {
    const playerPed = PlayerPedId();
    const vehicle = GetVehiclePedIsIn(playerPed, false);

    if (vehicle && DoesVehicleUseFuel(vehicle)) {
        // Consomme le carburant et récupère le niveau actuel
        const currentFuelLevel = consumeFuel(vehicle);

        // Récupère le volume du réservoir pour calculer la jauge
        const maxFuelLevel = GetVehicleHandlingFloat(vehicle, "CHandlingData", "fPetrolTankVolume");

        // Affiche la jauge d'essence
        drawFuelGauge(currentFuelLevel, maxFuelLevel);

        // Vérifie si le joueur est à une station d'essence (appel depuis gasStation.js)
        const vehicleCoords = GetEntityCoords(vehicle);
        const atGasStation = exports['orionCore'].isVehicleAtGasStation(vehicleCoords);

        // Affiche le message pour remplir le réservoir si le joueur est à une station d'essence
        if (atGasStation) {
            exports['orionCore'].DisplayFuelMessage(vehicle, currentFuelLevel);
        }

        lastFuelLevel = currentFuelLevel;
    }

    await exports['orionCore'].Delay(1000);
});