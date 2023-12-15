(async () => {
    const OpusScript = require("opusscript");

    RegisterKeyMapping('Talk', 'Talk', 'keyboard', 'N');
    RegisterCommand('Talk', () => {
        emitNet('orion:voice:s:toggle', GetPlayerServerId(PlayerId()));
    }, false);
})();