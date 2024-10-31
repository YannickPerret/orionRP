// server/scripts/christmasEvent.j
const config = require('../../config/config.js');


// Activer la météo "Neige"
const setChristmasWeather = () => {
    setTick(() => {
        SetWeatherTypeNowPersist("XMAS")
        SetWeatherTypeNow("XMAS")
        SetOverrideWeather("XMAS")
        SetForcePedFootstepsTracks(true)
        SetForceVehicleTrails(true)
        Wait(1);
    });
};

const startChristmasEvent = () => {
    if(config.events.christmas){
        setChristmasWeather();
    }
};

// Activer l'événement de Noël à une date spécifique
startChristmasEvent()

