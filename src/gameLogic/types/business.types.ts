import {Manager} from "./manager.types.ts";

export interface Unlock {
    milestone: number;          // The amount at which the milestone unlocks
    effect: string;             // The effect of the unlock (e.g., "Revenue ×2")
    applied: boolean;           // Whether the unlock has already been applied
    notified?: boolean;         // If the notification has been triggered
}

// Core business structure
export interface Business {
    name: string;               // Name of the business
    cost: bigint;               // Current cost to buy one unit
    baseCost: bigint;           // Starting cost that increases with quantity
    revenue: bigint;            // Current revenue per production cycle
    baseRevenue: bigint;        // Base revenue before effects
    quantity: number;           // Number of businesses owned
    rate: number;               // Increase in price each purchase
    productionTime: number;     // Time it takes to produce in ms
    baseProductionTime: number; // Base production time before effects
    isProducing: boolean;       // Whether the business is producing or idle
    startTime: number;          // When production started
    endTime: number;            // When production ends
    unlocks: Unlock[];          // List of unlocks for the business
    manager: Manager | null;    // Manager data
}