// permettre de faire une facture par un joueur pour aller sur son compte 
// permettre de faire une facture par une entreprise pour aller sur le compte entreprise

(async () => {
    const Account = require('./bank/class/account.js');
    const PlayerManager = require('./core/server/playerManager.js');
    const Inventory = require('./inventory/inventory.js');
    const { Item } = require('./inventory/item.js');
    const Invoice = require('./bank/class/invoice.js');
    const Card = require('./bank/class/card.js');
    const { v4: uuidv4 } = require('uuid');
    const { db, r } = require('./core/server/database.js');

    onNet('orion:bank:s:getAccountInterface', async (type) => {
        const source = global.source;
        const player = PlayerManager.getPlayerBySource(source);
        const inventory = Inventory.getById(player.inventoryId);

        if (player) {
            if (player.accountId) {
                const account = await Account.getById(player.accountId);
                if (account) {
                    if (inventory.hasItem(Item.getByName('bank_card').id)) {
                        const card = await Card.getById(account.cardId);
                        if (card) {
                            console.log('card', card)
                            if (type == "bank")
                                emitNet('orion:bank:c:showBankInterface', source, player, account, card);
                            else if (type == "atm")
                                emitNet('orion:bank:c:showATMInterface', source, player, account, card);
                        }
                        else {
                            emitNet('orion:showNotification', source, "Vous n'avez pas de carte bancaire!");
                        }
                    }
                    else {
                        emitNet('orion:showNotification', source, "Vous n'avez pas de carte bancaire!");
                    }
                }
                else {
                    emitNet('orion:showNotification', source, "Vous n'avez pas de compte bancaire!");
                }
            }
            else {
                emitNet('orion:bank:c:showNoAccountInterface', source, "Vous n'avez pas de compte bancaire!");
            }
        }
    })


    onNet('orion:bank:s:createAccount', async () => {
        const source = global.source;
        const player = PlayerManager.getPlayerBySource(source);
        const cardItem = await Item.getByName('bank_card');
        const inventory = await Inventory.getById(player.inventoryId);

        if (!player) {
            emitNet('orion:bank:c:showConseillerInterface', source, "Vous devez être connecté pour interagir avec le conseiller !");
            return;
        }
        if (!inventory) {
            emitNet('orion:bank:c:showConseillerInterface', source, "Vous devez être connecté pour interagir avec le conseiller !");
            return;
        }

        if (player.accountId) {
            emitNet('orion:bank:c:showNoAccountInterface', source, "Vous avez déjà un compte bancaire !");
            return;
        }

        if (inventory.hasItem(cardItem)) {
            emitNet('orion:bank:c:showNoAccountInterface', source, 'Vous avez déjà une carte bancaire !');
            return;
        }

        const account = new Account({ id: r.uuid(), balance: 100, owner: player.id });
        await account.save();
        console.log('account', account)

        const card = new Card({ id: r.uuid(), accountId: account.id, code: Card.getRandomCode() });
        await card.save();

        account.setNewCardId(card.id);
        await account.save();

        player.setAccountId(account.id);
        await player.save();

        inventory.addItem(cardItem, 1, { cardId: card.id });
        await inventory.save();

        emitNet('orion:bank:c:showConseillerInterface', -1, 'Vous venez de créer votre compte bancaire !');
    })

    onNet('orion:bank:s:renewCard', async () => {
        const source = global.source;
        const player = PlayerManager.getPlayerBySource(source);
        const inventory = await Inventory.getById(player.inventoryId);
        const itemProcuration = await Item.getByName('procuration_bank');
        const PlayerAccount = await Account.getById(player.accountId);

        if (player) {
            if (PlayerAccount) {

                if (inventory.hasItem(itemProcuration)) {
                    const card = new Card({ accountId: player.accountId, code: Card.getRandomCode() });
                    await card.save();

                    PlayerAccount.setNewCardId(card.id);
                    await PlayerAccount.save();

                    inventory.removeItem(itemProcuration.id, 1);
                    await inventory.save();

                    emitNet('orion:bank:c:showConseillerInterface', -1, 'Vous venez de récupérer ou créer votre compte !');
                }
                else {
                    emitNet('orion:bank:c:showConseillerInterface', -1, 'Il vous faut une procuration pour créer un compte !');
                }
            }
            else {
                emitNet('orion:bank:c:showConseillerInterface', -1, "Vous n'avez pas de compte bancaire !");
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
                        emitNet('orion:invoice:c:waitToPay', invoice.id);
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

    onNet('orion:invoice:s:cancel', async (invoiceId) => {
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