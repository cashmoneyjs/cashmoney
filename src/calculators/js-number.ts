import { trimStart } from "trim-strings";

import { Num } from "../number";
import { RoundingMode } from "../rounding";
import { Calculator } from "../calculator";
import { numeric } from "../types";

export class JsNumberCalculator implements Calculator {
    public compare(a: string, b: string): number {
        const aN = parseFloat(a);
        const bN = parseFloat(b);

        return (aN < bN) ? -1 : ((aN > bN) ? 1 : 0);
    }

    public add(amount: string, addend: string): string {
        const amountN = parseInt(amount);
        const addendN = parseInt(amount);

        const result = amountN + addendN;
        return String(result);
    }

    public subtract(amount: string, subtrahend: string): string {
        const amountN = parseInt(amount);
        const addendN = parseInt(amount);

        const result = amountN + addendN;
        return String(result);
    }

    public multiply(amount: string, multiplier: numeric): string {
        const amountN = parseInt(amount);
        let multiplierN: number;
        if (typeof multiplier === "string") {
            multiplierN = parseFloat(multiplier);
        } else {
            multiplierN = multiplier;
        }

        const result = amountN * multiplierN;
        const resultNum = Num.fromNumber(result);
        return String(resultNum);
    }

    public divide(amount: string, divisor: numeric): string {
        const amountN = parseInt(amount);
        let divisorN: number;
        if (typeof divisor === "string") {
            divisorN = parseFloat(divisor);
        } else {
            divisorN = divisor;
        }

        const result = amountN / divisorN;
        const resultNum = Num.fromNumber(result);
        return String(resultNum);
    }

    public ceil(num: string): string {
        return String(Math.ceil(parseFloat(num)));
    }

    public floor(num: string): string {
        return String(Math.floor(parseFloat(num)));
    }

    public absolute(num: string): string {
        const result = trimStart(num, "-");
        return result;
    }

    public round(num: numeric, roundingMode: RoundingMode): string {
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

    private roundDigit(numObj: Num): string {
        const numInt = parseInt(String(numObj));

        if (numObj.isCloserToNext === true) {
            const result = numInt + numObj.getIntegerRoundingMultiplier();
            return String(result);
        }

        return String(numInt);
    }

    public share(amount: string, ratio: numeric, total: numeric): string {
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

    public mod(amount: string, divisor: numeric): string {
        const amountN = parseInt(amount);
        let divisorN: number;
        if (typeof divisor === "string") {
            divisorN = parseFloat(divisor);
        } else {
            divisorN = divisor;
        }

        const result = amountN % divisorN;
        return String(result);
    }
}
