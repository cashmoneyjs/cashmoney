import { trimStart } from "trim-strings";

import Num from "../_number";
import { RoundingMode } from "../rounding";
import { ICalculator } from "../calculator";
import { IntString, numeric } from "../types";

export default class JsNumberCalculator implements ICalculator {
    public compare(a: numeric, b: numeric): number {
        let aN: number;
        if (typeof a === "string") {
            aN = parseFloat(a);
        } else {
            aN = a;
        }

        let bN: number;
        if (typeof b === "string") {
            bN = parseFloat(b);
        } else {
            bN = b;
        }

        return (aN < bN) ? -1 : ((aN > bN) ? 1 : 0);
    }

    public add(amount: IntString, addend: numeric): string {
        const amountN = parseInt(amount);
        let addendN: number;
        if (typeof addend === "string") {
            addendN = parseFloat(addend);
        } else {
            addendN = addend;
        }

        const result = amountN + addendN;
        return String(result);
    }

    public subtract(amount: IntString, subtrahend: numeric): string {
        const amountN = parseInt(amount);
        let subtrahendN: number;
        if (typeof subtrahend === "string") {
            subtrahendN = parseFloat(subtrahend);
        } else {
            subtrahendN = subtrahend;
        }

        const result = amountN - subtrahendN;
        return String(result);
    }

    public multiply(amount: IntString, multiplier: numeric): string {
        const amountN = parseInt(amount);
        let multiplierN: number;
        if (typeof multiplier === "string") {
            multiplierN = parseFloat(multiplier);
        } else {
            multiplierN = multiplier;
        }

        const result = amountN * multiplierN;
        const resultNum = Num.fromNumber(parseFloat(result.toPrecision(14)));
        return String(resultNum);
    }

    public divide(amount: IntString, divisor: numeric): string {
        const amountN = parseInt(amount);
        let divisorN: number;
        if (typeof divisor === "string") {
            divisorN = parseFloat(divisor);
        } else {
            divisorN = divisor;
        }

        const result = amountN / divisorN;
        const resultNum = Num.fromNumber(parseFloat(result.toPrecision(14)));
        return String(resultNum);
    }

    public ceil(num: numeric): IntString {
        let numN: number;
        if (typeof num === "string") {
            numN = parseFloat(num);
        } else {
            numN = num;
        }

        return String(Math.ceil(numN));
    }

    public floor(num: numeric): IntString {
        let numN: number;
        if (typeof num === "string") {
            numN = parseFloat(num);
        } else {
            numN = num;
        }

        return String(Math.floor(numN));
    }

    public absolute(num: IntString): IntString {
        const result = trimStart(num, "-");
        return result;
    }

    public round(num: numeric, roundingMode: RoundingMode): IntString {
        const numObj = Num.fromNumber(num);

        if (numObj.isInteger === true) {
            return String(numObj);
        }

        if (numObj.isHalf === false) {
            return this.roundDigit(numObj);
        }

        const numInt = parseInt(String(numObj));

        if (roundingMode === RoundingMode.ROUND_HALF_UP) {
            const result = numInt + numObj.getIntegerRoundingMultiplier();
            return String(result);
        }

        if (roundingMode === RoundingMode.ROUND_HALF_DOWN) {
            return String(numInt);
        }

        if (roundingMode === RoundingMode.ROUND_HALF_EVEN) {
            if (numObj.isCurrentEven === true) {
                return String(numInt);
            }

            const result = numInt + numObj.getIntegerRoundingMultiplier();
            return String(result);
        }

        if (roundingMode === RoundingMode.ROUND_HALF_ODD) {
            if (numObj.isCurrentEven === true) {
                const result = numInt + numObj.getIntegerRoundingMultiplier();
                return String(result);
            }

            return String(numInt);
        }

        if (roundingMode === RoundingMode.ROUND_HALF_POSITIVE_INFINITY) {
            if (numObj.isNegative === true) {
                return String(numInt);
            }

            const result = numInt + numObj.getIntegerRoundingMultiplier();
            return String(result);
        }

        if (roundingMode === RoundingMode.ROUND_HALF_NEGATIVE_INFINITY) {
            if (numObj.isNegative === true) {
                const result = numInt + numObj.getIntegerRoundingMultiplier();
                return String(result);
            }

            return String(numInt);
        }

        throw new Error("Unknown rounding mode");
    }

    private roundDigit(numObj: Num): IntString {
        const numInt = parseInt(String(numObj));

        if (numObj.isCloserToNext === true) {
            const result = numInt + numObj.getIntegerRoundingMultiplier();
            return String(result);
        }

        return String(numInt);
    }

    public share(amount: IntString, ratio: numeric, total: numeric): IntString {
        const amountN = parseInt(amount);
        let ratioN: number;
        let totalN: number;
        if (typeof ratio === "string") {
            ratioN = parseFloat(ratio);
        } else {
            ratioN = ratio;
        }
        if (typeof total === "string") {
            totalN = parseFloat(total);
        } else {
            totalN = total;
        }

        const resultF = amountN * ratioN / totalN;
        const resultN = Math.floor(resultF);
        return String(resultN);
    }

    public mod(amount: IntString, divisor: IntString): IntString {
        const amountN = parseInt(amount);
        const divisorN = parseInt(divisor);

        const result = amountN % divisorN;
        return String(result);
    }
}
