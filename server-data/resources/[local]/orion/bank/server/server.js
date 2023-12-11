
(async () => {
    const Account = require('./bank/class/account.js');
    const PlayerManager = require('./core/server/playerManager.js');
    const Card = require('./bank/class/card.js');
    const { v4: uuidv4 } = require('uuid');


    onNet('orion:bank:s:createAccount', () => {
        const source = global.source;
        const player = PlayerManager.getPlayerBySource(source);

        if (player) {
            if (player.accountId) {
                emitNet('orion:showNotification', source, 'Vous avez déjà un compte bancaire !');
                return;
            }
            let uuid = uuidv4( )
            const account = new Account(uuid, 100, player.id, [], false, [], null);
            uuid = uuidv4()
            const card = new Card(uuid, account.id, Card.getRandomCode());
            card.save();
            account.setNewCardId(card.id);
            account.save();
            player.setAccountId(account.id);
            player.save();
            emitNet('orion:showNotification', source, 'Vous venez de créer votre compte bancaire !');
        }
    })

    onNet('orion:bank:s:renewCard', async () => {
        const source = global.source;
        const player = PlayerManager.getPlayerBySource(source);
        let itemProcuration = true;
        //const itemProcuration = player.inventory.find(item => item.name === 'procuration');

        if (player) {
            if (player.accountId) {
                emitNet('orion:showNotification', source, 'Vous avez déjà un compte bancaire !');
                return;
            }
            if (itemProcuration) {
                let uuid = uuidv4()
                const card = new Card(uuid, player.accountId, Card.getRandomCode());
                const account = await Account.getById(player.accountId);
                card.save();
                account.setNewCardId(card.id);
                account.save();

                itemProcuration = false;
                emitNet('orion:showNotification', source, 'Vous venez de créer votre compte bancaire !');
            }
            else {
                emitNet('orion:showNotification', source, 'Il vous faut une procuration pour créer un compte !');
            }
        }
    })

    onNet('orion:invoice:s:create', (targetPlayer, price) => {
        const source = global.source;
        const player = PlayerManager.getPlayerBySource(source);
        const target = PlayerManager.getPlayerBySource(targetPlayer);
        const invoice = new Invoice(uuidv4(), player.id, target.id, price, false);

        if (player) {
            if (target) {
                emitNet('orion:showNotification', targetPlayer, `Vous avez reçu une facture de ${price}€`);
                emitNet('orion:showNotification', source, `Vous avez envoyé une facture de ${price}€ à ${target.firstname} ${target.lastname}`);
            }
        }
    })

})();