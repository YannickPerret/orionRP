import {Injectable, ClientEvent, KeyMapping, Inject} from '../../core/decorators';
import {UtilsServices} from "./utils.services";
import {NoClipServices} from "./utils.noclip.services";
import {UtilsBlipsServices} from "./utils.blips.services";

@Injectable()
export class UtilsController {
    @Inject(UtilsServices)
    private utilsServices: UtilsServices;

    @Inject(NoClipServices)
    private noClipServices: NoClipServices;

    @Inject(UtilsBlipsServices)
    private utilsBlipsServices: UtilsBlipsServices;

    @ClientEvent('draw3DText')
    handleDraw3DText(x: number, y: number, z: number, text: string): void {
        this.utilsServices.draw3DText(x, y, z, text);
    }

    @ClientEvent('drawMarker')
    handleDrawMarker(x: number, y: number, z: number, type: number): void {
        this.utilsServices.drawMarker(x, y, z, type);
    }

    @ClientEvent('drawHudText')
    handleDrawHudText(
        text: string,
        x: number,
        y: number,
        font: number = 4,
        scale: number = 0.5,
        color: [number, number, number, number] = [255, 255, 255, 255],
        centered: boolean = false
    ): void {
        this.utilsServices.drawHudText(text, x, y, font, scale, color, centered);
    }

    @KeyMapping('handleToggleNoClip', 'Toggle Admin NoClip', 'keyboard', 'F9')
    handleToggleNoClip(): void {
        this.noClipServices.toggleNoClipMode();
    }
}
