import { Business } from './types/business.types';
import { businesses as defaultBusinesses } from './data/businesses.ts';
import JSONbig from 'json-bigint';
import {BusinessManager} from "./businessManager.ts";
import {Manager} from "./types/manager.types.ts";
import {calculateCost} from "../utils/calculateCost.ts";
import {GameLoop} from "./gameLoop.ts";
import Decimal from "break_infinity.js";
import {ItemManager} from "./itemManager.ts";
import {defaultItems} from "./data/items.ts";

export class IdleGame {

    private _businessManager: BusinessManager;
    private _itemManager: ItemManager;
    private _gameLoop: GameLoop;
    private _totalPlaytime: number = 0;
    private _sessionStartTime: number = 0;
    private _timeOffline: number = 0;
    private _lastSave: number = 0;
    private _lastBoostTime: number = 0; // Timestamp of the last boost activation
    private readonly _boostCooldown: number = 4 * 60 * 60 * 1000; // 4 hours in ms
    private readonly _boostDuration: number = 1000 * 60 * 30;

    constructor() {
        const savedState = this.loadGameState();
        if (savedState) {
            const now = Date.now();
            this._totalPlaytime = savedState.totalPlaytime || 0;
            this._lastBoostTime = savedState.lastBoostTime || 0;
            this._itemManager = new ItemManager(savedState.items || defaultItems);
            this._businessManager = new BusinessManager(savedState.businesses, new Decimal(savedState.currency || 0),
                new Decimal(savedState.totalEarned || 0), new Decimal(savedState.fans || 0), savedState.unlocks);

            // Calculate offline time and update production
            this._timeOffline = now - savedState.lastSaved;
            this._businessManager.activeMultipliers = savedState.savedMultipliers
                .filter((m:{ multiplier: number; endTime: number } ) => m.endTime > now) // Only include still-active multipliers
                .map((m: { multiplier: number; endTime: number }) => ({
                    multiplier: m.multiplier,
                    endTime: m.endTime,
                }));

            this._businessManager.checkAllUnlocksAndUpgrades();
            this._businessManager.updateProduction(this._timeOffline);
        } else {
            this._itemManager = new ItemManager(defaultItems);
            this._businessManager = new BusinessManager(defaultBusinesses, new Decimal(0), new Decimal(0), new Decimal(0), []);
        }
        this._businessManager.checkAndAwardFans();
        this._sessionStartTime = Date.now(); // Set session start time
        this._gameLoop = new GameLoop(() => {
            this._businessManager.updateProduction();
            this.checkAutoSave();
        });
        this._gameLoop.start();
    }

    // Trigger the time boost
    triggerBoost(): void {
        const now = Date.now();

        // Validate cooldown
        if ((now - this._lastBoostTime) < this._boostCooldown) {
            console.warn("Boost is on cooldown.");
            return;
        }

        // Apply the boost
        this._businessManager.updateProduction(this._boostDuration, true); // Boosted production update
        this._lastBoostTime = now; // Record the time the boost was activated
    }

    // Check if boost is available
    isBoostAvailable(): boolean {
        const now = Date.now();
        return (now - this._lastBoostTime) >= this._boostCooldown; // Cooldown elapsed
    }

    // Get remaining cooldown time
    boostCooldownRemaining(): number {
        const now = Date.now();
        const timePassedSinceLastBoost = now - this._lastBoostTime;
        return Math.max(this._boostCooldown - timePassedSinceLastBoost, 0);
    }

    private checkAutoSave() {
        const now = Date.now();
        if (now - this._lastSave > 3000) { // 3 seconds
            this.saveGameState();
            this._lastSave = now; // Reset last save time
        }
    }

    get timeOffline(): number {
        return this._timeOffline;
    }

    get businessManager(): BusinessManager {
        return this._businessManager;
    }

    get itemManager(): ItemManager {
        return this._itemManager;
    }

    private saveGameState() {
        const currentSessionPlaytime = Date.now() - this._sessionStartTime;
        this._totalPlaytime += currentSessionPlaytime;

        // Reduce businesses to only the needed data for saving
        const simplifiedBusinesses = this._businessManager.businesses.map((business) => ({
            name: business.name,
            quantity: business.quantity,
            endTime: Math.floor(business.endTime),
            startTime: Math.floor(business.startTime),
            isProducing: business.isProducing,
            manager: business.manager
                ? {
                    hired: business.manager.hired,
                    upgrades: business.manager.upgrades.map((upgrade) => ({
                        unlocked: upgrade.unlocked,
                    })),
                }
                : null, // Handle cases where there is no manager
        }));

        const state = {
            currency: this._businessManager.currency.toString(),
            totalEarned: this._businessManager.totalEarned.toString(),
            fans: this._businessManager.fans.toString(),
            savedMultipliers: this._businessManager.activeMultipliers.map((m) => ({
                multiplier: m.multiplier,
                endTime: m.endTime,
            })),
            items: this._itemManager.getOwnedItems().map((item) => ({
                id: item.id,
                quantity: item.quantity,
            })),
            businesses: simplifiedBusinesses, // Save only the simplified form of businesses
            totalPlaytime: this._totalPlaytime, // Add session playtime to total
            lastSaved: Date.now(), // Save the exact time when the game state is saved
            lastBoostTime: this._lastBoostTime, // Add last boost time to the save state
        };

        localStorage.setItem('idleGameState', JSONbig.stringify(state));
        this._sessionStartTime = Date.now();
    }

