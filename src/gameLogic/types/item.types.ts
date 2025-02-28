import {BusinessManager} from "../businessManager.ts";

export type Item = {
    id: string; // Unique identifier for the item
    name: string; // Display name of the item
    description: string; // A description of the item's effect
    effect: (businessManager: BusinessManager) => void; // Function to apply the item's effect
    quantity: number; // Number of items owned
};