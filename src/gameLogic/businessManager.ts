import { Business } from './types/business.types';
import {GlobalUnlock} from "./types/unlocks.types.ts";
import {calculateCost} from "../utils/calculateCost.ts";
import {SPEED_THRESHOLD} from "./config.ts";
import Decimal from "break_infinity.js";
import {businesses as defaultBusinesses} from "./data/businesses.ts";

export class BusinessManager {

    private _businesses: Business[];
    private _currency: Decimal;
    private _totalEarned: Decimal;
    private _fans: Decimal;
    private _currentFans: Decimal = new Decimal(0); //current amount claimable
    private _nextFanThreshold: Decimal = new Decimal("1000000000000");
    private _fanStep: Decimal = new Decimal("100000000000");
    private _unlocks: GlobalUnlock[] = [];
    private _offlineEarnings: Decimal = new Decimal(0);
    private _boostEarnings: Decimal = new Decimal(0);
    private _lastUpdate: number = Date.now();
    private _activeMultipliers: { multiplier: number; endTime: number }[] = [];
    private _justBoosted: boolean = false;

    constructor(
        businesses: Business[],
        currency: Decimal | string | number,
        totalEarned: Decimal | string | number,
        fans: Decimal | string | number,
        unlocks: GlobalUnlock[]
    )
    {
        this._businesses = businesses;
        this._currency = new Decimal(currency);
        this._totalEarned = new Decimal(totalEarned);
        this._fans = new Decimal(fans);
        this._unlocks = unlocks;
    }

    get currency(): Decimal {
        return this._currency;
    }

    get businesses(): Business[] {
        return this._businesses;
    }

    get totalEarned(): Decimal {
        return this._totalEarned;
    }

    get fans(): Decimal {
        return this._fans;
    }

    get currentFans(): Decimal {
        return this._currentFans;
    }

    get offlineEarnings(): Decimal {
        return this._offlineEarnings;
    }

    get boostEarnings (): Decimal {
        return this._boostEarnings;
    }

    get unlocks(): GlobalUnlock[] {
        return this._unlocks;
    }

    get activeMultipliers():{ multiplier: number; endTime: number }[]  {
        return this._activeMultipliers;
    }

    set activeMultipliers(value:{ multiplier: number; endTime: number }[]) {
        this._activeMultipliers = value;
    }

    set businesses(value: Business[]) {
        this._businesses = value;
    }

    private cleanupMultipliers(): void {
        const now = Date.now();
        this._activeMultipliers = this._activeMultipliers.filter(
            (m) => m.endTime > now // Keep only active multipliers
        );
    }

    getCombinedMultiplier(): number {
        this.cleanupMultipliers(); // Ensure expired multipliers are removed
        // Combine multipliers by multiplying them together
        return this._activeMultipliers.reduce((total, m) => total * m.multiplier, 1);
    }

    startMultiplier(multiplier: number, duration: number): void {
        const now = Date.now();
        this._activeMultipliers.push({
            multiplier,
            endTime: now + duration, // Set the expiration time
        });
    }

    startProduction(index: number) {
        const business = this._businesses[index];
        if (business.quantity > 0 && !business.isProducing) {
            business.isProducing = true;
            business.accumulatedTime = 0;
            this.resetProductionTimer(business);
        }
    }

    addFans(amount: Decimal | string | number){
        this._fans = this._fans.plus(new Decimal(amount));
    }

