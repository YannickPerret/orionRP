
(async () => {
    const Account = require('./bank/class/account.js');
    const PlayerManager = require('./core/playerManager.js');

    onNet('orion:bank:s:createAccount', () => {
        const source = global.source;
        const player = PlayerManager.getPlayerBySource(source);
        //const itemProcuration = player.inventory.find(item => item.name === 'procuration');
        let itemProcuration = true;

        if (player) {
            if (player.accountId) {
                emitNet('orion:showNotification', source, 'Vous avez déjà un compte bancaire !');
                return;
            }
            if (itemProcuration) {
                let uuid = exports['orion'].uuid();
                const account = new Account(uuid, 100, player.id, [], false, [], null);
                uuid = exports['orion'].uuid();
                const card = new Card(uuid, account.id, 1111);
                card.save();
                account.setNewCardId(card.id);
                account.save();
                emitNet('orion:showNotification', source, 'Vous venez de créer votre compte bancaire !');
            }
            else {
                emitNet('orion:showNotification', source, 'Il vous faut une procuration pour créer un compte !');
            }
        }
    })
})();