
type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
    {
        [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
    }[Keys];

export type blip = {
    sprite?: number;
    range?: boolean;
    color?: number;
    alpha?: number;
    display?: number;
    playerId?: number;
    showCone?: boolean;
    heading?: number;
    showHeading?: boolean;
    secondaryColor?: number;
    friend?: boolean;
    mission?: boolean;
    friendly?: boolean;
    routeColor?: number;
    scale?: number;
    route?: boolean;
    name: string;
    coords: { x: number; y: number; z?: number };
    position?: string;
    category?: number;
    radius?: number;
};

export type Blip = RequireAtLeastOne<'coords' | 'position'>;