import Decimal from "break_infinity.js";

const baseSuffixes = [
    "Million",
    "Billion",
    "Trillion",
    "Quadrillion",
    "Quintillion",
    "Sextillion",
    "Septillion",
    "Octillion",
    "Nonillion",
    "Decillion",
    "Undecillion",
    "Duodecillion",
    "Tredecillion",
    "Quattuordecillion",
    "Quindecillion",
    "Sexdecillion",
    "Septendecillion",
    "Octodecillion",
    "Novemdecillion",
    "Vigintillion",
];

const numeralPrefixes = [
    "",
    "Un", // 1
    "Duo", // 2
    "Tres", // 3
    "Quattuor", // 4
    "Quin", // 5
    "Sex", // 6
    "Septen", // 7
    "Octo", // 8
    "Novem", // 9
];

// Cached thresholds and suffixes
const thresholds: { value: number; suffix: string }[] = [];

// Generate the thresholds and suffixes once
const precomputeSuffixes = () => {
    for (let i = 0; i < 100; i++) {
        const power = (i + 2) * 3;
        const value = Math.pow(10, power);

        if (i < 20) {
            thresholds.push({ value, suffix: baseSuffixes[i] });
        } else {
            const group = Math.floor((i - 20) / 10); // Higher groups (10^90, 10^120, etc.)
            const position = (i - 20) % 10; // Position within the current group

            const groupSuffix = group < baseSuffixes.length
                ? baseSuffixes[group]
                : `gintillion`.repeat(group + 1); // Dynamically generate group (skip recursion)

            const prefix = numeralPrefixes[position];
            thresholds.push({ value, suffix: `${prefix}${groupSuffix}` });
        }
    }
};
// Precompute suffixes once at the load time
precomputeSuffixes();

export const formatDecimalWithSuffix = (value: Decimal, decimals: number = 3): string => {
    // Handle small values below 1,000,000 directly
    if (value.lt(1_000_000)) {
        return addCommasToDecimal(value);
    }

    const numericValue = value.toNumber(); // Convert to number for faster comparisons

    // Perform a binary search to find the appropriate suffix
    let low = 0, high = thresholds.length - 1;
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (numericValue >= thresholds[mid].value) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    const { value: threshold, suffix } = thresholds[high];
    const scaledValue = numericValue / threshold;

    // Format the scaled value and attach the suffix
    const formattedValue = scaledValue.toFixed(decimals).replace(/\.?0+$/, ""); // Avoid trailing zeros
    return `${formattedValue} ${suffix}`;
};

const addCommasToDecimal = (value: Decimal): string => {
    return value
        .toFixed(0)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas for readability
};

/**
 * Converts a number to its equivalent word representation (up to 20).
 * Falls back to string representation for numbers outside the range.
 */
export const numberToWords = (num: number): string => {
    const words = [
        "zero", "one", "two", "three", "four",
        "five", "six", "seven", "eight", "nine",
        "ten", "eleven", "twelve", "thirteen",
        "fourteen", "fifteen", "sixteen", "seventeen",
        "eighteen", "nineteen", "twenty"
    ];

    // Handle numbers within the range 0-20
    if (num >= 0 && num <= 20) {
        return words[num];
    }

    return num.toString(); // Fallback for numbers outside the range
};