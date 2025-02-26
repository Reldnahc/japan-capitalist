import Decimal from "break_infinity.js";

export function calculateCost(baseCost: Decimal | string | number, rate: number, quantity: number): Decimal {

    if (quantity === 0) return new Decimal(baseCost); // If quantity is zero, the cost remains the same.

    const rateDecimal = new Decimal(rate);

    const compoundedRate = rateDecimal.pow(quantity);

    return new Decimal(baseCost).times(compoundedRate);
}