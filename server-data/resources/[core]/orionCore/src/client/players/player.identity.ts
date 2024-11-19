import {Inject, Injectable, OnNuiEvent} from "../../core/decorators";
import {PlayerData} from "../../shared/player"
import {PlayerService} from "./player.service";

@Injectable
export class PlayerIdentityProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    private mugshotCache: Map<string, string> = new Map();

    @OnNuiEvent('player:identity:getMugshot')
    public async getMugshot({ player }: { player: PlayerData }): Promise<string> {
        const currentPlayer = this.playerService.getPlayer();
        const playerId = GetPlayerFromServerId(player.source);
        const ped = GetPlayerPed(currentPlayer.source === player.source ? -1 : playerId);

        if (!ped) {
            return null;
        }

        if (this.mugshotCache.has(player.citizenid)) {
            return this.mugshotCache.get(player.citizenid);
        }

        this.mugshotCache.set(player.citizenid, null);

        const mugshot = RegisterPedheadshot_3(ped);

        while (!IsPedheadshotReady(mugshot) || !IsPedheadshotValid(mugshot)) {
            await wait(100);
        }

        const mugshotTxd = GetPedheadshotTxdString(mugshot);

        this.mugshotCache.set(player.citizenid, mugshotTxd);

        return mugshotTxd;
    }
}