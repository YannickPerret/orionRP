import userController from '../controllers/User';

on('playerConnecting', (name: any, setKickReason: any, deferrals: { defer: () => void; }) => {
    deferrals.defer();
    userController.handleUserConnecting(source, name, deferrals);
});

on('playerDropped', (reason: string) => {
    const playerId = global.source;
    userController.handleUserDropped(playerId, reason);
});
