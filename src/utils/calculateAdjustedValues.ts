import Decimal from "break_infinity.js";

// Define a dynamic fan bonus rate (for example, 1% per fan)
export const FAN_BONUS_RATE = new Decimal(0.01); // This can be dynamically updated

export function adjustValue(amount: Decimal, fans: Decimal, fanBonusRate: Decimal = FAN_BONUS_RATE): Decimal {
    const fanMultiplier = fans.mul(fanBonusRate).plus(1); // fans * bonus rate + base multiplier (1x)
    return amount.mul(fanMultiplier); // Adjusted value
}