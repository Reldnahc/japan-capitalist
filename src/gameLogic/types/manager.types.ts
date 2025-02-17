interface Upgrade {
    name: string;
    cost: bigint;
    effect: string;
    applied: boolean;
}

export interface Manager {
    name: string; // The manager's name
    cost: bigint; // Cost to hire the manager
    hired: boolean; // Whether the manager is currently hired
    bio: string;  //Lore
    upgrades: Upgrade[]
}