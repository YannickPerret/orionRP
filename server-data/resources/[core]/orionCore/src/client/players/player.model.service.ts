import { Injectable } from "../../core/decorators";
import { Delay } from "../../utils/fivem";

@Injectable()
export class PlayerModelService {

    async applyCharacterModel(model: string) {
        const modelHash = GetHashKey(model);
        RequestModel(modelHash);
        while (!HasModelLoaded(modelHash)) {
            await Delay(40);
        }

        if (IsModelInCdimage(modelHash) && IsModelValid(modelHash)) {
            SetPlayerModel(PlayerId(), modelHash);
            const playerPed = PlayerPedId();
            SetPedComponentVariation(playerPed, 0, 0, 0, 2);
            SetPedComponentVariation(playerPed, 2, 11, 4, 2);
            SetPedComponentVariation(playerPed, 4, 1, 5, 2);
            SetPedComponentVariation(playerPed, 6, 1, 0, 2);
            SetPedComponentVariation(playerPed, 11, 7, 2, 2);
        }
        SetModelAsNoLongerNeeded(modelHash);
    }

    applyCharacterAppearance(appearance: any) {
        const playerPed = PlayerPedId();

        if (appearance) {
            if (appearance.hairStyle !== undefined) {
                SetPedComponentVariation(playerPed, 2, parseInt(appearance.hairStyle), 0, 0);
                console.log("change hair");
            }
            if (appearance.hairPrimaryColor !== undefined && appearance.hairSecondaryColor !== undefined) {
                SetPedHairTint(playerPed, parseInt(appearance.hairPrimaryColor), parseInt(appearance.hairSecondaryColor));
                console.log("change hair color");
            }

            // Beard
            if (appearance.beardStyle !== undefined) {
                SetPedHeadOverlay(playerPed, 1, parseInt(appearance.beardStyle), 1.0);
            }
            if (appearance.beardColor !== undefined) {
                SetPedHeadOverlayColor(playerPed, 1, 1, parseInt(appearance.beardColor), parseInt(appearance.beardColor));
            }

            // Eyebrows
            if (appearance.eyebrowStyle !== undefined) {
                SetPedHeadOverlay(playerPed, 2, parseInt(appearance.eyebrowStyle), 1.0);
            }
            if (appearance.eyebrowColor !== undefined) {
                SetPedHeadOverlayColor(playerPed, 2, 1, parseInt(appearance.eyebrowColor), parseInt(appearance.eyebrowColor));
            }

            // Makeup
            if (appearance.makeupStyle !== undefined) {
                SetPedHeadOverlay(playerPed, 4, parseInt(appearance.makeupStyle), 1.0);
            }
            if (appearance.makeupColor !== undefined) {
                SetPedHeadOverlayColor(playerPed, 4, 2, parseInt(appearance.makeupColor), parseInt(appearance.makeupColor));
            }

            // Skin problems
            if (appearance.skinProblem !== undefined) {
                SetPedHeadOverlay(playerPed, 9, parseInt(appearance.skinProblem), parseFloat(appearance.opacity || 1.0));
            }

            if (appearance.blemishes !== undefined) {
                SetPedHeadOverlay(playerPed, 0, parseInt(appearance.blemishes), 1.0);
            }
            if (appearance.sunDamage !== undefined) {
                SetPedHeadOverlay(playerPed, 7, parseInt(appearance.sunDamage), 1.0);
            }
            if (appearance.freckles !== undefined) {
                SetPedHeadOverlay(playerPed, 9, parseInt(appearance.freckles), 1.0);
            }
            if (appearance.moles !== undefined) {
                SetPedHeadOverlay(playerPed, 12, parseInt(appearance.moles), 1.0);
            }

            // Chest Hair
            if (appearance.chestHair !== undefined) {
                SetPedHeadOverlay(playerPed, 10, parseInt(appearance.chestHair), 1.0);
            }
            if (appearance.chestHairColor !== undefined) {
                SetPedHeadOverlayColor(playerPed, 10, 1, parseInt(appearance.chestHairColor), parseInt(appearance.chestHairColor));
            }

            // Blush
            if (appearance.blush !== undefined) {
                SetPedHeadOverlay(playerPed, 5, parseInt(appearance.blush), 1.0);
            }
            if (appearance.blushColor !== undefined) {
                SetPedHeadOverlayColor(playerPed, 5, 2, parseInt(appearance.blushColor), parseInt(appearance.blushColor));
            }

            // Nose features
            if (appearance.noseWidth !== undefined) SetPedFaceFeature(playerPed, 0, (parseFloat(appearance.noseWidth) - 5) / 10);
            if (appearance.noseHeight !== undefined) SetPedFaceFeature(playerPed, 1, (parseFloat(appearance.noseHeight) - 5) / 10);
            if (appearance.noseLength !== undefined) SetPedFaceFeature(playerPed, 2, (parseFloat(appearance.noseLength) - 5) / 10);
            if (appearance.noseLowering !== undefined) SetPedFaceFeature(playerPed, 3, (parseFloat(appearance.noseLowering) - 5) / 10);
            if (appearance.nosePeakLowering !== undefined) SetPedFaceFeature(playerPed, 4, (parseFloat(appearance.nosePeakLowering) - 5) / 10);
            if (appearance.noseTwist !== undefined) SetPedFaceFeature(playerPed, 5, (parseFloat(appearance.noseTwist) - 5) / 10);

            // Eyebrow features
            if (appearance.eyebrowHeight !== undefined) SetPedFaceFeature(playerPed, 6, (parseFloat(appearance.eyebrowHeight) - 5) / 10);
            if (appearance.eyebrowDepth !== undefined) SetPedFaceFeature(playerPed, 7, (parseFloat(appearance.eyebrowDepth) - 5) / 10);
        }
    }

    applyCharacterClothes(clothes: any) {
        const playerPed = PlayerPedId();

        if (clothes) {
            SetPedComponentVariation(playerPed, 8, parseInt(clothes.tshirtStyle || 0), parseInt(clothes.tshirtColor || 0), 0);
            SetPedComponentVariation(playerPed, 11, parseInt(clothes.torsoStyle || 0), parseInt(clothes.torsoColor || 0), 0);
            SetPedComponentVariation(playerPed, 4, parseInt(clothes.legsStyle || 0), parseInt(clothes.pantsColor || 0), 0);
            SetPedComponentVariation(playerPed, 6, parseInt(clothes.shoesStyle || 0), parseInt(clothes.shoesColor || 0), 0);
            SetPedComponentVariation(playerPed, 3, parseInt(clothes.armsStyle || 0), parseInt(clothes.armsColor || 0), 0);
            SetPedPropIndex(playerPed, 1, parseInt(clothes.glassesStyle || -1), 0, true);
        }
    }
}
