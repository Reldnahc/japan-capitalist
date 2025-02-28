import {ItemManager} from "./itemManager.ts";

export interface Reward {
    type: string; // The type of reward, e.g., 'currency', 'timeWarp', 'item'
    amount: number; // The value or quantity of the reward
    description: string; // A description for display
}

export class DailyRewardManager {
    private _lastRewardTime: number = 0; // Timestamp of the last claimed reward
    private _currentRewardIndex: number = 0; // Index of the next reward (cycles up to 7 days)
    private _itemManager: ItemManager; // Reference to the ItemManager

    constructor(savedLastRewardTime: number, savedRewardIndex: number, itemManager: ItemManager) {
        this._lastRewardTime = savedLastRewardTime || 0;
        this._currentRewardIndex = savedRewardIndex || 0;
        this._itemManager = itemManager; // Inject ItemManager to manage rewards
    }

    /**
     * Defines the 7-day reward cycle.
     */
    public getWeeklyRewardCycle(): Reward[] {
        return [
            { type: 'item', amount: 1, description: '1-hour warp' },
            { type: 'item', amount: 1, description: '1-hour warp' },
            { type: 'item', amount: 1, description: '1-hour warp' },
            { type: 'item', amount: 1, description: '1-hour warp' },
            { type: 'item', amount: 1, description: '6-hour warp' },
            { type: 'item', amount: 1, description: '1-hour warp' },
            { type: 'item', amount: 1, description: '1-day warp' },
        ];
    }
    /**
     * Gets the reward for the current day in the cycle.
     */
    private getTodayReward(): Reward {
        const rewards = this.getWeeklyRewardCycle();
        return rewards[this._currentRewardIndex]; // Return reward at the current index
    }

    /**
     * Checks if a new daily reward is available based on the client's local midnight.
     */
    isDailyRewardAvailable(): boolean {
        const now = new Date();
        const lastRewardDate = new Date(this._lastRewardTime);

        // Check if the current day is different from the last reward day
        return now.getDate() !== lastRewardDate.getDate() ||
            now.getMonth() !== lastRewardDate.getMonth() ||
            now.getFullYear() !== lastRewardDate.getFullYear();
    }


    /**
     * Claims the daily reward, grants the reward, and updates the lastRewardTime.
     * @returns {boolean} True if the reward was successfully claimed; false otherwise.
     */
    claimDailyReward(onRewardGranted?: (reward: Reward) => void): boolean {
        if (this.isDailyRewardAvailable()) {
            const reward = this.getTodayReward();

            // Grant today's reward
            // Outer switch based on reward type
            switch (reward.type) {
                case 'item': // Handle item rewards
                    switch (reward.description) {
                        case '1-hour warp':
                            this._itemManager.addItem('one_hour_warp', reward.amount);
                            break;
                        case '6-hour warp':
                            this._itemManager.addItem('six_hour_warp', reward.amount);
                            break;
                        case '1-day warp':
                            this._itemManager.addItem('one_day_warp', reward.amount);
                            break;
                        default:
                            console.warn(`Unknown item description: ${reward.description}`);
                    }
                    break;

                case 'gold': // Placeholder for handling currency rewards
                    // Add currency-related logic here
                    break;

                default: // Handle unknown reward types
                    console.warn(`Unknown reward type: ${reward.type}`);
            }


            // Increment the reward index, resetting after the 7th reward
            this._currentRewardIndex = (this._currentRewardIndex + 1) % 7;

            // Update the last reward time
            this._lastRewardTime = Date.now();

            // Trigger callback for the granted reward
            if (onRewardGranted) {
                onRewardGranted(reward);
            }

            return true; // Successfully claimed
        }

        return false; // Reward already claimed for today
    }


    /**
     * Returns the last reward time for saving purposes.
     */
    public getLastRewardTime(): number {
        return this._lastRewardTime;
    }

    /**
     * Gets the current reward index.
     */
    public getCurrentRewardIndex(): number {
        return this._currentRewardIndex;
    }

}