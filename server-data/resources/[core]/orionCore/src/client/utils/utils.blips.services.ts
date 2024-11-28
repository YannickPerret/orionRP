import { Injectable } from '../../core/decorators';
import { Blip } from '../../shared/blip';
import '@citizenfx/client';

@Injectable()
export class UtilsBlipsServices {
    private blips: Map<string, number> = new Map();

    public loadBlip(blipData: Blip): void {
        const blipId = AddBlipForCoord(blipData.coords.x, blipData.coords.y, blipData.coords.z || 0);

        if (blipData.sprite !== undefined) {
            SetBlipSprite(blipId, blipData.sprite);
        }
        if (blipData.color !== undefined) {
            SetBlipColour(blipId, blipData.color);
        }
        if (blipData.scale !== undefined) {
            SetBlipScale(blipId, blipData.scale);
        }
        if (blipData.name) {
            BeginTextCommandSetBlipName('STRING');
            AddTextComponentString(blipData.name);
            EndTextCommandSetBlipName(blipId);
        }
        if (blipData.alpha !== undefined) {
            SetBlipAlpha(blipId, blipData.alpha);
        }
        if (blipData.route) {
            SetBlipRoute(blipId, true);
            if (blipData.routeColor !== undefined) {
                SetBlipRouteColour(blipId, blipData.routeColor);
            }
        }
        if (blipData.range) {
            SetBlipAsShortRange(blipId, true);
        }

        this.blips.set(blipData.name, blipId);
        console.log(`Blip '${blipData.name}' ajouté.`);
    }

    public removeBlip(blipName: string): void {
        const blipId = this.blips.get(blipName);
        if (blipId !== undefined) {
            RemoveBlip(blipId);
            this.blips.delete(blipName);
            console.log(`Blip '${blipName}' supprimé.`);
        } else {
            console.warn(`Blip '${blipName}' introuvable pour la suppression.`);
        }
    }

    public clearAllBlips(): void {
        this.blips.forEach((blipId, blipName) => {
            RemoveBlip(blipId);
            console.log(`Blip '${blipName}' supprimé.`);
        });
        this.blips.clear();
        console.log('Tous les blips ont été supprimés.');
    }
}
