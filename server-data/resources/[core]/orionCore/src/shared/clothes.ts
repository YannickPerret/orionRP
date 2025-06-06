export enum Component {
    Mask = 1,
    Hair = 2,
    Torso = 3,
    Legs = 4,
    Bag = 5,
    Shoes = 6,
    Accessories = 7,
    Undershirt = 8,
    BodyArmor = 9,
    Decals = 10,
    Tops = 11,
}

export enum Prop {
    Hat = 0,
    Glasses = 1,
    Ear = 2,
    LeftHand = 6,
    RightHand = 7,
    Helmet = 'Helmet',
}

export type OutfitItem = {
    Index?: number;
    Drawable?: number;
    Texture?: number;
    Palette?: number;
    Clear?: boolean;
};

export type GlovesItem = {
    id: number;
    correspondingDrawables: Record<number, number>;
    texture: number;
};

export type Outfit = {
    Components: Partial<Record<Component, OutfitItem>>;
    Props: Partial<Record<Prop, OutfitItem>>;
    GlovesID?: number;
    TopID?: number;
};

export type ClothConfig = {
    AdminOutfit?: Outfit;
    BaseClothSet: Outfit;
    NakedClothSet: Outfit;
    JobClothSet: Outfit | null;
    TemporaryClothSet: Outfit | null;
    Config: {
        Naked: boolean;
        ShowHelmet: boolean;
        HideHead: boolean;
        HideMask: boolean;
        HideGlasses: boolean;
        HideEar: boolean;
        HideChain: boolean;
        HideBulletproof: boolean;
        HideTop: boolean;
        HideLeftHand: boolean;
        HideRightHand: boolean;
        HideBag: boolean;
        HidePants: boolean;
        HideShoes: boolean;
        HideGloves: boolean;
    };
};

// A list of outfit indexed by name
export type Wardrobe = Record<string, Outfit>;

export type WardrobeMenuData = {
    wardrobe: Wardrobe;
    allowNullLabel?: string;
    allowCustom?: string;
};

export const WardRobeElements = {
    [0]: { label: 'Casque', propId: ['Helmet'] },
    [1]: { label: 'Chapeau', propId: [0] },
    [2]: { label: 'Masque', componentId: [1] },
    [3]: { label: 'Haut', componentId: [3, 5, 7, 8, 9, 10, 11] },
    [4]: { label: 'Bas', componentId: [4, 6] },
};

export type WardrobeConfig = Record<number, Wardrobe>;

export const KeepHairWithMask = {
    [0]: true,
    [4]: true,
    [6]: true,
    [11]: true,
    [12]: true,
    [14]: true,
    [15]: true,
    [16]: true,
    [29]: true,
    [30]: true,
    [33]: true,
    [36]: true,
    [38]: true,
    [43]: true,
    [44]: true,
    [45]: true,
    [50]: true,
    [51]: true,
    [73]: true,
    [74]: true,
    [75]: true,
    [90]: true,
    [101]: true,
    [105]: true,
    [107]: true,
    [108]: true,
    [111]: true,
    [116]: true,
    [120]: true,
    [121]: true,
    [124]: true,
    [127]: true,
    [128]: true,
    [133]: true,
    [148]: true,
    [160]: true,
    [161]: true,
    [164]: true,
    [165]: true,
    [166]: true,
    [168]: true,
    [169]: true,
    [175]: true,
    [179]: true,
    [183]: true,
    [186]: true,
    [187]: true,
    [198]: true,
    [199]: true,
    [201]: true,
    [202]: true,
    [204]: true,
    [206]: true,
    [207]: true,
};

export type PlayerCloakroomItem = {
    id: number;
    name: string;
    cloth: Outfit;
};