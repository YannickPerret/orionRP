import { GameEvent, Injectable } from "../../core/decorators";

export type AttachedObject = {
    model: string;
    bone: number;
    position: [number, number, number];
    rotation: [number, number, number];
    rotationOrder?: number;
};

@Injectable()
export class AttachedObjectService {
    private objects: Map<number, AttachedObject> = new Map();

    public async attachObjectToPlayer(attached: AttachedObject): Promise<number> {
        const position = GetEntityCoords(PlayerPedId());

        const object = CreateObject(
            GetHashKey(attached.model),
            position[0],
            position[1],
            position[2] - 1.0,
            true,
            true,
            true
        );
        SetEntityAsMissionEntity(object, true, true);
        const netId = ObjToNet(object);
        SetNetworkIdCanMigrate(netId, false);
        SetEntityCollision(object, false, true);

        AttachEntityToEntity(
            object,
            PlayerPedId(),
            GetPedBoneIndex(PlayerPedId(), attached.bone),
            attached.position[0],
            attached.position[1],
            attached.position[2],
            attached.rotation[0],
            attached.rotation[1],
            attached.rotation[2],
            true,
            true,
            false,
            true,
            attached.rotationOrder || 0,
            true
        );

        this.objects.set(object, attached);

        return object;
    }

    public detachObjectToPlayer(entity: number) {
        if (!this.objects.has(entity)) {
            return;
        }

        SetEntityAsMissionEntity(entity, true, true);
        DetachEntity(entity, false, false);
        DeleteEntity(entity);
        this.objects.delete(entity);
    }

    public detachAll() {
        if (!this.objects || this.objects.size === 0) {
            console.log("[AttachedObjectService] Aucun objet attaché à détacher.");
            return;
        }

        for (const entity of this.objects.keys()) {
            this.detachObjectToPlayer(entity);
        }

        console.log(`[AttachedObjectService] Tous les objets attachés ont été supprimés.`);
        this.objects.clear();
    }

    @GameEvent("onResourceStop")
    public handleResourceStop(resourceName: string) {
        if (GetCurrentResourceName() === resourceName) {
            console.log(`[AttachedObjectService] Suppression de tous les objets attachés.`);
            this.detachAll();
        }
    }
}
