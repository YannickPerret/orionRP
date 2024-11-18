import {Injectable, Tick} from '../core/decorators';
import {config} from "./config/config";

@Injectable()
export class WorldClientService {

    @Tick()
    initialize() {
        const playerId = PlayerId();
        SetPoliceIgnorePlayer(playerId, true);
        SetDispatchCopsForPlayer(playerId, false);
        SetMaxWantedLevel(0);
        ClearPlayerWantedLevel(playerId);
        DisableIdleCamera(true);
        SetCanAttackFriendly(PlayerPedId(), true, false);
        SetPedDropsWeaponsWhenDead(PlayerPedId(), false);
        HideHudComponentThisFrame(3);
        HideHudComponentThisFrame(4);
        HideHudComponentThisFrame(13);
        HideHudComponentThisFrame(14);
        SetPlayerHealthRechargeMultiplier(PlayerId(), config.character.healthRegen);
        NetworkSetFriendlyFireOption(true);

        const gangGroups = [
            "AMBIENT_GANG_HILLBILLY", "AMBIENT_GANG_BALLAS", "AMBIENT_GANG_MEXICAN",
            "AMBIENT_GANG_FAMILY", "AMBIENT_GANG_MARABUNTE", "AMBIENT_GANG_SALVA",
            "AMBIENT_GANG_LOST", "GANG_1", "GANG_2", "GANG_9", "GANG_10", "FIREMAN", "MEDIC", "COP"
        ];

        gangGroups.forEach(gang => {
            SetRelationshipBetweenGroups(1, GetHashKey(gang), GetHashKey("PLAYER"));
        });
    }
}