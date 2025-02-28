import { BusinessManager } from '../businessManager';
import {Item} from "../types/item.types.ts";
import {ONE_DAY, ONE_HOUR} from "../config.ts";

// Example items with effects
export const defaultItems: Item[] = [
    {
        id: 'one_hour_warp',
        name: 'One Hour Warp',
        description: 'Warps forwards 1 hour.',
        quantity: 0,
        effect: (businessManager: BusinessManager) => {
            businessManager.updateProduction(ONE_HOUR, true); // Double revenue for 1 minute
        },
    },
    {
        id: 'six_hour_warp',
        name: 'Six Hour Warp',
        description: 'Warps forwards 6 hours.',
        quantity: 0,
        effect: (businessManager: BusinessManager) => {
            businessManager.updateProduction(ONE_HOUR * 6, true); // Double revenue for 1 minute
        },
    },
    {
        id: 'one_day_warp',
        name: 'One Day Warp',
        description: 'Warps forwards 1 day.',
        quantity: 0,
        effect: (businessManager: BusinessManager) => {
            businessManager.updateProduction(ONE_DAY, true); // Double revenue for 1 minute
        },
    }
];