    buyBusiness(index: number, amount: string = "x1") {
        const business = this._businesses[index];
        let quantityToBuy: number;

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
            if (this._currency.gte(business.cost)) {
                this._currency = this._currency.minus(business.cost);
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
    private getNextMilestoneQuantity(index: number): number {
        const business = this._businesses[index];
        for (const unlock of business.unlocks) {
            if (!unlock.applied && unlock.milestone > business.quantity) {
                return unlock.milestone; // Return the next unlock milestone
            }
        }
        return business.quantity;
    }

    // Calculate max affordable quantity
    private getMaxAffordableQuantity(business: Business): number {
        let quantity = 0;
        let currentCost = business.cost;
        let tempCurrency = this._currency;

        while (tempCurrency.gte(currentCost)) {
            tempCurrency = tempCurrency.minus(currentCost);
            quantity += 1;
            currentCost = calculateCost(business.baseCost, business.rate, business.quantity + quantity);
        }

        return quantity;
    }

    earnMoney(amount: Decimal | string | number, boost = true) {
        const multiplier = boost ? this.getCombinedMultiplier() : new Decimal(1);
        const fanMultiplier = boost ? this._fans.plus(100).div(100) : new Decimal(1);
        const boostedAmount = new Decimal(amount).times(fanMultiplier).times(multiplier);
        // Add the boosted amount to both currency and totalEarned
        //if (boost) console.log(boostedAmount);

        this._currency = this._currency.plus(boostedAmount);
        this._totalEarned = this._totalEarned.plus(boostedAmount);
        this.checkAndAwardFans();
    }

    checkAndAwardFans(): void {
        // If not enough earned to afford even one fan, exit early.
        if (this._totalEarned.lt(this._nextFanThreshold)) return;

        // Let T = current threshold, S = fanStep, and E = totalEarned.
        const T = this._nextFanThreshold;
        const S = this._fanStep;
        const E = this._totalEarned;

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
        this._totalEarned = E.minus(costForKFans);
        this._currentFans = this._currentFans.plus(k);
        this._nextFanThreshold = T.plus(S.times(k));
    }

    // Buy a manager
    buyManager(index: number) {
        const business = this._businesses[index];
        const manager = business.manager;

        if (manager && !manager.hired && this._currency.gte(manager.cost)) {
            this._currency = this._currency.minus(manager.cost);
            manager.hired = true; // Mark the manager as hired
            this.startProduction(index); // Managers automatically start production
        }
    }

    buyManagerUpgrade(businessIndex: number, upgradeIndex: number) {
        const business = this._businesses[businessIndex];
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
        if (this._currency.gte(upgrade.cost) && !upgrade.unlocked) {
            this._currency = this._currency.minus(upgrade.cost);
            upgrade.unlocked = true; // Mark the upgrade as purchased

            // Apply the upgrade effect
            this.applyEffect(business, upgrade.effect);

        } else {
            console.warn("Not enough currency or upgrade already applied.");
        }
    }

    private applyEffect(business: Business, effect: string) {
        console.log(">[BusinessManager] Applying effect: " + effect);
        if (effect.includes("Revenue ×")) {
            const [revenueEffect, target] = effect.split(";");
            const multiplier = parseFloat(revenueEffect.replace("Revenue ×", "").trim());
            if (target && target.trim() === "ALL") {
                // Apply to all businesses
                this._businesses.forEach((b) => {
                    b.revenue = b.revenue.times(multiplier);
                });
            } else if (target){
                // Apply to specific businesses (comma-separated identifiers)
                const targets = target.split(",").map(t => t.trim());
                this._businesses.forEach((b) => {
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

    updateProduction(deltaTime?: number, boosted = false) {

        const now = Date.now();
        const calculatedDelta = deltaTime !== undefined ? deltaTime : now - this._lastUpdate;
        let totalEarnedThisUpdate = new Decimal(0);

        this._businesses.forEach((business) => {
            if (!business.isProducing) return;

            if (business.productionTime <= SPEED_THRESHOLD) {
                business.revenuePerSecond = business.revenue.times(business.quantity).times(1000).div(business.productionTime);
            }

            // Calculate elapsed time for this business
            const elapsed = deltaTime !== undefined ? calculatedDelta : now - business.startTime;
            let cycles = Math.floor(elapsed / business.productionTime);
            const remainingTime = business.endTime - now;
            if (deltaTime){
                console.log(elapsed);
                console.log(cycles);
                console.log(remainingTime);
            }

            if (boosted && remainingTime < elapsed && cycles === 0) {
                cycles = 1;
            }

            if (cycles > 0) {
                if (!business.manager?.hired) {
                    // If manager is not hired, stop after the first cycle
                    business.isProducing = false;
                    cycles = 1;
                }
                // Earn money for completed cycles
                totalEarnedThisUpdate = totalEarnedThisUpdate.plus(
                    business.revenue.times(business.quantity).times(cycles)
                );
                const remaining =
                    boosted
                        ? remainingTime - elapsed  // Remaining time after the remainder
                        : elapsed % business.productionTime;
                if (deltaTime) console.log(remaining);
                // Update start and end times based on remaining time
                if (boosted) {
                    // For a manually triggered cycle, align startTime to the amount of elapsed time already processed
                    business.startTime = now - (business.productionTime - remaining);
                    business.endTime = now + remaining;
                } else {
                    // For regular cases, keep using the calculated remaining
                    business.startTime = now - remaining;
                    business.endTime = business.startTime + business.productionTime;
                }
            } else {
                // If no cycles are completed, adjust remaining time proportionally
                const remaining = business.productionTime - elapsed;
                if(boosted){
                    business.startTime = business.startTime - elapsed;
                }
                // Update only the end time in this case
                business.endTime = now + remaining;
            }
        });

        if (this._justBoosted){
            this._justBoosted = false;
        } else {
            this.earnMoney(totalEarnedThisUpdate);
        }

        if (boosted) {
            this._boostEarnings = totalEarnedThisUpdate; // Track boosted earnings
            this._justBoosted = true;
        } else if (deltaTime) {
            this._offlineEarnings = totalEarnedThisUpdate;
        }

        if (deltaTime === undefined) {
            this._lastUpdate = now;
        }
    }

    checkAllUnlocksAndUpgrades(){
        this.checkAllUnlocks();
        this.checkAllUpgrades();
    }

    private checkAllUnlocks() {
        this._businesses.forEach((_, index) => {
            this.checkUnlocks(index, );
        });
    }

    // Check and apply unlocks when milestones are reached
    private checkUnlocks(index: number) {
        const business = this._businesses[index];

        business.unlocks.forEach((unlock) => {
            if (!unlock.applied && business.quantity >= unlock.milestone) {
                this.applyEffect(business, unlock.effect);
                unlock.applied = true;
                unlock.notified = false;
                this._unlocks.push({ description: `${business.name}: ${unlock.effect}`, applied: true });
            }
        });
    }

    private checkAllUpgrades() {
        this._businesses.forEach((_, index) => {
            this.checkUpgrades(index);
        });
    }

    private checkUpgrades(index: number) {
        const business = this._businesses[index];

        business.manager?.upgrades.forEach((upgrade) => {
            if (upgrade.unlocked) {
                this.applyEffect(business, upgrade.effect);
                upgrade.unlocked = true;
                this._unlocks.push({ description: `${business.name}: ${upgrade.effect}`, applied: true });
            }
        });
    }

    private resetProductionTimer(business: Business) {
        business.startTime = Date.now();
        business.endTime = business.startTime + business.productionTime;
        business.lastProduced = Date.now();
    }

    reset(resetFans = true, resetMultipliers = true) {
        if (resetFans) {
            this._fans = new Decimal(0);
        }
        if (resetMultipliers) {
            this._activeMultipliers = [];
        }
        this._currency = new Decimal(0);

        this._nextFanThreshold = new Decimal(1e12);
        this._totalEarned = new Decimal(0);
        this._currentFans = new Decimal(0);
        this._unlocks = [];

        this._businesses = defaultBusinesses.map((business) => ({
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
    }
}