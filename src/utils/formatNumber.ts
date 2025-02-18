// utils/formatNumber.ts

export function formatBigIntWithSuffix(value: bigint): string {
    // List of suffixes for large number ranges
    const suffixes = [
        { value: 10n ** 63n,  suffix: "Vigintillion" },
        { value: 10n ** 60n,  suffix: "Novemdecillion" },
        { value: 10n ** 57n,  suffix: "Octodecillion" },
        { value: 10n ** 54n,  suffix: "Septendecillion" },
        { value: 10n ** 51n,  suffix: "Sexdecillion" },
        { value: 10n ** 48n,  suffix: "Quindecillion" },
        { value: 10n ** 45n,  suffix: "Quattuordecillion" },
        { value: 10n ** 42n,  suffix: "Tredecillion" },
        { value: 10n ** 39n,  suffix: "Duodecillion" },
        { value: 10n ** 36n,  suffix: "Undecillion" },
        { value: 10n ** 33n,  suffix: "Decillion" },
        { value: 10n ** 30n,  suffix: "Nonillion" },
        { value: 10n ** 27n,  suffix: "Octillion" },
        { value: 10n ** 24n,  suffix: "Septillion" },
        { value: 10n ** 21n,  suffix: "Sextillion" },
        { value: 10n ** 18n,  suffix: "Quintillion" },
        { value: 10n ** 15n,  suffix: "Quadrillion" },
        { value: 10n ** 12n,  suffix: "Trillion" },
        { value: 10n ** 9n,   suffix: "Billion" },
        { value: 10n ** 6n,   suffix: "Million" },
        { value: 1n, suffix: "" }
    ];

    // Loop through the suffixes to find the largest threshold
    for (const { value: threshold, suffix } of suffixes) {
        if (value >= threshold) {
            // Format differently depending on whether the value is >= 1 million
            const scaledValue = Number(value) / Number(threshold);
            const formatted = scaledValue.toLocaleString(undefined, {
                minimumFractionDigits: 0, // 3 decimals for 1 million+, 0 decimals otherwise
                maximumFractionDigits: value >= 1_000_000n ? 3 : 0
            });
            return `${formatted} ${suffix}`.trim();
        }
    }

    return value.toString(); // Fallback for small or negative values
}