import { Business } from './types/business.types';
import {GlobalUnlock} from "./types/unlocks.types.ts";
import {calculateCost} from "../utils/calculateCost.ts";
import {SPEED_THRESHOLD} from "./config.ts";
import Decimal from "break_infinity.js";

export class BusinessManager {
    businesses: Business[];
    currency: Decimal;
    totalEarned: Decimal;
    fans: Decimal;
    currentFans: Decimal = new Decimal(0); //current amount claimable
    nextFanThreshold: Decimal = new Decimal("1000000000000");
    fanStep: Decimal = new Decimal("100000000000");
    unlocks: GlobalUnlock[] = [];
    offlineEarnings: Decimal = new Decimal(0);
    private lastUpdate: number = Date.now();

    constructor(
        businesses: Business[],
        currency: Decimal | string | number,
        totalEarned: Decimal | string | number,
        fans: Decimal | string | number,
        unlocks: GlobalUnlock[]
    )
    {
        this.businesses = businesses;
        this.currency = new Decimal(currency);
        this.totalEarned = new Decimal(totalEarned);
        this.fans = new Decimal(fans);
        this.unlocks = unlocks;
    }

    private resetProductionTimer(business: Business) {
        business.startTime = Date.now();
        business.endTime = business.startTime + business.productionTime;
        business.lastProduced = Date.now();
    }

    startProduction(index: number) {
        const business = this.businesses[index];
        if (business.quantity > 0 && !business.isProducing) {
            business.isProducing = true;
            business.accumulatedTime = 0;
            this.resetProductionTimer(business);
        }
    }

    addFans(amount: Decimal | string | number){
        this.fans = this.fans.plus(new Decimal(amount));
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
            if (this.currency.gte(business.cost)) {
                this.currency = this.currency.minus(business.cost);
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

        while (tempCurrency.gte(currentCost)) {
            tempCurrency = tempCurrency.minus(currentCost);
            quantity += 1;
            currentCost = calculateCost(business.baseCost, business.rate, business.quantity + quantity);
        }

        return quantity;
    }

    earnMoney(amount: Decimal | string | number, boost = true) {
        // Calculate the fan multiplier
        const multiplier = boost ? this.fans.plus(100).div(100) : new Decimal(1);
        const boostedAmount = new Decimal(amount).times(multiplier);
        // Add the boosted amount to both currency and totalEarned
        this.currency = this.currency.plus(boostedAmount);
        this.totalEarned = this.totalEarned.plus(boostedAmount);
        this.checkAndAwardFans();
    }

    checkAndAwardFans(): void {
        // If not enough earned to afford even one fan, exit early.
        if (this.totalEarned.lt(this.nextFanThreshold)) return;

        // Let T = current threshold, S = fanStep, and E = totalEarned.
        const T = this.nextFanThreshold;
        const S = this.fanStep;
        const E = this.totalEarned;

        // Calculate discriminant: (2T - S)^2 + 8SE
        const twoTMinusS = T.times(2).minus(S);
        const discriminant = twoTMinusS.pow(2).plus(S.times(8).times(E));

        // Compute the square root of the discriminant.
        // (Assuming your big number library has a sqrt() method)
        const sqrtDisc = discriminant.sqrt();

        // Solve for k: k = floor(( - (2T - S) + sqrtDisc ) / (2S))
        const k = sqrtDisc.minus(twoTMinusS).div(S.times(2)).floor();

        // If k is zero (edge-case), nothing to do.
        if (k.lte(0)) return;

        // Calculate the total cost for k fans: cost = k*T + S * k*(k-1)/2
        const costForKFans = T.times(k)
            .plus(S.times(k.times(k.minus(1))).div(2));

        // Deduct the cost and update state.
        this.totalEarned = E.minus(costForKFans);
        this.currentFans = this.currentFans.plus(k);
        this.nextFanThreshold = T.plus(S.times(k));
    }




    // Buy a manager
    buyManager(index: number) {
        const business = this.businesses[index];
        const manager = business.manager;

        if (manager && !manager.hired && this.currency.gte(manager.cost)) {
            this.currency = this.currency.minus(manager.cost);
            manager.hired = true; // Mark the manager as hired
            this.startProduction(index); // Managers automatically start production
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
        if (this.currency.gte(upgrade.cost) && !upgrade.unlocked) {
            this.currency = this.currency.minus(upgrade.cost);
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
                    b.revenue = b.revenue.times(multiplier);
                });
            } else if (target){
                // Apply to specific businesses (comma-separated identifiers)
                const targets = target.split(",").map(t => t.trim());
                this.businesses.forEach((b) => {
                    if (targets.includes(b.name.toLowerCase())) {
                        b.revenue = b.revenue.times(multiplier);
                    }
                });
            } else {
                business.revenue = business.revenue.times(multiplier);
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
        let totalEarnedThisUpdate = new Decimal(0);

        this.businesses.forEach((business) => {
            if (!business.isProducing) return;
            if (business.productionTime <= SPEED_THRESHOLD) {
                business.revenuePerSecond = business.revenue.times(business.quantity).times(1000).div(business.productionTime);
            }
            const elapsed = deltaTime !== undefined ? calculatedDelta : now - business.startTime;
            let cycles = Math.floor(elapsed / business.productionTime);
            if (cycles > 0) {
                if (!business.manager?.hired) {
                    business.isProducing = false;
                    cycles = 1;
                }
                totalEarnedThisUpdate = totalEarnedThisUpdate.plus(business.revenue.times(business.quantity).times(cycles));
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