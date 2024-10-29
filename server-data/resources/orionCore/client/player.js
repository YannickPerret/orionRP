// Gestion des événements liés au joueur côté client

on('onClientResourceStart', (resourceName) => {
    if (GetCurrentResourceName() !== resourceName) return;
    console.log('Ressource client démarrée : ' + resourceName);
});
