export function trimTrailingDecimalPlaceZeroes(amount: string): string {
    if (amount.includes(".") === false) {
        throw new Error("No decimal place.");
    }

    let i;
    for (i = amount.length - 1; amount[i] === "0"; i--) {}

    if (amount[i] === ".") {
        return amount.substr(0, i);
    } else {
        return amount.substr(0, i + 1);
    }
}
