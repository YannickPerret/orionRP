const UserController = require('./server/controllers/User.js');

// Commande pour spawn un véhicule
RegisterCommand('spawnvehicle', async (source, args) => {
    const isAdmin = await UserController.isAdmin(source);
    console.log('isAdmin', isAdmin, "source", source);
    if (isAdmin) {
        const vehicleName = args[0];
        if (!vehicleName) {
            emitNet('chat:addMessage', source, { args: ["Admin", "Vous devez spécifier un nom de véhicule."] });
            return;
        }

        // Envoie l'événement au client pour créer le véhicule
        emitNet('orionCore:spawnVehicle', source, vehicleName);
        emitNet('chat:addMessage', source, { args: ["Admin", `Demande de spawn du véhicule ${vehicleName} envoyée.`] });
    } else {
        emitNet('chat:addMessage', source, { args: ["Admin", "Permission refusée."] });
    }
}, false);

// Commande pour assigner un rôle
RegisterCommand('assignrole', async (source, args) => {
    if (await UserController.isAdmin(source)) {
        const [targetUserId, roleName] = args;
        const success = await UserController.assignRoleToUser(targetUserId, roleName);
        if (success) {
            emitNet('chat:addMessage', source, { args: ["Admin", `Rôle ${roleName} assigné à l'utilisateur ${targetUserId}`] });
        } else {
            emitNet('chat:addMessage', source, { args: ["Admin", "Erreur lors de l'assignation du rôle."] });
        }
    } else {
        emitNet('chat:addMessage', source, { args: ["Admin", "Permission refusée."] });
    }
}, false);

// Commande pour spawn une arme
RegisterCommand('spawnweapon', async (source, args) => {
    if (await UserController.isAdmin(source)) {
        const weaponName = args[0];
        if (!weaponName) {
            emitNet('chat:addMessage', source, { args: ["Admin", "Vous devez spécifier un nom d'arme."] });
            return;
        }
        const playerPed = GetPlayerPed(source);
        const weaponHash = GetHashKey(weaponName.toUpperCase());

        GiveWeaponToPed(playerPed, weaponHash, 250, false, true);
        emitNet('chat:addMessage', source, { args: ["Admin", `Arme ${weaponName} ajoutée avec succès.`] });
    } else {
        emitNet('chat:addMessage', source, { args: ["Admin", "Permission refusée."] });
    }
}, false);

RegisterCommand('gotogps', async (source) => {
    if (await UserController.isAdmin(source)) {
        console.log('Admin command: gotogps');
        emitNet('admin:teleportToGPS', source);
    } else {
        emitNet('chat:addMessage', source, { args: ["Admin", "Permission refusée."] });
    }
}, false);


RegisterCommand('goToGPSWithVehicle', async (source) => {
    const isAdmin = await UserController.isAdmin(source);
    if (isAdmin) {
        emitNet('orionCore:goToGPSWithVehicle', source);
        emitNet('chat:addMessage', source, { args: ["Admin", "Téléportation au point GPS avec véhicule en cours..."] });
    } else {
        emitNet('chat:addMessage', source, { args: ["Admin", "Permission refusée."] });
    }
}, false);

RegisterCommand('revive', async (source, args) => {
    const isAdmin = await UserController.isAdmin(source);
    if (isAdmin) {
        let targetId = source;
        if (args[0]) {
            targetId = parseInt(args[0], 10);
            if (isNaN(targetId)) {
                emitNet('chat:addMessage', source, { args: ["Admin", "ID du joueur invalide."] });
                return;
            }
        }

        emitNet('admin:revivePlayer', targetId);
        emitNet('chat:addMessage', source, { args: ["Admin", `Le joueur avec l'ID ${targetId} a été réanimé.`] });
    } else {
        emitNet('chat:addMessage', source, { args: ["Admin", "Permission refusée."] });
    }
}, false);
