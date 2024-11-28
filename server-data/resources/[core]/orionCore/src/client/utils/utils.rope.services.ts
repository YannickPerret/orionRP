import {GameEvent, Inject, Injectable} from '../../core/decorators';
import { LoggerService } from '../../core/modules/logger/logger.service';
import {NotifierService} from "../../server/modules/notifiers/notifier.service";
import {AttachedObjectService} from "./utils.attachObject.services";
import {Delay} from "../../utils/fivem";

interface RopeState {
    rope: number;
    baseEntity: number;
    maxLength: number;
    attachPosition: [number, number, number];
    holdingObjectProp: number;
    lastRopeLength?: number;
}

@Injectable()
export class RopeService {
    @Inject(NotifierService)
    private notifier: NotifierService;

    @Inject(LoggerService)
    private logger: LoggerService;

    @Inject(AttachedObjectService)
    private attachedObjectService: AttachedObjectService;

    private ropeState: RopeState | null = null;

    public async createNewRope(
        attachPosition: [number, number, number],
        baseEntity: number,
        ropeType: number,
        maxLength: number,
        holdingObjectPropName: string,
        ropeData?: string,
        breakable: boolean = false
    ): Promise<number | null> {
        // Validate baseEntity and attachPosition
        if (!DoesEntityExist(baseEntity)) {
            this.logger.error('Base entity does not exist. Cannot create rope.');
            return null;
        }

        if (!attachPosition || attachPosition.length !== 3) {
            this.logger.error('Invalid attach position provided.');
            return null;
        }

        // Check if a rope already exists
        if (this.ropeState) {
            this.notifier.notify(PlayerId(), "Vous ne pouvez pas manipuler plusieurs cordes simultanément.", 'error');
            return null;
        }

        const position = GetEntityCoords(PlayerPedId(), true);
        const initLength = GetDistanceBetweenCoords(
            position[0], position[1], position[2],
            attachPosition[0], attachPosition[1], attachPosition[2],
            true
        );

        try {
            RopeLoadTextures();

            const [rope] = AddRope(
                position[0], position[1], position[2],
                0.0, 0.0, 0.0,
                maxLength, ropeType,
                initLength, 0.5,
                0, false, true, true,
                1.0, false, Number(breakable)
            );

            if (!rope) {
                this.logger.error('Failed to create rope. AddRope returned null.');
                return null;
            }

            if (ropeData) {
                LoadRopeData(rope, ropeData);
            }

            // Attach object to player
            const object = await this.attachedObjectService.attachObjectToPlayer({
                bone: 26610,
                model: holdingObjectPropName,
                position: [0.04, -0.04, 0.02],
                rotation: [305.0, 270.0, -40.0],
            });

            this.ropeState = {
                rope,
                baseEntity,
                maxLength,
                attachPosition,
                holdingObjectProp: object,
            };

            AttachRopeToEntity(
                rope,
                baseEntity,
                attachPosition[0], attachPosition[1], attachPosition[2],
                true
            );

            ActivatePhysics(rope);
            await this.manageRopePhysics();
            this.logger.log('Rope physics loop ended.');
            return rope;
        } catch (error) {
            this.logger.error(`Error during rope creation: ${error}`);
            this.deleteRope();
            return null;
        }
    }

    private async manageRopePhysics() {
        while (this.ropeState) {
            const ped = PlayerPedId();
            const rope = this.ropeState.rope;
            const ropeLength = GetRopeLength(rope);
            const handPosition = GetWorldPositionOfEntityBone(
                ped,
                GetEntityBoneIndexByName(ped, 'BONETAG_L_FINGER2')
            );

            AttachEntitiesToRope(
                rope,
                this.ropeState.baseEntity,
                ped,
                this.ropeState.attachPosition[0], this.ropeState.attachPosition[1], this.ropeState.attachPosition[2],
                handPosition[0], handPosition[1], handPosition[2],
                this.ropeState.maxLength,
                true, true, null, 'BONETAG_L_FINGER2'
            );

            const desiredRopeLength = Math.max(ropeLength + 0.3, 3.0);

            StopRopeWinding(rope);
            StartRopeUnwindingFront(rope);
            RopeForceLength(rope, desiredRopeLength);

            this.ropeState.lastRopeLength = ropeLength;

            await Delay(0);
        }
    }

    public getRopeDistance(): number | null {
        if (!this.ropeState) {
            return null;
        }

        const handPosition = GetWorldPositionOfEntityBone(
            PlayerPedId(),
            GetEntityBoneIndexByName(PlayerPedId(), 'BONETAG_L_FINGER2')
        );

        const [x1, y1, z1] = this.ropeState.attachPosition;
        const [x2, y2, z2] = handPosition;

        return GetDistanceBetweenCoords(x1, y1, z1, x2, y2, z2, true);
    }

    public deleteRope() {
        if (this.ropeState) {
            RopeUnloadTextures();
            DeleteRope(this.ropeState.rope);
            this.attachedObjectService.detachObjectToPlayer(this.ropeState.holdingObjectProp);
            this.ropeState = null;
            this.logger.log('Corde supprimée.');
        }
    }

    @GameEvent('onResourceStop')
    private onResourceStop() {
        this.deleteRope();
    }
}
