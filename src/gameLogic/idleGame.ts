import { Business } from './types/business.types';
import { businesses as defaultBusinesses } from './data/businesses.ts';
import JSONbig from 'json-bigint';
import {BusinessManager} from "./businessManager.ts";
import {SPEED_THRESHOLD} from "./config.ts";
import {Manager, Upgrade} from "./types/manager.types.ts";

export class IdleGame {

    businessManager: BusinessManager;
    saveInterval: number | null = null; // Timer ID for saving periodically
    totalPlaytime: number = 0;
    sessionStartTime: number = 0;

    constructor() {
        const savedState = this.loadGameState();
        if (savedState) {
            console.log(savedState);
            const now = Date.now();
            this.totalPlaytime = savedState.totalPlaytime || 0;
            this.businessManager = new BusinessManager(savedState.businesses, savedState.currency, savedState.unlocks);
            this.businessManager.checkAllUnlocksAndUpgrades();
            // Process offline progression
            this.businessManager.businesses.forEach((business, index) => {
                if (business.quantity > 0 && business.isProducing) {
                    const remainingTime = business.endTime - now;
                    if (remainingTime > 0) {
                        // Resume production using the saved remaining time
                        this.businessManager.resumeProduction(index, remainingTime);
                    } else {
                        // Production should have finished while offline
                        // If a manager is active, calculate how many full cycles were missed
                        if (business.manager?.hired) {
                            if (business.productionTime <= SPEED_THRESHOLD) {
                                const elapsedTime = now - business.startTime;
                                const revenuePerSecond = Number(business.revenue * BigInt(business.quantity)) / (business.productionTime / 1000); // Revenue per second
                                const totalOfflineRevenue = BigInt(Math.floor(revenuePerSecond * (elapsedTime / 1000)));
                                this.businessManager.currency += totalOfflineRevenue; // Add offline revenue
                            } else {
                                // Regular businesses with longer production times
                                const cyclesCompleted = Math.floor((now - business.startTime) / business.productionTime);
                                if (cyclesCompleted > 0) {
                                    this.businessManager.currency += BigInt(cyclesCompleted) * business.revenue * BigInt(business.quantity);
                                }
                            }
                            // Start a new production cycle immediately
                            business.isProducing = false;
                            business.startTime = 0;
                            business.endTime = 0;
                            this.businessManager.startProduction(index);
                        } else {
                            // For manual production, simply mark production as finished
                            this.businessManager.currency += business.revenue * BigInt(business.quantity);
                            business.isProducing = false;
                            business.startTime = 0;
                            business.endTime = 0;
                        }
                    }
                }
            });
        } else {
            this.businessManager = new BusinessManager(defaultBusinesses, BigInt(0), []);
        }
        this.sessionStartTime = Date.now(); // Set session start time
        this.startSaveInterval();
    }

    private startSaveInterval() {
        if (this.saveInterval === null) {
            this.saveInterval = setInterval(() => {
                this.saveGameState();
            }, 5000) as unknown as number; // Save every 3 seconds
        }
    }

    // Clear the save interval (used during reset or cleanup)
    private clearSaveInterval() {
        if (this.saveInterval !== null) {
            clearInterval(this.saveInterval);
            this.saveInterval = null;
        }
    }

    saveGameState() {
        const currentSessionPlaytime = Date.now() - this.sessionStartTime;
        this.totalPlaytime += currentSessionPlaytime;

        // Reduce businesses to only the needed data for saving
        const simplifiedBusinesses = this.businessManager.businesses.map((business) => ({
            name: business.name,
            quantity: business.quantity,
            endTime: business.endTime,
            startTime: business.startTime,
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
            currency: this.businessManager.currency,
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

            const savedCurrency = BigInt(state.currency || 0);
            const savedTotalPlayTime = state.totalPlaytime || 0;

            const savedBusinesses = state.businesses || [];

            const recalculatedBusinesses: Business[] = defaultBusinesses.map((defaultBusiness) => {
                // Find corresponding business in the saved state (if it exists)
                const matchingSavedBusiness = savedBusinesses.find(
                    (b: Business) => b.name === defaultBusiness.name
                );

                const quantity = matchingSavedBusiness?.quantity || 0;

                // Recalculate cost based on `baseCost`, `rate`, and `quantity`
                const recalculatedCost = BigInt(
                    Math.floor(
                        Number(defaultBusiness.baseCost) * Math.pow(defaultBusiness.rate, quantity)
                    )
                );

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
                            BigInt(matchingSavedBusiness.manager.cost || defaultBusiness.manager?.cost || 0),
                            matchingSavedBusiness.manager.upgrades
                                ? matchingSavedBusiness.manager.upgrades.map((savedUpgrade: Upgrade, index: number) => ({
                                    ...defaultBusiness.manager?.upgrades?.[index],
                                    unlocked: savedUpgrade.unlocked || false,
                                }))
                                : defaultBusiness.manager?.upgrades || [],
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
                businesses: recalculatedBusinesses,
                unlocks: [], // Assuming unlocks should always start fresh or be recalculated
                totalPlaytime: savedTotalPlayTime,
            };
        }
        return null;
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

        // Clear all individual business timeouts
        this.businessManager.businessTimeouts.forEach((timeoutId) => {
            clearTimeout(timeoutId);
        });

        // Clear the timeout map
        this.businessManager.businessTimeouts.clear();

        this.clearSaveInterval();

        // Reset all properties to their initial state
        this.businessManager.currency = BigInt(0);
        this.totalPlaytime = 0; // Reset playtime
        this.businessManager.businesses = defaultBusinesses.map((business) => ({
            ...business,
            cost: business.baseCost,
            isProducing: false,
            startTime: 0,
            endTime: 0,
        }));

        this.businessManager.unlocks = [];
    }
}