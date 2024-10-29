// server/events/playerEvents.js
const playerController = require('../controllers/playerController');

on('playerConnecting', (name, setKickReason, deferrals) => {
    deferrals.defer();
    const _source = global.source;

    playerController.handlePlayerConnecting(_source, name, deferrals);
});

on('playerDropped', (reason) => {
    const _source = global.source;
    playerController.handlePlayerDropped(_source, reason);
});
