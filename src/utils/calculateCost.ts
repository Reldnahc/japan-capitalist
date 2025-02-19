export function calculateCost(baseCost: bigint, rate: number, quantity: number): bigint {

    if (quantity === 0) return baseCost; // If quantity is zero, the cost remains the same.

    // Scale rate as a BigInt with a larger precision factor to avoid truncation
    const rateBigInt = BigInt(Math.round(rate * 1e12)); // Use 1e12 for finer precision

    let compoundedRate = BigInt(1e12); // Start with a precision-scaled 1 (BigInt).

    for (let i = 0; i < quantity; i++) {
        compoundedRate = (compoundedRate * rateBigInt) / BigInt(1e12); // Compound using the scaled rate
    }

    // Scale down compoundedRate and multiply by baseCost
    return (baseCost * compoundedRate) / BigInt(1e12);
}