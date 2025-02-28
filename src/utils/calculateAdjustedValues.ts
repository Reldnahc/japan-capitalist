import Decimal from "break_infinity.js";

// Define a dynamic fan bonus rate (for example, 1% per fan)

export function adjustValue(amount: Decimal, fans: Decimal, fanBonusRate: Decimal, multiplier: Decimal): Decimal {
    const fanMultiplier = fans.times(fanBonusRate).plus(1); // fans * bonus rate + base multiplier (1x)
    return amount.times(fanMultiplier).times(multiplier); // Adjusted value
}