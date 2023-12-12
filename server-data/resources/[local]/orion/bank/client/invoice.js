
(async () => {

    onNet('orion:invoice:c:waitToPay', (invoiceId) => {
        const timer = setTimeout(() => {
            emit('orion:showNotification', 'Vous n\'avez pas payé la facture à temps, elle a été annulée');
            emitNet('orion:invoice:s:cancel', invoiceId);
            clearTimeout(timer);
        }, 30000);

        emit('orion:showNotification', 'Vous avez reçu une facture, appuyez sur ~g~Y~w~ pour la payer ou ~r~N~w~ pour la refuser');
        if (IsControlJustPressed(0, 246)) {
            emitNet('orion:invoice:s:pay', invoiceId);
            clearTimeout(timer);
        }
        else if (IsControlJustPressed(0, 249)) {
            emitNet('orion:invoice:s:cancel', invoiceId);
            clearTimeout(timer);
        }
    })

    const createInvoice = (price) => {
        const player = exports['orion'].getPlayerServerId();
        const targetPlayer = exports['orion'].findNearbyPlayers(2);
        console.log(targetPlayer);
        if (targetPlayer.length > 0) {
            emitNet('orion:invoice:s:create', targetPlayer[0], price, (invoiceId) => {
                emit('orion:invoice:c:waitToPay', invoiceId);
            });
        };
        emit('orion:showNotification', 'Vous devez être proche d\'un joueur pour lui faire une facture');
        
    }
    exports('createInvoice', createInvoice);


    RegisterCommand('invoice:create', async (source, args) => {
        const price = args[0];
        createInvoice(price);
    }, false);
})()