    // Load game state from localStorage
    private loadGameState() {
        const savedState = localStorage.getItem('idleGameState');
        if (savedState) {
            const state = JSONbig.parse(savedState);
            const savedCurrency = this.convertToDecimal(state.currency || 0);
            const savedTotalEarned = this.convertToDecimal(state.totalEarned || 0);
            const savedFans = this.convertToDecimal(state.fans || 0);
            const savedTotalPlayTime = state.totalPlaytime || 0;
            const savedLastSaved = state.lastSaved || 0;
            const savedMultipliers = state.savedMultipliers || [];
            const savedBusinesses = state.businesses || [];
            const savedLastBoostTime = state.lastBoostTime || 0; // Load saved boost time

            const mergedItems = defaultItems.map((defaultItem) => {
                // Attempt to find a corresponding saved item
                const savedItem = state?.items?.find((item: { id: string; quantity: number }) => item.id === defaultItem.id);

                // Merge default item with saved quantity
                return {
                    ...defaultItem,
                    quantity: savedItem?.quantity ?? defaultItem.quantity,
                };
            });

            const recalculatedBusinesses: Business[] = defaultBusinesses.map((defaultBusiness) => {
                // Find corresponding business in the saved state (if it exists)
                const matchingSavedBusiness = savedBusinesses.find(
                    (b: Business) => b.name === defaultBusiness.name
                );

                const quantity = matchingSavedBusiness?.quantity || 0;

                // Recalculate cost based on `baseCost`, `rate`, and `quantity`
                const recalculatedCost = calculateCost(defaultBusiness.baseCost, defaultBusiness.rate, quantity);

                // Merge default business state with saved state
                return {
                    ...defaultBusiness,
                    endTime: matchingSavedBusiness?.endTime,
                    startTime: matchingSavedBusiness?.startTime,
                    isProducing: matchingSavedBusiness?.isProducing,
                    cost: recalculatedCost,
                    quantity: matchingSavedBusiness?.quantity || 0,
                    manager: matchingSavedBusiness?.manager
                        ? new Manager(
                            matchingSavedBusiness.manager.name || defaultBusiness.manager?.name || "",
                            matchingSavedBusiness.manager.kanji || defaultBusiness.manager?.kanji || "",
                            this.convertToDecimal(matchingSavedBusiness.manager.cost || defaultBusiness.manager?.cost || 0),
                            defaultBusiness.manager?.upgrades.map((defaultUpgrade, index) => ({
                                // Start with the default upgrade
                                ...defaultUpgrade,
                                // Override with saved upgrade data if it exists
                                ...(matchingSavedBusiness.manager.upgrades?.[index] || {})
                            })) || [],
                            matchingSavedBusiness.manager.bio || defaultBusiness.manager?.bio || "",
                            matchingSavedBusiness.manager.color || defaultBusiness.manager?.color || "#333"
                        )
                        : defaultBusiness.manager,
                };

            });

            recalculatedBusinesses.forEach((business) => {
                const matchingSavedBusiness = savedBusinesses.find(
                    (b: Business) => b.name === business.name
                );

                // If the manager is hired in the saved data, ensure it's marked as hired
                if (matchingSavedBusiness?.manager?.hired && business.manager) {
                    business.manager.hired = true;
                }
            });

            return {
                lastBoostTime: savedLastBoostTime,
                currency: savedCurrency,
                totalEarned: savedTotalEarned,
                fans: savedFans,
                lastSaved: savedLastSaved,
                items: mergedItems,
                savedMultipliers: savedMultipliers,
                businesses: recalculatedBusinesses,
                unlocks: [],
                totalPlaytime: savedTotalPlayTime,
            };
        }
        return null;
    }

    private convertToDecimal(value: bigint | string | number): Decimal {
        // Converts BigInt, Decimal strings, or numbers to Decimal
        if (typeof value === "string" || typeof value === "number") {
            return new Decimal(value);
        }
        return new Decimal(value.toString());
    }

    private clearGameState() {
        localStorage.removeItem('idleGameState');
    }

    getTotalPlaytime(): number {
        const currentSessionPlaytime = Date.now() - this._sessionStartTime;
        return this._totalPlaytime + currentSessionPlaytime;
    }

    resetGame() {
        // Clear local storage
        this.clearGameState();

        this._businessManager.reset();
        this._totalPlaytime = 0; // Reset playtime
        this._lastBoostTime = 0; // Clear boost time
    }

    prestige() {
        console.log("fan claim triggered");
        const fansToClaim = this._businessManager.currentFans;

        this._businessManager.reset(false, false);

        this._businessManager.addFans(fansToClaim);
        this._businessManager.checkAllUnlocksAndUpgrades();

    }
}