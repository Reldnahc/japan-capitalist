import { Business } from './types/business.types';
import { businesses as defaultBusinesses } from './data/businesses.ts';
import JSONbig from 'json-bigint';
import {BusinessManager} from "./businessManager.ts";
import {Manager} from "./types/manager.types.ts";
import {calculateCost} from "../utils/calculateCost.ts";
import {GameLoop} from "./gameLoop.ts";
import Decimal from "break_infinity.js";

export class IdleGame {

    businessManager: BusinessManager;
    totalPlaytime: number = 0;
    sessionStartTime: number = 0;
    timeOffline: number = 0;
    private gameLoop: GameLoop;
    private lastSave: number = 0;

    constructor() {
        const savedState = this.loadGameState();
        if (savedState) {
            const now = Date.now();
            this.totalPlaytime = savedState.totalPlaytime || 0;
            this.businessManager = new BusinessManager(savedState.businesses, new Decimal(savedState.currency || 0),
                new Decimal(savedState.totalEarned || 0), new Decimal(savedState.fans || 0), savedState.unlocks);

            // Calculate offline time and update production
            this.timeOffline = now - savedState.lastSaved;
            this.businessManager.checkAllUnlocksAndUpgrades();
            this.businessManager.updateProduction(this.timeOffline);
        } else {
            this.businessManager = new BusinessManager(defaultBusinesses, new Decimal(0), new Decimal(0), new Decimal(0), []);
        }
        this.businessManager.checkAndAwardFans();
        this.sessionStartTime = Date.now(); // Set session start time
        this.gameLoop = new GameLoop(() => {
            this.businessManager.updateProduction();
            this.checkAutoSave();
        });
        this.gameLoop.start();
    }

    private checkAutoSave() {
        const now = Date.now();
        if (now - this.lastSave > 3000) { // 3 seconds
            this.saveGameState();
            this.lastSave = now;
        }
    }

    saveGameState() {
        const currentSessionPlaytime = Date.now() - this.sessionStartTime;
        this.totalPlaytime += currentSessionPlaytime;

        // Reduce businesses to only the needed data for saving
        const simplifiedBusinesses = this.businessManager.businesses.map((business) => ({
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
            currency: this.businessManager.currency.toString(),
            totalEarned: this.businessManager.totalEarned.toString(),
            fans: this.businessManager.fans.toString(),
            businesses: simplifiedBusinesses, // Save only the simplified form of businesses
            totalPlaytime: this.totalPlaytime, // Add session playtime to total
            lastSaved: Date.now(), // Save the exact time when the game state is saved
        };

        localStorage.setItem('idleGameState', JSONbig.stringify(state));
        this.sessionStartTime = Date.now();
    }

    // Load game state from localStorage
    loadGameState() {
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
                unlocks: [], // Assuming unlocks should always start fresh or be recalculated
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


    // Clear the save (optional reset feature)
    clearGameState() {
        localStorage.removeItem('idleGameState');
    }

    getTotalPlaytime(): number {
        const currentSessionPlaytime = Date.now() - this.sessionStartTime;
        return this.totalPlaytime + currentSessionPlaytime;
    }

    resetGame() {
        // Clear local storage
        this.clearGameState();



        this.businessManager.businesses = defaultBusinesses.map((business) => ({
            ...business,
            cost: business.baseCost,
            isProducing: false,
            startTime: 0,
            endTime: 0,
            unlocks: business.unlocks.map((unlock) => ({
                ...unlock,
                applied: false, // Reset applied status
                notified: false, // Reset notification status
            })),
        }));

        this.businessManager.unlocks = [];
        this.businessManager.checkAllUnlocksAndUpgrades();
        this.businessManager.currency = new Decimal(0);
        this.businessManager.totalEarned = new Decimal(0);
        this.businessManager.fans = new Decimal(0); // Reset playtime
        this.businessManager.nextFanThreshold = new Decimal(1_000_000_000_000);
        this.businessManager.currentFans = new Decimal(0);
        this.totalPlaytime = 0; // Reset playtime
    }

    prestige() {
        console.log("fan claim triggered");
        const fansToClaim = this.businessManager.currentFans;


        this.businessManager.currency = new Decimal(0);
        this.businessManager.totalEarned = new Decimal(0);
        this.businessManager.businesses = defaultBusinesses.map((business) => ({
            ...business,
            cost: business.baseCost,
            isProducing: false,
            startTime: 0,
            endTime: 0,
            unlocks: business.unlocks.map((unlock) => ({
                ...unlock,
                applied: false, // Reset applied status
                notified: false, // Reset notification status
            })),
        }));

        this.businessManager.unlocks = [];
        this.businessManager.fans = this.businessManager.fans.plus(fansToClaim);
        this.businessManager.nextFanThreshold = new Decimal(1_000_000_000_000);
        this.businessManager.currentFans = new Decimal(0);
        this.businessManager.checkAllUnlocksAndUpgrades();

    }
}