export type ItemType =
    | 'item'
    | 'weapon'
    | 'weapon_ammo'
    | 'drug'
    | 'food'
    | 'drink'
    | 'cocktail'
    | 'item_illegal'
    | 'organ'
    | 'oil'
    | 'oil_and_item'
    | 'log'
    | 'sawdust'
    | 'plank'
    | 'flavor'
    | 'furniture'
    | 'liquor'
    | 'fish'
    | 'fishing_garbage'
    | 'outfit'
    | 'tool'
    | 'metal';

type BaseItem = {
    name: string;
    label: string;
    pluralLabel?: string;
    weight: number;
    description: string;
    unique: boolean;
    useable: boolean;
    carrybox: string;
};

export type Nutrition = {
    hunger: number;
    thirst: number;
    alcohol: number;
    stamina: number;
    fiber: number;
    lipid: number;
    sugar: number;
    protein: number;
    drug: number;
};

type AnimationItem = {
    name: string;
    dictionary: string;
    flags: number;
};

type PropItem = {
    model: string;
    bone: number;
    coords: { x: number; y: number; z: number };
    rotation?: { x: number; y: number; z: number };
};

export type FoodItem = BaseItem & {
    type: 'food';
    nutrition: Nutrition;
    animation?: AnimationItem;
    prop?: PropItem;
};

export type DrinkItem = BaseItem & {
    type: 'drink';
    nutrition: Nutrition;
    animation?: AnimationItem;
    prop?: PropItem;
};


export type Inventory = {
    id: string;
    label: string;
    type: string;
    slots: number;
    weight: number;
    maxWeight: number;
    owner: number;
    items: InventoryItem[];
    changed: boolean;
    users: number[];
    time: number;
};

export type InventoryItem = {
    name: string;
    label: string;
    description: string;
    weight: number;
    slot: number;
    useable: boolean;
    unique: boolean;
    type: ItemType;
    amount: number;
    metadata?: InventoryItemMetadata;
};

export type Item =
    | WeaponItem
    | AmmoItem
    | DrugItem
    | CommonItem
    | IllegalItem
    | OrganItem
    | OilItem
    | LogItem
    | SawdustItem
    | PlankItem
    | FlavorItem
    | FurnitureItem
    | LiquorItem
    | FoodItem
    | DrinkItem
    | CocktailItem
    | SewingRawMaterialItem
    | FabricItem
    | GarmentItem
    | OutfitItem
    | FishItem
    | FishingGarbageItem
    | ToolItem
    | MetalItem;