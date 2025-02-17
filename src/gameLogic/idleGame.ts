import { Business } from './types/business.types';
import { GlobalUnlock } from './types/unlocks.types';
import { businesses as defaultBusinesses } from './businesses';
import JSONbig from 'json-bigint';


export class IdleGame {
    currency: bigint;
    businesses: Business[];
    unlocks: GlobalUnlock[] = [];
    businessTimeouts: Map<number, number> = new Map();
    saveInterval: number | null = null; // Timer ID for saving periodically

    constructor() {
        const savedState = this.loadGameState();
        if (savedState) {
            this.currency = savedState.currency;
            this.businesses = savedState.businesses;
            this.unlocks = savedState.unlocks;
        } else {
            this.currency = BigInt(0);
            this.businesses = defaultBusinesses;
        }
        this.startSaveInterval();
    }

    private startSaveInterval() {
        if (this.saveInterval === null) {
            this.saveInterval = setInterval(() => {
                this.saveGameState();
            }, 3000); // Save every 3 seconds
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
        const state = {
            currency: this.currency,
            businesses: this.businesses,
            unlocks: this.unlocks,
            lastSaved: Date.now(), // Save the exact time when the game state is saved
        };
        localStorage.setItem('idleGameState', JSONbig.stringify(state));
    }

    // Load game state from localStorage
    loadGameState() {
        const savedState = localStorage.getItem('idleGameState');
        if (savedState) {
            const state = JSONbig.parse(savedState);
            const now = Date.now();

            console.log(state);
            state.currency = BigInt(state.currency);
            this.currency =  state.currency;

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
            console.log(state);

            this.businesses = state.businesses;
            this.unlocks = state.unlocks;

            // Process offline progression
            this.businesses.forEach((business, index) => {
                console.log(business);
                if (business.quantity > 0 && business.isProducing) {
                    const remainingTime = business.endTime - now;
                    if (remainingTime > 0) {
                        // Resume production using the saved remaining time
                        this.resumeProduction(index, remainingTime);
                    } else {
                        // Production should have finished while offline
                        // If a manager is active, calculate how many full cycles were missed
                        if (business.manager) {
                            const cyclesCompleted = Math.floor((now - business.startTime) / business.productionTime);
                            if (cyclesCompleted > 0) {
                                state.currency =
                                    BigInt(state.currency) +
                                    BigInt(cyclesCompleted) * business.revenue * BigInt(business.quantity);
                            }
                            // Start a new production cycle immediately
                            business.isProducing = false;
                            business.startTime = 0;
                            business.endTime = 0;
                            this.startProduction(index);
                        } else {
                            // For manual production, simply mark production as finished
                            state.currency += business.revenue * BigInt(business.quantity);
                            business.isProducing = false;
                            business.startTime = 0;
                            business.endTime = 0;
                        }
                    }
                } else if (business.manager) {
                    this.startProduction(index);
                }
            });

            return state;
        }
        return null;
    }

    resumeProduction(index: number, remainingTime: number) {
        const business = this.businesses[index];
        // Ensure production state is correctly tracked
        business.isProducing = true;
        business.startTime = Date.now() - (business.productionTime - remainingTime); // Simulate start
        business.endTime = Date.now() + remainingTime; // Set the remaining time properly

        // Timeout for remainingTime
        const timeoutId = setTimeout(() => {
            this.currency += business.revenue * BigInt(business.quantity);
            business.isProducing = false;
            business.startTime = 0;
            business.endTime = 0;

            if (business.manager?.hired) {
                // For manager-driven production, restart production after a short delay.
                setTimeout(() => {
                    this.startProduction(index);
                }, 10);
            }
            this.businessTimeouts.delete(index);
        }, remainingTime);

        this.businessTimeouts.set(index, timeoutId);
    }

    // Clear the save (optional reset feature)
    clearGameState() {
        localStorage.removeItem('idleGameState');
    }

    // Buy a business
    buyBusiness(index: number, amount: string = "x1") {
        const business = this.businesses[index];
        let quantityToBuy = 1; // Default to x1

        // Determine the quantity based on the amount
        switch (amount) {
            case "x5":
                quantityToBuy = 5;
                break;
            case "x10":
                quantityToBuy = 10;
                break;
            case "x100":
                quantityToBuy = 100;
                break;
            case "next":
                quantityToBuy = Math.max(1, this.getNextMilestoneQuantity(index) - business.quantity);
                break;
            case "max":
                quantityToBuy = this.getMaxAffordableQuantity(business);
                break;
            default:
                quantityToBuy = 1; // Default to x1
                break;
        }

        // Loop to buy businesses up to the determined quantity
        for (let i = 0; i < quantityToBuy; i++) {
            if (this.currency >= business.cost) {
                this.currency -= business.cost;
                business.quantity += 1;
                business.cost = BigInt(Math.floor(Number(business.baseCost) * Math.pow(business.rate, business.quantity)));
                this.checkUnlocks(index);
            } else {
                break; // Stop if we can't afford more
            }
        }

        this.saveGameState();
    }

    // Calculate next unlock milestone quantity
    getNextMilestoneQuantity(index: number): number {
        const business = this.businesses[index];
        for (const unlock of business.unlocks) {
            if (!unlock.applied && unlock.milestone > business.quantity) {
                return unlock.milestone; // Return the next unlock milestone
            }
        }
        return business.quantity;
    }

    // Calculate max affordable quantity
    getMaxAffordableQuantity(business: Business): number {
        let quantity = 0;
        let currentCost = business.cost;
        let tempCurrency = this.currency;

        while (tempCurrency >= currentCost) {
            tempCurrency -= currentCost;
            quantity += 1;
            currentCost = BigInt(Math.floor(Number(business.baseCost) * Math.pow(business.rate, business.quantity + quantity)));
        }

        return quantity;
    }

    // Start production for a business
    startProduction(index: number) {
        const business = this.businesses[index];
        if (business.quantity > 0 && !business.isProducing) {
            business.isProducing = true;
            business.startTime = Date.now();
            business.endTime = Date.now() + business.productionTime;

            const timeoutId = setTimeout(() => {
                this.currency += business.revenue * BigInt(business.quantity);
                business.isProducing = false;
                business.startTime = 0;
                business.endTime = 0;

                // Restart production if a manager is active
                if (business.manager?.hired) {
                    setTimeout(() => {
                        this.startProduction(index);
                    }, 10);
                }
                this.businessTimeouts.delete(index);
            }, business.productionTime + 100);

            this.businessTimeouts.set(index, timeoutId);
        }
    }


    // Buy a manager
    buyManager(index: number) {
        const business = this.businesses[index];
        const manager = business.manager;

        if (manager && !manager.hired && this.currency >= manager.cost) {
            this.currency -= manager.cost;
            manager.hired = true; // Mark the manager as hired
            this.startProduction(index); // Managers automatically start production
            this.saveGameState();
        }
    }

    buyManagerUpgrade(businessIndex: number, upgradeIndex: number) {
        const business = this.businesses[businessIndex];
        const manager = business.manager;

        if (!manager || !manager.hired) {
            console.warn("Manager not hired yet!");
            return;
        }

        const upgrade = manager.upgrades[upgradeIndex];

        if (!upgrade) {
            console.warn("Upgrade not found!");
            return;
        }

        // Check if player has enough currency and upgrade isn't already applied
        if (this.currency >= upgrade.cost && !upgrade.applied) {
            this.currency -= upgrade.cost; // Deduct the cost
            upgrade.applied = true; // Mark the upgrade as purchased

            // Apply the upgrade effect
            this.applyEffect(business, upgrade.effect);

            // Save the game state
            this.saveGameState();
        } else {
            console.warn("Not enough currency or upgrade already applied.");
        }
    }

    applyEffect(business: Business, effect: string) {
        if (effect.includes("Revenue ×")) {
            const multiplier = parseFloat(effect.replace("Revenue ×", ""));
            business.revenue *= BigInt(Math.floor(multiplier));
        }

        if (effect.includes("Speed +")) {
            const percentage = parseFloat(effect.replace("Speed +", "").replace("%", ""));
            const oldProductionTime = business.productionTime; // Store the old production time
            const newProductionTime = Math.max(
                oldProductionTime * (1 - percentage / 100),
                100 // Minimum production time to avoid values below 100ms
            );

            // If the business is currently producing, recalculate the current progress
            if (business.isProducing) {
                const now = Date.now();
                const elapsedTime = now - business.startTime; // Time already passed
                const progressFraction = elapsedTime / oldProductionTime; // Progress made so far

                // Calculate new start and end times based on the recalculated progress and new production time
                business.productionTime = newProductionTime; // Update the production time
                const remainingTime = newProductionTime * (1 - progressFraction); // Remaining time adjusted to new speed
                business.startTime = now - Math.floor(newProductionTime * progressFraction); // Adjust start time
                business.endTime = now + Math.floor(remainingTime); // Adjust end time

                // Clear the timeout for this specific business
                const businessIndex = this.businesses.indexOf(business);
                const timeoutId = this.businessTimeouts.get(businessIndex);
                if (timeoutId) {
                    clearTimeout(timeoutId); // Clear only this business's timeout
                    this.businessTimeouts.delete(businessIndex); // Remove from the map
                }

                // Restart production with corrected timings
                this.resumeProduction(this.businesses.indexOf(business), remainingTime);
            } else {
                // Update production time normally if production is not active
                business.productionTime = newProductionTime;
            }
        }
    }

    // Check and apply unlocks when milestones are reached
    checkUnlocks(index: number) {
        const business = this.businesses[index];

        // Apply premade unlocks
        business.unlocks.forEach((unlock) => {
            if (!unlock.applied && business.quantity >= unlock.milestone) {
                this.applyEffect(business, unlock.effect);
                unlock.applied = true;
                unlock.notified = false;
                this.unlocks.push({ description: `${business.name}: ${unlock.effect}`, applied: true });
            }
        });

       /* // Generate dynamic unlocks every 100 businesses
        const nextMilestone = Math.ceil(business.quantity / 100) * 100;
        if (business.quantity >= nextMilestone) {
            const effect = `Revenue ×${2 + nextMilestone / 100}`;
            this.applyUnlockEffect(business, effect);
            this.unlocks.push({ description: `${business.name}: ${effect}`, applied: true });
        }*/
    }

    resetGame() {
        // Clear local storage
        this.clearGameState();

        // Clear all individual business timeouts
        this.businessTimeouts.forEach((timeoutId) => {
            clearTimeout(timeoutId);
        });

        // Clear the timeout map
        this.businessTimeouts.clear();

        this.clearSaveInterval();

        // Reset all properties to their initial state
        this.currency = BigInt(0);

        this.businesses = defaultBusinesses.map((business) => ({
            ...business,
            cost: business.baseCost,
            isProducing: false,
            startTime: 0,
            endTime: 0,
        }));

        this.unlocks = [];
    }
}
