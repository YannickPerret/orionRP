function showCustomNotification(textureDict, textureName, sender, subject, content) {
    if (!HasStreamedTextureDictLoaded(textureDict)) {
        RequestStreamedTextureDict(textureDict, true);
        while (!HasStreamedTextureDictLoaded(textureDict)) {
            Wait(0);
        }
    }

    BeginTextCommandThefeedPost("STRING");
    AddTextComponentSubstringPlayerName(content);

    EndTextCommandThefeedPostMessagetext(
        textureDict,       // textureDict pour l'icône
        textureName,       // Nom de la texture pour l'icône
        false,             // flash (effet visuel, mais ne semble pas actif)
        4,                 // iconType : Choisissez 1 pour boîte de dialogue, 2 pour email, etc.
        sender,            // Titre de la notification
        subject            // Sous-titre de la notification
    );
    EndTextCommandThefeedPostTicker(false, true);
}

onNet('orionCore:showNotification', (textureDict, textureName, sender, subject, content) => {
    showCustomNotification(textureDict, textureName, sender, subject, content);
});
