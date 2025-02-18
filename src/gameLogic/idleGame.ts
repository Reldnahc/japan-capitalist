import { Business } from './types/business.types';
import { businesses as defaultBusinesses } from './data/businesses.ts';
import JSONbig from 'json-bigint';
import {BusinessManager} from "./businessManager.ts";

export const SPEED_THRESHOLD = 100; // in milliseconds

export class IdleGame {

    businessManager: BusinessManager;
    saveInterval: number | null = null; // Timer ID for saving periodically
    totalPlaytime: number = 0;
    sessionStartTime: number = 0;

    constructor() {
        const savedState = this.loadGameState();
        if (savedState) {
            this.totalPlaytime = savedState.totalPlaytime || 0;
            this.businessManager = new BusinessManager(savedState.businesses, savedState.currency, savedState.unlocks);

        } else {
            this.businessManager = new BusinessManager(defaultBusinesses, BigInt(100000), []);
        }
        this.sessionStartTime = Date.now(); // Set session start time
        this.startSaveInterval();
    }

    private startSaveInterval() {
        if (this.saveInterval === null) {
            this.saveInterval = setInterval(() => {
                this.saveGameState();
            }, 3000) as unknown as number; // Save every 3 seconds
        }
    }

    // Clear the save interval (used during reset or cleanup)
    private clearSaveInterval() {
        if (this.saveInterval !== null) {
            clearInterval(this.saveInterval);
            this.saveInterval = null;
        }
    }

    // Save game state to localStorage
    saveGameState() {
        const currentSessionPlaytime = Date.now() - this.sessionStartTime;
        this.totalPlaytime += currentSessionPlaytime;

        const state = {
            currency: this.businessManager.currency,
            businesses: this.businessManager.businesses,
            unlocks: this.businessManager.unlocks,
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
            const now = Date.now();

            state.currency = BigInt(state.currency);

            state.businesses = state.businesses.map((business: Business) => ({
                ...business,
                cost: BigInt(business.cost),
                baseCost: BigInt(business.baseCost),
                revenue: BigInt(business.revenue),
                baseRevenue: BigInt(business.baseRevenue),
                manager: business.manager
                    ? {
                        ...business.manager,
                        cost: BigInt(business.manager.cost), // Convert manager cost to BigInt
                        upgrades: business.manager.upgrades.map((upgrade) => ({
                            ...upgrade,
                            cost: BigInt(upgrade.cost), // Convert upgrades' cost to BigInt
                        })),
                    }
                    : null, // Handle the case where no manager is assigned
            }));

            this.businessManager = new BusinessManager(state.businesses, state.currency, state.unlocks);

            this.totalPlaytime = state.totalPlaytime || 0;

            // Process offline progression
            this.businessManager.businesses.forEach((business, index) => {
                console.log(business);
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
                                state.currency += totalOfflineRevenue; // Add offline revenue
                            } else {
                                // Regular businesses with longer production times
                                const cyclesCompleted = Math.floor((now - business.startTime) / business.productionTime);
                                if (cyclesCompleted > 0) {
                                    state.currency +=
                                        BigInt(cyclesCompleted) * business.revenue * BigInt(business.quantity);
                                }
                            }
                            // Start a new production cycle immediately
                            business.isProducing = false;
                            business.startTime = 0;
                            business.endTime = 0;
                            this.businessManager.startProduction(index);
                        } else {
                            // For manual production, simply mark production as finished
                            state.currency += business.revenue * BigInt(business.quantity);
                            business.isProducing = false;
                            business.startTime = 0;
                            business.endTime = 0;
                        }
                    }
                } else if (business.manager) {
                    this.businessManager.startProduction(index);
                }
            });

            return state;
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