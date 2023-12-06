const Account = require('./account.js');

(async () => {
    const PlayerManager = require('./core/playerManager.js');

onNet('orion:bank:s:createAccount', () => {
    //if first time player, create account. Si player have item "procuration" create account
    const source = global.source;
    const player = PlayerManager.getPlayerBySource(source);
    //const itemProcuration = player.inventory.find(item => item.name === 'procuration');
    let itemProcuration = true;

    if (player) {
        const account = new Account(null, 100, player.id, [], false);
        player.bank = account;
        player.save();
        emitNet('orion:showNotification', source, 'Compte créé !');
    }
})
})();