export interface Upgrade {
    name: string;
    cost: bigint;
    effect: string;
    applied: boolean;
}

export class Manager {
    name: string; // The manager's name
    kanji: string; // The manager's name
    cost: bigint; // Cost to hire the manager
    hired= false // Whether the manager is currently hired
    upgrades: Upgrade[]
    bio: string;  //Lore

    constructor(name: string, kanji: string, cost: bigint, upgrades: Upgrade[], bio: string) {
        this.name = name;
        this.kanji = kanji;
        this.cost = cost;
        this.upgrades = upgrades;
        this.bio = bio;
    }
}