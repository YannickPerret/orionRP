function drawBlips() {
    // Si les blips ne sont pas chargés
    if (!BlipsLoaded) return;

    Blips.forEach((blip, index) => {
        let shouldContinue = true;

        // Vérification du job si nécessaire
        if (blip.job !== "" && blip.job !== undefined && blip.job !== null) {
            if (blip.job && PlayerData.job.name !== blip.job) {
                shouldContinue = false;
            }
        }

        // Vérification de la catégorie
        if (blip.category) {
            if (blip.category.enabled === 0) {
                shouldContinue = false;
            }
        }

        if (shouldContinue) {
            const blipHandle = AddBlipForCoord(blip.positionX, blip.positionY, blip.positionZ);
            SetBlipSprite(blipHandle, blip.blip_id);
            SetBlipDisplay(blipHandle, blip.display);
            SetBlipScale(blipHandle, blip.scale);
            SetBlipColour(blipHandle, blip.color);
            SetBlipAsShortRange(blipHandle, blip.short_range === '1');
            BeginTextCommandSetBlipName("STRING");
            AddTextComponentSubstringPlayerName(blip.title);
            EndTextCommandSetBlipName(blipHandle);

            // Stocker le handle du blip si nécessaire
            Blips[index].blipHandle = blipHandle;
        }
    });
}

exports('DrawBlips', drawBlips)