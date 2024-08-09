(async () => {
    let players = [];
    const PlayerManager = require('./core/server/playerManager.js');

    const banPlayer = async (source, reason) => {
        //insérer le joueur dans la table ban via licences, discord, steam et ip
        // kick le joueur (drop)
    }

    onNet('orion:admin:s:spectate', async (target) => {
        const source = global.source;
        if (IsPlayerAceAllowed(source, 'admin')) {
            const targetPed = GetPlayerPed(target.id);
            const targetCoords = GetEntityCoords(targetPed);
            emitNet('orion:admin:c:spectate', source, target.id, targetCoords);
        }
        else {
            banPlayer(source, 'tentative de spectate sans permission')
        }
    })

    /*CreateThread(function()
    while true do
        local tempPlayers = {}
        for _, v in pairs(QBCore.Functions.GetPlayers()) do
            local targetped = GetPlayerPed(v)
            local ped = QBCore.Functions.GetPlayer(v)
            tempPlayers[#tempPlayers + 1] = {
                name = (ped.PlayerData.charinfo.firstname or '') .. ' ' .. (ped.PlayerData.charinfo.lastname or '') .. ' | (' .. (GetPlayerName(v) or '') .. ')',
                id = v,
                coords = GetEntityCoords(targetped),
                cid = ped.PlayerData.charinfo.firstname .. ' ' .. ped.PlayerData.charinfo.lastname,
                citizenid = ped.PlayerData.citizenid,
                sources = GetPlayerPed(ped.PlayerData.source),
                sourceplayer = ped.PlayerData.source

            }
        end
        -- Sort players list by source ID (1,2,3,4,5, etc) --
        table.sort(tempPlayers, function(a, b)
            return a.id < b.id
        end)
        players = tempPlayers
        Wait(1500)
    end
end)*/

    /*setTick(() => {
        let tempPlayers = [];
        for (let i = 0; i < GetActivePlayers(); i++) {
            let targetPed = GetPlayerPed(i);
            let ped = PlayerManager.getPlayerBySource(i);
            tempPlayers.push({
                name: ped.name,
                id: i,
                coords: GetEntityCoords(targetPed),
                citizenid: ped.citizenid,
                sources: GetPlayerPed(ped.source),
                sourceplayer: ped.source
            });
        }

    })*/
})()