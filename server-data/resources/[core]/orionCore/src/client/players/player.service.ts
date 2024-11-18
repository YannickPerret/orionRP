import { Injectable } from '../../core/decorators';
import {Delay} from '../../utils/fivem';

@Injectable()
export class PlayerService {
    private playerSpawned: boolean = false;
    private playerData: any = null;

    setPlayerData(data: any) {
        this.playerData = data;
    }

    getPlayerData() {
        return this.playerData;
    }

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

    getClosestPed(radius: number = 10.0): number | null {
        const playerPed = PlayerPedId();
        const playerCoords = GetEntityCoords(playerPed, true);
        let closestPed = null;
        let closestDistance = radius;

        const [handle, ped] = FindFirstPed();
        let finished = false;

        do {
            if (!IsPedAPlayer(ped) && DoesEntityExist(ped) && !IsEntityDead(ped)) {
                const pedCoords = GetEntityCoords(ped, true);
                const distance = Vdist(playerCoords[0], playerCoords[1], playerCoords[2], pedCoords[0], pedCoords[1], pedCoords[2]);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestPed = ped;
                }
            }
            finished = !FindNextPed(handle);
        } while (!finished);

        EndFindPed(handle);
        return closestPed;
    }

    getClosestPlayer(radius: number = 10.0): { closestPlayer: number | null, closestDistance: number } {
        const players = GetActivePlayers();
        let closestDistance = -1;
        let closestPlayer: number | null = null;
        const playerPed = PlayerPedId();
        const playerCoords = GetEntityCoords(playerPed, true);

        for (const playerId of players) {
            if (playerId !== PlayerId()) {
                const targetPed = GetPlayerPed(playerId);
                const targetCoords = GetEntityCoords(targetPed, true);
                const distance = Vdist(
                    playerCoords[0], playerCoords[1], playerCoords[2],
                    targetCoords[0], targetCoords[1], targetCoords[2]
                );

                if ((closestDistance === -1 || distance < closestDistance) && distance <= radius) {
                    closestPlayer = playerId;
                    closestDistance = distance;
                }
            }
        }
        if (closestDistance === -1 || closestDistance > radius) {
            return { closestPlayer: null, closestDistance: -1 };
        }

        return { closestPlayer, closestDistance };
    }

}

