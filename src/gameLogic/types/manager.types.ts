import Decimal from "break_infinity.js";

export interface Upgrade {
    name: string;
    cost: Decimal;
    effect: string;
    unlocked: boolean;
}

export class Manager {
    name: string; // The manager's name
    kanji: string; // The manager's name
    cost: Decimal; // Cost to hire the manager
    hired= false // Whether the manager is currently hired
    upgrades: Upgrade[]
    color: string;
    bio: string;  //Lore

    constructor(name: string, kanji: string, cost: Decimal | number, upgrades: Upgrade[], bio: string, color: string = "#333") {
        this.name = name;
        this.kanji = kanji;
        this.cost = new Decimal(cost);
        this.upgrades = upgrades;
        this.color = color;
        this.bio = bio;
    }
}