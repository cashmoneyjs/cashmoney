import { trimStart, trimEnd } from "trim-strings";

import { numeric } from "./types";
import { stringSplice, stringPhpSubstr, stringPhpSubstrBroke } from "./_util";

const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function parseIntegerPart(num: string): string {
    if (num === "" || num === "0") {
        return "0";
    }

    if (num === "-") {
        return "-0";
    }

    let nonZero = false;
    const characters = num.length;
    for (let position = 0; position < characters; ++position) {
        const digit = num[position];
        if (numbers.includes(parseInt(digit)) === false && !(position === 0 && digit === "-")) {
            throw new Error(
                "Invalid integer part " + num + ". Invalid digit " + digit + " found"
            );
        }

        if (nonZero === false && digit === "0") {
            throw new Error("Leading zeroes are not allowed");
        }

        nonZero = true;
    }

    return num;
}

function parseFractionalPart(num: string): string {
    if (num === "") {
        return num;
    }

    const characters = num.length;
    for (let position = 0; position < characters; ++position) {
        const digit = num[position];
        if (numbers.includes(parseInt(digit)) === false) {
            throw new Error("Invalid fractional part " + num + ". Invalid digit " + digit + " found");
        }
    }

    return num;
}

export default class Num {
    public readonly integerPart: string;
    public readonly fractionalPart: string;

    public constructor(integerPart: string, fractionalPart: string = "") {
        if (integerPart === "" && fractionalPart === "") {
            throw new Error("Empty number is invalid");
        }

        this.integerPart = parseIntegerPart(integerPart);
        this.fractionalPart = parseFractionalPart(fractionalPart);
    }

    public static fromString(num: string): Num {
        const decimalSeparatorPosition = num.indexOf(".");
        if (decimalSeparatorPosition === -1) {
            return new Num(num, "");
        }

        return new Num(
            stringPhpSubstr(num, 0, decimalSeparatorPosition),
            trimEnd(stringPhpSubstr(num, decimalSeparatorPosition + 1), "0"),
        );
    }

    public static fromNumber(num: numeric): Num {
        if (typeof num === "number") {
            if (Number.isInteger(num)) {
                return new Num(String(num));
            } else {
                return Num.fromString(String(num));
            }
        } else if (typeof num === "string") {
            return Num.fromString(num);
        } else {
            throw new Error("Valid numeric value expected");
        }
    }

    public get isDecimal(): boolean {
        return this.fractionalPart !== "";
    }

    public get isInteger(): boolean {
        return this.fractionalPart === "";
    }

    public get isHalf(): boolean {
        return this.fractionalPart === "5";
    }

    public get isCurrentEven(): boolean {
        const lastIntegerPartNumber = parseInt(this.integerPart[this.integerPart.length - 1]);

        return lastIntegerPartNumber % 2 === 0;
    }

    public get isCloserToNext(): boolean {
        if (this.fractionalPart === "") {
            return false;
        }

        return parseInt(this.fractionalPart[0]) >= 5;
    }

    public toString(): string {
        if (this.fractionalPart === "") {
            return this.integerPart;
        }

        return this.integerPart + "." + this.fractionalPart;
    }

    public get isNegative(): boolean {
        return this.integerPart[0] === "-";
    }

    public getIntegerRoundingMultiplier(): 1 | -1 {
        if (this.integerPart[0] === "-") {
            return -1;
        }

        return 1;
    }

    public base10(num: number): Num {
        if (Number.isInteger(num) === false) {
            throw new Error("Expecting integer");
        }

        if (
            this.integerPart === "0" &&
            (this.fractionalPart === "" || this.fractionalPart === "0")
        ) {
            return this;
        }

        let sign = "";
        let integerPart = this.integerPart;

        if (integerPart[0] === "-") {
            sign = "-";
            integerPart = stringPhpSubstr(integerPart, 1);
        }

        if (num >= 0) {
            integerPart = trimStart(integerPart, "0");
            const lengthIntegerPart = integerPart.length;
            const integers = lengthIntegerPart - Math.min(num, lengthIntegerPart);
            const zeroPad = num - Math.min(num, lengthIntegerPart);

            const newIntegerPart = sign + stringPhpSubstr(integerPart, 0, integers);
            const newFractionalPart = "0".repeat(zeroPad) + stringPhpSubstrBroke(integerPart, integers) + this.fractionalPart;
            return new Num(
                newIntegerPart,
                trimEnd(newFractionalPart, "0"),
            );
        }

        num = Math.abs(num);
        const lengthFractionalPart = this.fractionalPart.length;
        const fractions = lengthFractionalPart - Math.min(num, lengthFractionalPart);
        const zeroPad = num - Math.min(num, lengthFractionalPart);

        const newIntegerPart = integerPart + stringPhpSubstr(this.fractionalPart, 0, lengthFractionalPart - fractions) + "0".repeat(zeroPad);
        const newFractionalPart = stringPhpSubstrBroke(this.fractionalPart, lengthFractionalPart - fractions);
        return new Num(
            sign + trimStart(newIntegerPart, "0"),
            newFractionalPart,
        );
    }

    public static roundMoneyValue(moneyValue: string, targetDigits: number, havingDigits: number): string {
        if (Number.isInteger(targetDigits) === false || Number.isInteger(havingDigits) === false) {
            throw new Error("Digits parameters must be integers");
        }

        const valueLength = moneyValue.length;
        const shouldRound = targetDigits < havingDigits && valueLength - havingDigits + targetDigits > 0;

        if (shouldRound === true && parseInt(moneyValue[valueLength - havingDigits + targetDigits]) >= 5) {
            let position = valueLength - havingDigits + targetDigits;
            let addend = 1;

            while (position > 0) {
                // In PHP, casting "-" to an integer Just Works(tm), and it turns into
                // a zero. Javascript actually has a concept of NaN, so that doesn't work
                // automatically and we need to handle it specially.
                let subNewValue: number;
                if (moneyValue[position - 1] === "-") {
                    subNewValue = 0;
                } else {
                    subNewValue = parseInt(moneyValue[position - 1]);
                }
                const newValue = String(subNewValue + addend);

                if (parseFloat(newValue) >= 10) {
                    moneyValue = stringSplice(moneyValue, position - 1, 1, newValue[1]);
                    addend = parseInt(newValue[0]);
                    --position;
                    if (position === 0) {
                        moneyValue = String(addend) + moneyValue;
                    }
                } else {
                    if (moneyValue[position - 1] === "-") {
                        moneyValue = "-" + stringSplice(moneyValue, position - 1, 1, newValue[0]);
                    } else {
                        moneyValue = stringSplice(moneyValue, position - 1, 1, newValue[0]);
                    }

                    break;
                }
            }
        }

        return moneyValue;
    }
}
