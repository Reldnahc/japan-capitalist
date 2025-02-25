import { Business } from './types/business.types';
import {GlobalUnlock} from "./types/unlocks.types.ts";
import {calculateCost} from "../utils/calculateCost.ts";
import {SPEED_THRESHOLD} from "./config.ts";

export class BusinessManager {
    businesses: Business[];
    currency: bigint;
    totalEarned: bigint;
    fans: bigint;
    currentFans: bigint = 0n; //current amount claimable
    nextFanThreshold: bigint = 1_000_000_000_000n;//_000_000n;
    fanRate: bigint = 102n;
    unlocks: GlobalUnlock[] = [];
    offlineEarnings: bigint = 0n;
    private lastUpdate: number = Date.now();

    constructor(businesses: Business[], currency: bigint, totalEarned: bigint, fans: bigint, unlocks: GlobalUnlock[]) {
        this.businesses = businesses;
        this.currency = currency;
        this.totalEarned = totalEarned;
        this.fans = fans;
        this.unlocks = unlocks;
    }

    private resetProductionTimer(business: Business) {
        business.startTime = Date.now();
        business.endTime = business.startTime + business.productionTime;
        business.lastProduced = Date.now();
    }

    // Modify startProduction
    startProduction(index: number) {
        const business = this.businesses[index];
        if (business.quantity > 0 && !business.isProducing) {
            business.isProducing = true;
            business.accumulatedTime = 0;
            this.resetProductionTimer(business);
        }
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

         if (business.manager?.hired){
            this.startProduction(index)
        }
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
        if (this.totalEarned < this.nextFanThreshold) return;

        // Calculate how many fans to award at once
        const fansEarned = this.totalEarned / this.nextFanThreshold;
        if (fansEarned > 0n) {
            this.currentFans += fansEarned;
            this.nextFanThreshold *= (this.fanRate / 100n) ** fansEarned;
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

    applyEffect(business: Business, effect: string) {
        console.log(">[BusinessManager] Applying effect: " + effect);
        if (effect.includes("Revenue ×")) {
            const [revenueEffect, target] = effect.split(";");
            const multiplier = parseFloat(revenueEffect.replace("Revenue ×", "").trim());
            if (target && target.trim() === "ALL") {
                // Apply to all businesses
                this.businesses.forEach((b) => {
                    b.revenue *= BigInt(Math.floor(multiplier));
                });
            } else if (target){
                // Apply to specific businesses (comma-separated identifiers)
                const targets = target.split(",").map(t => t.trim());
                this.businesses.forEach((b) => {
                    if (targets.includes(b.name.toLowerCase())) {
                        b.revenue *= BigInt(Math.floor(multiplier));
                    }
                });
            } else {
                business.revenue *= BigInt(Math.floor(multiplier));
            }
        }


        if (effect.includes("Speed +")) {
            const percentage = parseFloat(effect.replace("Speed +", "").replace("%", ""));
            const newProductionTime = Math.floor(business.productionTime / (1 + percentage / 100));

            if (business.isProducing) {
                // Adjust accumulated time proportionally to the change in production speed
                business.accumulatedTime = Math.min(
                    business.accumulatedTime, // Prevent excessive accumulated time
                    business.productionTime
                ) * (newProductionTime / business.productionTime);

                // Update production time
                business.productionTime = newProductionTime;

                // Adjust the lastProduced to account for the new production cycle
                business.lastProduced = Date.now() - business.accumulatedTime;
            } else {
                // Recalculate production time but no changes to accumulated time since it's not producing
                business.productionTime = newProductionTime;
            }
        }
    }

    updateProduction(deltaTime?: number) {
        const now = Date.now();
        const calculatedDelta = deltaTime !== undefined ? deltaTime : now - this.lastUpdate;
        let totalEarnedThisUpdate = 0n;

        this.businesses.forEach((business) => {
            if (!business.isProducing) return;
            if (business.productionTime <= SPEED_THRESHOLD) {
                business.revenuePerSecond = (business.revenue * BigInt(business.quantity) * 1000n) / BigInt(business.productionTime);
            }
            const elapsed = deltaTime !== undefined ? calculatedDelta : now - business.startTime;
            let cycles = Math.floor(elapsed / business.productionTime);
            if (cycles > 0) {
                if (!business.manager?.hired) {
                    business.isProducing = false;
                    cycles = 1;
                }
                totalEarnedThisUpdate += business.revenue * BigInt(business.quantity * cycles);
                const remaining = elapsed % business.productionTime;
                business.startTime = now - remaining;
                business.endTime = business.startTime + business.productionTime;

            }
        });

        this.earnMoney(totalEarnedThisUpdate);

        if (deltaTime === undefined) {
            this.lastUpdate = now;
        } else {
            this.offlineEarnings = totalEarnedThisUpdate;
            console.log("earned this much while gone: " + totalEarnedThisUpdate);
        }
    }

    checkAllUnlocksAndUpgrades(){
        this.checkAllUnlocks();
        this.checkAllUpgrades();
    }

    checkAllUnlocks() {
        this.businesses.forEach((_, index) => {
            this.checkUnlocks(index, );
        });
    }

    // Check and apply unlocks when milestones are reached
    checkUnlocks(index: number) {
        const business = this.businesses[index];

        business.unlocks.forEach((unlock) => {
            if (!unlock.applied && business.quantity >= unlock.milestone) {
                this.applyEffect(business, unlock.effect);
                unlock.applied = true;
                unlock.notified = false;
                this.unlocks.push({ description: `${business.name}: ${unlock.effect}`, applied: true });
            }
        });
    }

    checkAllUpgrades() {
        this.businesses.forEach((_, index) => {
            this.checkUpgrades(index);
        });
    }

    checkUpgrades(index: number) {
        const business = this.businesses[index];

        business.manager?.upgrades.forEach((upgrade) => {
            if (upgrade.unlocked) {
                this.applyEffect(business, upgrade.effect);
                upgrade.unlocked = true;
                this.unlocks.push({ description: `${business.name}: ${upgrade.effect}`, applied: true });
            }
        });
    }

}