import { Injectable } from '../../core/decorators';
import '@citizenfx/client';

@Injectable()
export class UtilsServices {
    public draw3DText(x: number, y: number, z: number, text: string): void {
        let [onScreen, _x, _y] = World3dToScreen2d(x, y, z);

        if (onScreen) {
            SetTextScale(0.4, 0.4);
            SetTextFont(4);
            SetTextProportional(true);
            SetTextEntry('STRING');
            SetTextCentre(true);
            SetTextColour(255, 255, 255, 255);
            SetTextOutline();
            AddTextComponentString(text);
            DrawText(_x, _y);
        }
    }

    public drawHudText(text: string, x: number, y: number, font: number = 4, scale: number = 0.5, color: [number, number, number, number] = [255, 255, 255, 255], centered: boolean = false): void {
        SetTextFont(font);
        SetTextScale(0.0, scale);
        SetTextProportional(true);
        SetTextColour(color[0], color[1], color[2], color[3]);
        if (centered) {
            SetTextCentre(true);
        }
        SetTextEntry('STRING');
        AddTextComponentString(text);
        DrawText(x, y);
    }
}
