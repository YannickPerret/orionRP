import { Injectable, Tick } from '../../core/decorators';
import '@citizenfx/client';
import { Vector3 } from '../../shared/types';

@Injectable()
export class NoClipServices {
    private isNoClipping = false;
    private noClippingEntity = 0;
    private speed = 0.5;
    private input: Vector3 = [0, 0, 0];

    toggleNoClipMode(): void {
        this.isNoClipping = !this.isNoClipping;
        const playerPed = PlayerPedId();
        this.noClippingEntity = playerPed;

        if (this.isNoClipping) {
            SetEntityAlpha(this.noClippingEntity, 51, false);
            SetEntityCollision(this.noClippingEntity, false, false);
            console.log('NoClip activé');
        } else {
            ResetEntityAlpha(this.noClippingEntity);
            SetEntityCollision(this.noClippingEntity, true, true);
            console.log('NoClip désactivé');
        }
    }

    @Tick()
    private handleNoClip(): void {
        if (this.isNoClipping) {
            const playerPed = PlayerPedId();
            FreezeEntityPosition(this.noClippingEntity, true);
            SetEntityVisible(this.noClippingEntity, false, false);
            SetLocalPlayerVisibleLocally(true);
            this.input = [
                GetControlNormal(0, 30), // Move left/right
                GetControlNormal(0, 31), // Move forward/back
                IsControlPressed(0, 22) ? 1 : IsControlPressed(0, 44) ? -1 : 0 // Move up/down
            ];
            const forwardVec = GetEntityForwardVector(this.noClippingEntity);
            const [fx, fy, fz] = forwardVec;
            const newX = fx * this.speed * this.input[1];
            const newY = fy * this.speed * this.input[1];
            const newZ = fz * this.speed * this.input[2];
            SetEntityCoordsNoOffset(playerPed, newX, newY, newZ, true, true, true);
        }
    }
}
