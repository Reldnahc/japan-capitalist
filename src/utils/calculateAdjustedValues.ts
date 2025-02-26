export const FAN_MULTIPLIER_SCALE = 100n; // Assume scaling in BigInt

export function adjustValue(amount: bigint, fans: bigint): bigint {
    const fanMultiplier = FAN_MULTIPLIER_SCALE + fans;
    return (amount * fanMultiplier) / FAN_MULTIPLIER_SCALE;
}