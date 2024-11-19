import {InventoryItem} from "./item";
import {ClothConfig} from "./clothes";

export type PlayerCharInfo = {
    firstname: string;
    lastname: string;
    account: string;
    gender: number;
    phone: string;
};

export type PlayerJob = {
    onduty: boolean;
    id: number;
    grade: number | string;
};

export type PlayerData = {
    address: string;
    apartment: | {
        id: number;
        property_id: number;
        tier: number;
        price: number;
        owner: string;
    } | null | undefined;
    citizenid: string;
    license: string;
    name: string;
    money: {
        marked_money: number;
        money: number;
    };
    charinfo: PlayerCharInfo;
    role: string;
    job: PlayerJob;
    items: Record<string, InventoryItem> | InventoryItem[];
    skin: Skin;
    cloth_config: ClothConfig;
    source: number;
};

export type Skin = {
    Hair: {
        HairType?: number;
        HairColor?: number;
        HairSecondaryColor?: number;
        BeardType?: number;
        BeardOpacity?: number;
        BeardColor?: number;
        EyebrowType?: number;
        EyebrowOpacity?: number;
        EyebrowColor?: number;
        ChestHairType?: number;
        ChestHairOpacity?: number;
        ChestHairColor?: number;
    };
    Makeup: {
        BeardType?: number;
        BeardColor?: number;
        FullMakeupType?: number;
        FullMakeupOpacity?: number;
        FullMakeupDefaultColor?: boolean;
        FullMakeupPrimaryColor?: number;
        FullMakeupSecondaryColor?: number;
        BlushType?: number;
        BlushOpacity?: number;
        BlushColor?: number;
        LipstickType?: number;
        LipstickOpacity?: number;
        LipstickColor?: number;
    };
    FaceTrait: {
        EyeColor?: number;
    };
    Model: {
        Hash: number;
    };
    Tattoos: {
        Collection: number;
        Overlay: number;
    }[];
};

export const PlayerPedHash = {
    Male: 1885233650,
    Female: -1667301416,
};

export const TenueComponents = {
    [1]: { label: 'Chapeau', propId: 0, value: 'HideHead' },
    [2]: { label: 'Masque', componentId: 1, value: 'HideMask' },
    [3]: { label: 'Lunettes', propId: 1, value: 'HideGlasses' },
    [4]: { label: 'Boucles', propId: 2, value: 'HideEar' },
    [5]: { label: 'Collier', componentId: 7, value: 'HideChain' },
    [6]: { label: 'Gilet', componentId: 9, value: 'HideBulletproof' },
    [7]: { label: 'Haut', componentId: [3, 8, 10, 11], value: 'HideTop' },
    [8]: { label: 'Montre', propId: 6, value: 'HideLeftHand' },
    [9]: { label: 'Bracelet', propId: 7, value: 'HideRightHand' },
    [10]: { label: 'Sac', componentId: 5, value: 'HideBag' },
    [11]: { label: 'Pantalon', componentId: 4, value: 'HidePants' },
    [12]: { label: 'Chaussures', componentId: 6, value: 'HideShoes' },
};

export const isAdmin = (player: PlayerData) => {
    return player.role === 'admin';
};

export const isStaff = (player: PlayerData) => {
    return player.role === 'staff' || isAdmin(player);
};

export const isGameMaster = (player: PlayerData) => {
    return player.role === 'gamemaster' || isStaff(player);
};