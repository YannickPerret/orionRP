const userController = require('../controllers/User.js');

on('playerConnecting', (name, setKickReason, deferrals) => {
    deferrals.defer();
    userController.handleUserConnecting(source, name, deferrals);
});

on('playerDropped', (reason) => {
    const _source = global.source;
    userController.handleUserDropped(_source, reason);
});
