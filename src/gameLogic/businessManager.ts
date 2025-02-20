import { Business } from './types/business.types';
import {GlobalUnlock} from "./types/unlocks.types.ts";
import {SPEED_THRESHOLD} from "./config.ts";
import {calculateCost} from "../utils/calculateCost.ts";

export class BusinessManager {
    businesses: Business[];
    currency: bigint;
    totalEarned: bigint;
    fans: bigint;
    currentFans: bigint = 0n; //current amount claimable
    nextFanThreshold: bigint = 1_000_000_000_000n;//_000_000n;
    fanRate: bigint = 103n;
    businessTimeouts: Map<number, number> = new Map();
    unlocks: GlobalUnlock[] = [];

    constructor(businesses: Business[], currency: bigint, totalEarned: bigint, fans: bigint, unlocks: GlobalUnlock[]) {
        this.businesses = businesses;
        this.currency = currency;
        this.totalEarned = totalEarned;
        this.fans = fans;
        this.unlocks = unlocks;
    }

    addFans(amount: bigint){
        this.fans += amount;
    }

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
                business.cost = calculateCost(business.baseCost, business.rate, business.quantity);
                this.checkUnlocks(index);
            } else {
                break; // Stop if we can't afford more
            }
        }

        if (business.manager?.hired && business.productionTime <= SPEED_THRESHOLD) {
            this.stopRevenuePolling(index); // Stop old polling
            this.pollRevenue(index); // Start new polling with updated values
        } else if (business.manager?.hired){
            this.startProduction(index)
        }

       // this.saveGameState();
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
            currentCost = calculateCost(business.baseCost, business.rate, business.quantity + quantity);
        }

        return quantity;
    }

    stopRevenuePolling(index: number) {
        const intervalId = this.businessTimeouts.get(index);
        if (intervalId) {
            clearInterval(intervalId);
            this.businessTimeouts.delete(index);
        }
    }

    pollRevenue(index: number) {
        const business = this.businesses[index];
        if (!business.manager?.hired) {
            console.error(`[Polling] Business ${business.name} (Index ${index}): Polling should not be enabled without a manager!`);
            return;
        }

        // Mark the business as producing
        business.isProducing = true;

        // Scaling factor for percentage calculations

        // Correct productionTime scaling and calculate revenue per second
        const scaleFactor = BigInt(1000n); // To maintain scaling precision
        const productionTime = BigInt(Math.floor(business.productionTime)); // For BigInt scaling calculations

        // Apply fan multiplier and scale back
        business.revenuePerSecond = (business.revenue * BigInt(business.quantity) * scaleFactor) / productionTime; // Base revenue

        console.log(
            `[Polling] Business ${business.name} (Index ${index}): Polling started - Revenue per second: ${business.revenuePerSecond}`
        );

        // Start polling if not already active
        if (!this.businessTimeouts.has(index)) {
            const intervalId = setInterval(() => {
                if (business.revenuePerSecond) {
                    this.earnMoney(business.revenuePerSecond); // Add raw revenue to total currency
                    business.startTime = Date.now();
                }
            }, 1000) as unknown as number; // Run every 1 second

            this.businessTimeouts.set(index, intervalId);
            console.log(
                `[Polling] Business ${business.name} (Index ${index}): Interval started with ID ${intervalId}`
            );
        } else {
            console.warn(
                `[Polling] Business ${business.name} (Index ${index}): Polling is already active. Skipping duplicate setup.`
            );
        }
    }

    earnMoney(amount: bigint, boost = true) {
        if (boost) {
            const FAN_MULTIPLIER_SCALE = 100n;

            // Calculate the fan multiplier
            const fanMultiplier = FAN_MULTIPLIER_SCALE + (this.fans * 1n);

            // Adjust the amount using the fan multiplier
            const boostedAmount = (amount * fanMultiplier) / FAN_MULTIPLIER_SCALE;

            // Add the boosted amount to both currency and totalEarned
            this.currency += boostedAmount;
            this.totalEarned += boostedAmount;
        } else {
            this.currency += amount;
            this.totalEarned += amount;
        }
        // Check for fan rewards
        this.checkAndAwardFans();
    }

    checkAndAwardFans(): void {
        while (this.totalEarned >= this.nextFanThreshold) {
            // Award a fan and calculate the next threshold
            this.currentFans += 1n;

            // Apply exponential scaling: growth factor is 1.5x (or 150%)
            this.nextFanThreshold = this.nextFanThreshold * this.fanRate / 100n;
        }
    }


    // Start production for a business
    startProduction(index: number) {
        const business = this.businesses[index];
        if (business.quantity > 0 && !business.isProducing) {
            if (business.productionTime <= SPEED_THRESHOLD && business.manager?.hired) {
                this.stopRevenuePolling(index); // Stop old polling
                this.pollRevenue(index);
            } else {
                business.isProducing = true;
                business.startTime = Date.now();
                business.endTime = Date.now() + business.productionTime;

                const timeoutId = setTimeout(() => {
                    this.earnMoney(business.revenue * BigInt(business.quantity));
                    business.isProducing = false;
                    business.startTime = 0;
                    business.endTime = 0;

                    // Restart production if a manager is active
                    if (business.manager?.hired) {
                        setTimeout(() => {
                            this.startProduction(index);
                        }, 1);
                    }
                    this.businessTimeouts.delete(index);
                }, business.productionTime) as unknown as number;

                this.businessTimeouts.set(index, timeoutId);
            }
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
            //this.saveGameState();
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
        if (this.currency >= upgrade.cost && !upgrade.unlocked) {
            this.currency -= upgrade.cost; // Deduct the cost
            upgrade.unlocked = true; // Mark the upgrade as purchased

            // Apply the upgrade effect
            this.applyEffect(business, upgrade.effect);

        } else {
            console.warn("Not enough currency or upgrade already applied.");
        }
    }

    applyEffect(business: Business, effect: string, updateSpeed = true) {
        if (effect.includes("Revenue ×")) {
            const [revenueEffect, target] = effect.split(";");
            const multiplier = parseFloat(revenueEffect.replace("Revenue ×", "").trim());

            if (target && target.trim() === "ALL") {
                // Apply to all businesses
                this.businesses.forEach((b,index) => {
                    b.revenue *= BigInt(Math.floor(multiplier));
                    if (business.manager?.hired && business.productionTime <= SPEED_THRESHOLD) {
                        this.stopRevenuePolling(index); // Stop old polling
                        this.pollRevenue(index); // Start new polling with updated values
                    }
                });
            } else if (target){
                // Apply to specific businesses (comma-separated identifiers)
                const targets = target.split(",").map(t => t.trim());
                this.businesses.forEach((b) => {
                    if (targets.includes(b.name.toLowerCase())) {
                        b.revenue *= BigInt(Math.floor(multiplier));
                    }
                    const index = this.businesses.findIndex(b => b === business);
                    if (business.manager?.hired && business.productionTime <= SPEED_THRESHOLD) {
                        this.stopRevenuePolling(index); // Stop old polling
                        this.pollRevenue(index); // Start new polling with updated values
                    }
                });
            } else {
                business.revenue *= BigInt(Math.floor(multiplier));
            }

            if (business.manager?.hired && business.productionTime <= SPEED_THRESHOLD) {
                const index = this.businesses.findIndex(b => b === business);
                this.stopRevenuePolling(index); // Stop old polling
                this.pollRevenue(index); // Start new polling with updated values
            }
        }


        if (effect.includes("Speed +")) {
            const percentage = parseFloat(effect.replace("Speed +", "").replace("%", ""));
            const oldProductionTime = business.productionTime; // Store the old production time
            const newProductionTime = Math.floor(oldProductionTime / (1 + percentage / 100));

            // If the business is currently producing, recalculate the current progress
            if (business.isProducing && updateSpeed) {
                console.log(business);
                const now = Date.now();
                const elapsedTime = now - business.startTime; // Time already passed
                const progressFraction = Math.min(elapsedTime / oldProductionTime, 1); // Clamp to [0, 1]

                // Calculate new start and end times based on the recalculated progress and new production time
                const remainingTime = newProductionTime * (1 - progressFraction); // Remaining time adjusted to new speed
                business.productionTime = newProductionTime; // Update the production time
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
                this.resumeProduction(this.businesses.indexOf(business), Math.floor(remainingTime));
            } else {
                // Update production time normally if production is not active
                business.productionTime = newProductionTime;
            }
        }
    }

    resumeProduction(index: number, remainingTime: number) {
        const business = this.businesses[index];
        const now = Date.now();
        // Ensure production state is correctly tracked
        business.isProducing = true;
        business.startTime = now - (business.productionTime - remainingTime); // Simulate start
        business.endTime = now + remainingTime; // Set the remaining time properly


        // Timeout for remainingTime
        const timeoutId = setTimeout(() => {
            this.earnMoney(business.revenue * BigInt(business.quantity));
            business.isProducing = false;
            business.startTime = 0;
            business.endTime = 0;

            if (business.manager?.hired) {
                // For manager-driven production, restart production after a short delay.
                setTimeout(() => {
                    this.startProduction(index);
                }, 1);
            }
            this.businessTimeouts.delete(index);
        }, remainingTime) as unknown as number;

        this.businessTimeouts.set(index, timeoutId);
    }

    checkAllUnlocksAndUpgrades(updateSpeed = true){
        this.checkAllUnlocks(updateSpeed);
        this.checkAllUpgrades(updateSpeed);
    }

    checkAllUnlocks(updateSpeed = true) {
        this.businesses.forEach((_, index) => {
            this.checkUnlocks(index, updateSpeed);
        });
    }

    // Check and apply unlocks when milestones are reached
    checkUnlocks(index: number, updateSpeed = true) {
        const business = this.businesses[index];

        business.unlocks.forEach((unlock) => {
            if (!unlock.applied && business.quantity >= unlock.milestone) {
                this.applyEffect(business, unlock.effect, updateSpeed);
                unlock.applied = true;
                unlock.notified = false;
                this.unlocks.push({ description: `${business.name}: ${unlock.effect}`, applied: true });
            }
        });
    }

    checkAllUpgrades(updateSpeed = true) {
        this.businesses.forEach((_, index) => {
            this.checkUpgrades(index, updateSpeed);
        });
    }

    checkUpgrades(index: number, updateSpeed = true) {
        const business = this.businesses[index];

        business.manager?.upgrades.forEach((upgrade) => {
            if (upgrade.unlocked) {
                this.applyEffect(business, upgrade.effect, updateSpeed);
                upgrade.unlocked = true;
               // this.unlocks.push({ description: `${business.name}: ${upgrade.effect}`, applied: true });
            }
        });
    }


}