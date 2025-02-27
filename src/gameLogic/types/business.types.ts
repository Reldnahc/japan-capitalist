import Decimal from 'break_infinity.js';
import {Manager} from "./manager.types.ts";

export interface Unlock {
    milestone: number;          // The amount at which the milestone unlocks
    effect: string;             // The effect of the unlock (e.g., "Revenue ×2")
    applied: boolean;           // Whether the unlock has already been applied
    notified?: boolean;         // If the notification has been triggered
}

// Core business structure
export class Business {
    name: string;               // Name of the business
    cost: Decimal;               // Current cost to buy one unit
    baseCost: Decimal;           // Starting cost that increases with quantity
    revenue: Decimal;            // Current revenue per production cycle
    baseRevenue: Decimal;        // Base revenue before effects
    quantity: number;           // Number of businesses owned
    rate: number;               // Increase in price each purchase
    productionTime: number;     // Time it takes to produce in ms
    baseProductionTime: number; // Base production time before effects
    isProducing = false;       // Whether the business is producing or idle
    startTime = 0;          // When production started
    endTime = 0;            // When production ends
    unlocks: Unlock[];          // List of unlocks for the business
    manager: Manager | null;    // Manager data
    revenuePerSecond?: Decimal;  // for polling
    lastProduced: number; // Timestamp of last production
    accumulatedTime: number; // Milliseconds accumulated since last production

    constructor(
        name: string,
        cost: Decimal | number,
        revenue: Decimal | number,
        rate: number,
        productionTime: number,
        unlocks: Unlock[],
        quantity: number, // Added as a required parameter
        manager: Manager
    ) {
        this.name = name;
        this.cost = new Decimal(cost);
        this.baseCost = new Decimal(cost);
        this.revenue = new Decimal(revenue);
        this.baseRevenue = new Decimal(revenue);
        this.quantity = quantity;
        this.rate = rate;
        this.productionTime = productionTime;
        this.baseProductionTime = productionTime;
        this.unlocks = unlocks;
        this.lastProduced = 0
        this.accumulatedTime = 0;

        this.manager = new Manager(
            manager.name,
            manager.kanji,
            new Decimal(manager.cost),
            manager.upgrades,
            manager.bio,
            manager.color
        );
    }
}