(async () => {
    const config = JSON.parse(LoadResourceFile(GetCurrentResourceName(), 'target/config.json'))
    let dict = 'shared'
    let texture = 'emptydot_32'


    setTick(async () => {
        let playerPed = PlayerPedId()
        let playerCoords = GetEntityCoords(playerPed)
        // quand j'appuie sur la touche LMenu envoie un raycast via la caméra, s'il touche un object non targetable show le eyes fermé.
        // si l'object est targetable show les yeux ouvert et ouvre le menu avec les options de l'object.
        if (IsControlJustPressed(0, 19)) {
            //drawsprite eyes closed
            //drawtext eyes closed
            DrawSprite('eyes', 'closed', 0.5, 0.5, 0.1, 0.1, 0, 255, 255, 255, 255)

            let entityCheck = exports['orion'].raycastCamera(-1, playerCoords)
            console.log(entityCheck)
            dict = requestStreamedTextureDict("share", texture)
            if (dict) {
                DrawSprite(dict, texture, 0.5, 0.5, 0.1, 0.1, 0, 255, 255, 255, 255)
            }



        }
    })


})();   