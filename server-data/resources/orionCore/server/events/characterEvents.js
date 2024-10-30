const userController = require('../controllers/User');
const characterController = require('../controllers/Character');

on('playerConnecting', (name, setKickReason, deferrals) => {
  deferrals.defer();
  const _source = global.source;

  userController.handleUserConnecting(_source, name, deferrals);
});

on('playerDropped', (reason) => {
  const _source = global.source;
  userController.handleUserDropped(_source, reason);
});
