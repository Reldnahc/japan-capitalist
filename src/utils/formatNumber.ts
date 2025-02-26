import Decimal from "break_infinity.js";

export function formatDecimalWithSuffix(value: Decimal, decimals: number = 3): string {
    // List of suffixes for large number ranges
    const suffixes = [
        { value: new Decimal("1e63"), suffix: "Vigintillion" },
        { value: new Decimal("1e60"), suffix: "Novemdecillion" },
        { value: new Decimal("1e57"), suffix: "Octodecillion" },
        { value: new Decimal("1e54"), suffix: "Septendecillion" },
        { value: new Decimal("1e51"), suffix: "Sexdecillion" },
        { value: new Decimal("1e48"), suffix: "Quindecillion" },
        { value: new Decimal("1e45"), suffix: "Quattuordecillion" },
        { value: new Decimal("1e42"), suffix: "Tredecillion" },
        { value: new Decimal("1e39"), suffix: "Duodecillion" },
        { value: new Decimal("1e36"), suffix: "Undecillion" },
        { value: new Decimal("1e33"), suffix: "Decillion" },
        { value: new Decimal("1e30"), suffix: "Nonillion" },
        { value: new Decimal("1e27"), suffix: "Octillion" },
        { value: new Decimal("1e24"), suffix: "Septillion" },
        { value: new Decimal("1e21"), suffix: "Sextillion" },
        { value: new Decimal("1e18"), suffix: "Quintillion" },
        { value: new Decimal("1e15"), suffix: "Quadrillion" },
        { value: new Decimal("1e12"), suffix: "Trillion" },
        { value: new Decimal("1e9"),  suffix: "Billion" },
        { value: new Decimal("1e6"),  suffix: "Million" },
        { value: new Decimal("1"),    suffix: "" },
    ];


    // Loop through the suffixes to find the largest threshold
    for (const { value: threshold, suffix } of suffixes) {
        if (value.gte(threshold)) {
            // Divide the value by the threshold
            const scaledValue = value.div(threshold);

            // Format the number with the specified decimals
            const formattedValue = scaledValue.toFixed(decimals).replace(/\.?0+$/, ""); // Remove trailing zeros and dots

            // Add commas for readability if applicable
            if (value.gte(new Decimal(1_000)) && value.lt(new Decimal(1_000_000))) {
                return addCommasToDecimal(value);
            }

            return `${formattedValue} ${suffix}`;
        }

    }


    return value.toString(); // Fallback for small or negative values
}


function addCommasToDecimal(value: Decimal): string {
    // Convert Decimal to string for manipulation
    const valueStr = value.toFixed(0); // No decimal places for simpler formatting

    // Insert commas as thousands separators
    return valueStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
