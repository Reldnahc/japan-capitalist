import { Item } from './types/item.types';
import { BusinessManager } from './businessManager';

export class ItemManager {
    private _items: Item[]; // List of all available items

    constructor(items: Item[]) {
        this._items = items; // Initialize the item list (populated later)
    }

    // Get the current list of owned items
    getOwnedItems(): Item[] {
        return this._items.filter((item) => item.quantity > 0); // Only items with quantity > 0
    }

    // Add items to the player's inventory
    addItem(itemId: string, quantity: number) {
        const item = this._items.find((i) => i.id === itemId);
        if (!item) throw new Error(`[ItemManager] Item "${itemId}" not found!`);

        item.quantity += quantity; // Increase the quantity of the item
        console.log(`[ItemManager] Added ${quantity} "${item.name}" to inventory.`);
    }

    // Use an item and apply its effect
    useItem(itemId: string, businessManager: BusinessManager, onEffectActivated?: () => void): boolean {
        const item = this._items.find((i) => i.id === itemId);
        if (!item) throw new Error(`[ItemManager] Item "${itemId}" not found!`);
        if (item.quantity <= 0) {
            console.warn(`[ItemManager] Item "${item.name}" is out of stock!`);
            return false; // Cannot use items with zero quantity
        }

        item.effect(businessManager); // Apply the item's effect to the BusinessManager
        item.quantity -= 1; // Decrease the quantity

        if (onEffectActivated) {
            onEffectActivated(); // Call the callback function
        }

        console.log(`[ItemManager] Used 1 "${item.name}". Remaining: ${item.quantity}.`);
        return true;
    }
}
