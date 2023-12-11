
(() => {
    onNet('orion:invoice:c:waitToPay' = (invoiceId) => {
        exports['orion'].showNotification('Vous avez reçu une facture, appuyez sur ~g~Y~w~ pour la payer ou ~r~N~w~ pour la refuser');
        const timer = setTimeout(() => {
            exports['orion'].showNotification('Vous n\'avez pas payé la facture à temps, elle a été annulée');
            emitNet('orion:invoice:s:cancel', invoiceId);
            clearTimeout(timer);
        }, 30000);

        onNet('orion:invoice:s:pay', () => {
            clearTimeout(timer);
        })
    })

    const createInvoice = (price) => {
        const targetPlayer = exports['orion'].findNearbyPlayers(2) //GetPlayerServerId(NetworkGetEntityOwner(PlayerPedId()));
        if (targetPlayer.length <= 0) {
          exports['orion'].showNotification('Vous devez être proche d\'un joueur pour lui faire une facture');
        };
    
        emitNet('orion:invoice:s:create', targetPlayer[0], price, () => {
            exports['orion'].showNotification('Vous avez envoyé une facture à ' + targetPlayer[0]);
            emit('orion:invoice:c:waitToPay');
        });
    }
    exports('createInvoice', createInvoice);
})()


RegisterCommand('invoice:create', async (source, args) => {
    const price = args[0];
    createInvoice(price);
}
, false);