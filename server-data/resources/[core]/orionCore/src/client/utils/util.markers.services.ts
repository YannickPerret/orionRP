import { Injectable, Tick, TickInterval } from '../../core/decorators';
import '@citizenfx/client';

@Injectable()
export class UtilsMarkersServices {
    private markers: Array<{
        coords: { x: number, y: number, z: number },
        color?: [number, number, number, number], // RGBA color
        type?: number,
        scale?: number,
        distance?: number
    }> = [];

    public addMarker(coords: { x: number, y: number, z: number }, color: [number, number, number, number] = [255, 0, 0, 255], type: number = 1, scale: number = 1.0, distance: number = 50): void {
        this.markers.push({ coords, color, type, scale, distance });
        console.log(`Marqueur ajouté aux coordonnées: (${coords.x}, ${coords.y}, ${coords.z})`);
    }

    public removeMarker(coords: { x: number, y: number, z: number }): void {
        this.markers = this.markers.filter(marker => marker.coords.x !== coords.x || marker.coords.y !== coords.y || marker.coords.z !== coords.z);
        console.log(`Marqueur supprimé aux coordonnées: (${coords.x}, ${coords.y}, ${coords.z})`);
    }

    @Tick(TickInterval.EVERY_FRAME)
    private displayMarkers(): void {
        const playerPed = PlayerPedId();
        const playerCoords = GetEntityCoords(playerPed, true);

        for (const marker of this.markers) {
            const distance = Vdist(
                playerCoords[0], playerCoords[1], playerCoords[2],
                marker.coords.x, marker.coords.y, marker.coords.z
            );

            if (distance <= (marker.distance || 50)) {
                DrawMarker(
                    marker.type || 1,
                    marker.coords.x, marker.coords.y, marker.coords.z - 1,
                    0, 0, 0, 0, 0, 0,
                    marker.scale || 1.0, marker.scale || 1.0, marker.scale || 1.0,
                    marker.color ? marker.color[0] : 255,
                    marker.color ? marker.color[1] : 0,
                    marker.color ? marker.color[2] : 0,
                    marker.color ? marker.color[3] : 255,
                    false, true, 2, false, null, null, false
                );
            }
        }
    }
}
