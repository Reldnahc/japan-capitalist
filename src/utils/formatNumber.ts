// utils/formatNumber.ts

export function formatBigIntWithSuffix(value: bigint, decimals: number = 3): string {
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
            // Divide the bigint values using integer division
            const wholePart = value / threshold;
            const remainderPart = value % threshold;

            // Format the decimal part manually (if required)
            let decimalPart = "";
            if (decimals > 0 && remainderPart > 0n) {
                const scaledRemainder = (remainderPart * 10n ** BigInt(decimals)) / threshold;
                decimalPart = scaledRemainder.toString().padStart(decimals, "0").replace(/0+$/, "");
                if (decimalPart) {
                    decimalPart = `.${decimalPart}`; // Add the dot back if there are decimals left
                }
            }

            if (value >= 1_000n && value < 1_000_000n) {
                return addCommasToBigInt(value);
            }
            return `${wholePart}${decimalPart} ${suffix}`.trim();
        }
    }


    if (value >= 1_000n && value < 1_000_000n) {
        return addCommasToBigInt(value);
    }


    return value.toString(); // Fallback for small or negative values
}


// Helper function to add commas to a BigInt value
function addCommasToBigInt(value: bigint): string {
    // Convert bigint to string for manipulation
    const valueStr = value.toString();

    // Insert commas as thousands separators
    return valueStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}