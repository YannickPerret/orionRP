// server/scripts/christmasEvent.j
// Activer la météo "Neige"
const _setChristmasWeather = () => {
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
        _setChristmasWeather();
    }
};

// Activer l'événement de Noël à une date spécifique
startChristmasEvent()

