import { Injectable } from '../../core/decorators';
import { Delay } from '../../utils/fivem';

@Injectable()
export class PlayerService {
    private playerSpawned: boolean = false;

    async handlePlayerSpawn() {
        if (!this.playerSpawned) {
            ShutdownLoadingScreenNui();
            this.playerSpawned = true;
            console.log('Player spawned and UI shutdown triggered.');
        }

        let tick = setTick(async () => {
            if (NetworkIsSessionStarted()) {
                console.log('Session started, requesting player data.');
                emitNet('orionCore:server:requestPlayerData');
                clearTick(tick);
                return false;
            }
            await Delay(500);
        });
    }

    async setupPlayerConfig(playerId: number) {
        SetPlayerHealthRechargeMultiplier(playerId, 0.0);
        NetworkSetFriendlyFireOption(true);
        SetCanAttackFriendly(PlayerPedId(), true, true);
        console.log('Player configuration set.');
    }

    revivePlayer() {
        const playerPed = PlayerPedId();

        SetEntityHealth(playerPed, 200);
        ClearPedBloodDamage(playerPed);
        ResetPedVisibleDamage(playerPed);

        const [x, y, z] = GetEntityCoords(playerPed);
        SetEntityCoords(playerPed, x, y, z + 1.0, false, false, false, true);
        ClearPedTasksImmediately(playerPed);

        if (IsPedRagdoll(playerPed)) {
            ClearPedTasksImmediately(playerPed);
        }

        EnableControlAction(0, 37, true);
        EnableAllControlActions(0);
        console.log('Player revived.');
    }
}
