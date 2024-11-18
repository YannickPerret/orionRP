import {
    ClientEvent,
    Command,
    GameEvent,
    Inject,
    Injectable,
} from '../../core/decorators';
import { PlayerModelService } from './player.model.service';
import {PlayerService} from "./player.service";
import {Delay} from "../../utils/fivem";
import {MenuServices} from "../menu/menu.services";


@Injectable()
export class PlayerController {
    @Inject(PlayerService)
    private playerService!: PlayerService;

    @Inject(PlayerModelService)
    private playerModelService!: PlayerModelService;

    @Inject(MenuServices)
    private menuServices!: MenuServices;

    private playerSpawned = false;

    initialize() {
        console.log('PlayerController initialized');
    }

    @Command({ name: 'teleportToGPS', description: 'Téléporte le joueur au GPS', role: null })
    async teleportToGPS() {
        const playerPed = PlayerPedId();
        const waypointBlip = GetFirstBlipInfoId(8);
        if (DoesBlipExist(waypointBlip)) {
            const [x, y, z] = GetBlipCoords(waypointBlip);
            const [foundGround, groundZ] = GetGroundZFor_3dCoord(x, y, z, false);

            if (foundGround) {
                SetEntityCoords(playerPed, x, y, groundZ + 1.0, false, false, false, true);
            } else {
                emit('chat:addMessage', { args: ['Admin', 'Impossible de déterminer la hauteur du sol.'] });
            }
        } else {
            emit('chat:addMessage', { args: ['Admin', 'Aucun point GPS trouvé.'] });
        }
    }

    @Command({ name: 'revivePlayer', description: 'Réanime le joueur', role: null })
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

        console.log('Vous avez été réanimé par un administrateur.');
    }

    @Command({name: 'save', description: "Sauvegarde les données du joueur", role: null})
    savePlayer() {
        const playerPed = PlayerPedId()
        const [x, y, z] = GetEntityCoords(playerPed)
        const heading = GetEntityHeading(playerPed)

        emitNet('orionCore:server:character:save', {x, y, z}, heading)
    }

    @ClientEvent('loadCharacter')
    async loadCharacter(characterData: any) {
        const playerPed = PlayerPedId();
        this.playerService.setPlayerData(characterData);

        SetEntityCoords(playerPed, characterData.position.x, characterData.position.y, characterData.position.z, false, false, false, true);

        await this.playerModelService.applyCharacterModel(characterData.model);
        this.playerModelService.applyCharacterAppearance(characterData.appearance);
        this.playerModelService.applyCharacterClothes(characterData.clothes);

        console.log('Données de personnage appliquées côté client après spawn');
    }

    @ClientEvent('applyCharacterClothes')
    applyCharacterClothes(clothes: any) {
        this.playerModelService.applyCharacterClothes(clothes);
    }

    @ClientEvent('applyCharacterAppearance')
    applyCharacterAppearance(appearance: any) {
        this.playerModelService.applyCharacterAppearance(appearance);
    }

    @ClientEvent('applyCharacterModel')
    async applyCharacterModel(model: string) {
        await this.playerModelService.applyCharacterModel(model);
    }

    @ClientEvent('teleportToPosition')
    teleportToPosition(x: number, y: number, z: number) {
        const playerPed = PlayerPedId();
        SetEntityCoords(playerPed, x, y, z, false, false, false, true);
    }

    @ClientEvent('revivePlayer')
    revivePlayerEvent() {
        this.revivePlayer();
    }

    @GameEvent('playerSpawned')
    async onPlayerSpawned() {
        if (!this.playerSpawned) {
            ShutdownLoadingScreenNui()
            this.playerSpawned = true
        }

        let tick = setTick(async () => {
            if (NetworkIsSessionStarted()) {
                console.log('Session started')
                emitNet('orionCore:server:character:login');
                clearTick(tick);
                return;
            }
            await Delay(5000)
        });
    }
}