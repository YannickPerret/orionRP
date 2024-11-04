// resources/[core]/orionCore/client/gasStation.js

const GasStations = [
    { coords: { x: 64.55, y: 20.4, z: 68.9 }, radius: 8 },
    { coords: { x: 200.5, y: -500.4, z: 43.9 }, radius: 8 },
    // Ajoute d'autres stations si nécessaire
];

// Fonction pour vérifier si un véhicule est proche d'une station d'essence
function isVehicleAtGasStation(vehicleCoords) {
    return GasStations.some(gasStation => {
        const dist = Math.sqrt(
            Math.pow(vehicleCoords[0] - gasStation.coords.x, 2) +
            Math.pow(vehicleCoords[1] - gasStation.coords.y, 2) +
            Math.pow(vehicleCoords[2] - gasStation.coords.z, 2)
        );
        return dist <= gasStation.radius;
    });
}

// Fonction pour afficher le message de remplissage de carburant
function DisplayFuelMessage(vehicle, fuelLevel) {
    const tankVolume = GetVehicleHandlingFloat(vehicle, "CHandlingData", "fPetrolTankVolume");
    SetTextComponentFormat("STRING");
    AddTextComponentString(`Essence: ${fuelLevel.toFixed(2)} / ${tankVolume}L. Appuyez sur ~g~G~s~ pour remplir.`);
    DisplayHelpTextFromStringLabel(0, 0, 1, -1);

    // Remplir le réservoir quand le joueur appuie sur "G"
    if (IsControlJustPressed(0, 58)) { // G key
        fillVehicleTank(vehicle);
        emitNet('chat:addMessage', { args: ["Système", "Réservoir rempli !"] });
    }
}

// Fonction pour remplir le réservoir du véhicule
function fillVehicleTank(vehicle) {
    const tankVolume = GetVehicleHandlingFloat(vehicle, "CHandlingData", "fPetrolTankVolume");
    SetVehicleFuelLevel(vehicle, tankVolume); // Remplir le réservoir
}

exports('isVehicleAtGasStation', isVehicleAtGasStation);
exports('DisplayFuelMessage', DisplayFuelMessage);
