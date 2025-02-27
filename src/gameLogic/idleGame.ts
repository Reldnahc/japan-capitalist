import { Business } from './types/business.types';
import { businesses as defaultBusinesses } from './data/businesses.ts';
import JSONbig from 'json-bigint';
import {BusinessManager} from "./businessManager.ts";
import {Manager} from "./types/manager.types.ts";
import {calculateCost} from "../utils/calculateCost.ts";
import {GameLoop} from "./gameLoop.ts";
import Decimal from "break_infinity.js";

export class IdleGame {

    private _businessManager: BusinessManager;
    private _gameLoop: GameLoop;
    private _totalPlaytime: number = 0;
    private _sessionStartTime: number = 0;
    private _timeOffline: number = 0;
    private _lastSave: number = 0;

    constructor() {
        const savedState = this.loadGameState();
        if (savedState) {
            const now = Date.now();
            this._totalPlaytime = savedState.totalPlaytime || 0;
            this._businessManager = new BusinessManager(savedState.businesses, new Decimal(savedState.currency || 0),
                new Decimal(savedState.totalEarned || 0), new Decimal(savedState.fans || 0), savedState.unlocks);

            // Calculate offline time and update production
            this._timeOffline = now - savedState.lastSaved;
            this._businessManager.checkAllUnlocksAndUpgrades();
            this._businessManager.updateProduction(this._timeOffline);
        } else {
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

    private checkAutoSave() {
        const now = Date.now();
        if (now - this._lastSave > 3000) { // 3 seconds
            this.saveGameState();
            this._lastSave = now;
        }
    }

    get timeOffline(): number {
        return this._timeOffline;
    }

    get businessManager(): BusinessManager {
        return this._businessManager;
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
            businesses: simplifiedBusinesses, // Save only the simplified form of businesses
            totalPlaytime: this._totalPlaytime, // Add session playtime to total
            lastSaved: Date.now(), // Save the exact time when the game state is saved
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

            const savedBusinesses = state.businesses || [];

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
                currency: savedCurrency,
                totalEarned: savedTotalEarned,
                fans: savedFans,
                lastSaved: savedLastSaved,
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
    }

    prestige() {
        console.log("fan claim triggered");
        const fansToClaim = this._businessManager.currentFans;

        this._businessManager.reset();

        this._businessManager.addFans(fansToClaim);
        this._businessManager.checkAllUnlocksAndUpgrades();

    }
}