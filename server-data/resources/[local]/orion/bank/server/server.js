// permettre de faire une facture par un joueur pour aller sur son compte 
// permettre de faire une facture par une entreprise pour aller sur le compte entreprise

(async () => {
    const Account = require('./bank/class/account.js');
    const PlayerManager = require('./core/server/playerManager.js');
    const Invoice = require('./bank/class/invoice.js');
    const Card = require('./bank/class/card.js');
    const { v4: uuidv4 } = require('uuid');


    onNet('orion:bank:s:createAccount', async () => {
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
            await card.save();
            account.setNewCardId(card.id);
            await account.save();
            player.setAccountId(account.id);
            await player.save();
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
                await card.save();
                account.setNewCardId(card.id);
                await account.save();

                itemProcuration = false;
                emitNet('orion:showNotification', source, 'Vous venez de créer votre compte bancaire !');
            }
            else {
                emitNet('orion:showNotification', source, 'Il vous faut une procuration pour créer un compte !');
            }
        }
    })

    onNet('orion:invoice:s:create', async (targetPlayer, price, type) => {
        // type = 0 => player
        // type = 1 => entreprise
        const source = global.source;
        const player = PlayerManager.getPlayerBySource(source);
        const target = PlayerManager.getPlayerBySource(targetPlayer);
        const amount = Number(price);
        let invoice;
        try {
            if (!amount || amount <= 0) throw new Error(`Le montant de la facture est incorrect`);
            if (player) {
                if (target) {

                    if (type == 0) {
                        invoice = new Invoice(uuidv4(), player.id, target.id, amount);
                    }
                    else if (type == 1) {
                        invoice = new Invoice(uuidv4(), player.job.id, target.id, amount);
                    }
                    else {
                        throw new Error(`Le type de facture est incorrect`);
                    }
                    
                    if (typeof amount != Number && amount <= 0) {
                        throw new Error(`Le montant de la facture est incorrect`);
                    }


                    if (invoice) {
                        await invoice.save();
                        onNet('orion:invoice:c:waitToPay', invoice.id);
                    }
                    else {
                        throw new Error(`Une erreur est survenue`);
                    }
                }
                else {
                    throw new Error(`Le joueur n'est pas connecté`);
                }
            }
            else {
                throw new Error(`Vous n'êtes pas connecté`);
            }
        }
        catch (e) {
            console.error(e);
            emitNet('orion:showNotification', source, e);
        }
    })

    onNet('orion:invoice:s:pay', async (invoiceId) => {
        const source = global.source;
        const player = PlayerManager.getPlayerBySource(source);
        const invoice = Invoice.getById(invoiceId);
        const account = await Account.getById(player.accountId);
        const targetId = invoice.targetId;

        if (player) {
            if (invoice) {
                if (account.balance >= invoice.price) {
                    account.setBalence(-invoice.price);
                    await account.save();
                    invoice.paid(true);
                    await invoice.save();
                    emitNet('orion:showNotification', source, `Vous avez payé la facture`);
                }
                else {
                    emitNet('orion:showNotification', source, `Vous n'avez pas assez d'argent sur votre compte`);
                }
            }
        }
    })

    onNet('orion:invoice:s:cancel',async  (invoiceId) => {
        const source = global.source;
        const player = PlayerManager.getPlayerBySource(source);
        const invoice = Invoice.getById(invoiceId);

        if (player) {
            if (invoice) {
                invoice.paid(false);
                await invoice.save();
                emitNet('orion:showNotification', source, `Vous avez refusé la facture de ${invoice.price}€`);
            }
        }
    })

})();