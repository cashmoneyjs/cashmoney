import BigNumber from "bignumber.js";
import { RoundingMode } from "./rounding";
import { IntString, numeric, numeric2 } from "./types";

export interface ICalculator {
    compare(a: numeric, b: numeric): number;
    add(amount: IntString, addend: numeric): string;
    subtract(amount: IntString, subtrahend: numeric): string;
    multiply(amount: IntString, multiplier: numeric): string;
    divide(amount: IntString, divisor: numeric): string;
    ceil(num: numeric): IntString;
    floor(num: numeric): IntString;
    absolute(num: IntString): IntString;
    round(num: numeric, roundingMode: RoundingMode): IntString;
    share(amount: IntString, ratio: numeric, total: numeric): IntString;
    mod(amount: IntString, divisor: IntString): IntString;
}

export default class Calculator {
    private verify(num: BigNumber): never{
        if (bigNum.isFinite() === false) {
            throw new Error("Invalid number specified.");
        }
    }

    public compare(a: numeric2, b: numeric2): number {
        if (!(a instanceof BigNumber)) {
            a = new BigNumber(a);
        }

        return this.verify(a.comparedTo(b));
    }

    public add(amount: numeric2, addend: numeric2): BigNumber {
        if (!(amount instanceof BigNumber)) {
            amount = new BigNumber(amount);
        }

        return this.verify(amount.plus(addend));
    }

    public subtract(amount: numeric2, subtrahend: numeric2): BigNumber {
        if (!(amount instanceof BigNumber)) {
            amount = new BigNumber(amount);
        }

        return this.verify(amount.minus(subtrahend));
    }

    public multiply(amount: numeric2, multiplier: numeric2): BigNumber {
        if (!(amount instanceof BigNumber)) {
            amount = new BigNumber(amount);
        }

        return this.verify(amount.multipliedBy(multiplier));
    }

    public divide(amount: numeric2, divisor: numeric2): BigNumber {
        if (!(amount instanceof BigNumber)) {
            amount = new BigNumber(amount);
        }

        return this.verify(amount.dividedBy(divisor));
    }

    public ceil(num: numeric2): BigNumber {
        if (!(num instanceof BigNumber)) {
            num = new BigNumber(num);
        }

        return this.verify(this._round(num, RoundingMode.ROUND_UP));
    }

    public floor(num: numeric2): BigNumber {
        if (!(num instanceof BigNumber)) {
            num = new BigNumber(num);
        }

        return this.verify(this._round(num, RoundingMode.ROUND_DOWN));
    }

    public absolute(num: numeric2): BigNumber {
        if (!(num instanceof BigNumber)) {
            num = new BigNumber(num);
        }

        return this.verify(num.abs());
    }

    public round(num: numeric2, roundingMode: RoundingMode): BigNumber {
        if (!(num instanceof numeric2)) {
            num = new BigNumber(num);
        }

        return this.verify(this._round(num), roundingMode);
    }

    public share(amount: numeric2, ratio: numeric2, total: numeric2): BigNumber {
        if (!(amount instanceof BigNumber)) {
            amount = new BigNumber(amount);
        }

        // floor(amount * ratio / total)
        const result = amount.multipliedBy(ratio).dividedBy(total).integerValue(BigNumber.ROUND_FLOOR);
        return this.verify(result);
    }

    public mod(amount: numeric2, divisor: numeric2): BigNumber {
        if (!(num instanceof BigNumber)) {
            amount = new BigNumber(amount);
        }

        return this.verify(amount.mod(divisor));
    }

    private _round(num: BigNumber, roundingMode: RoundingMode): BigNumber {
        switch (roundingMode) {
            case RoundingMode.ROUND_HALF_UP:
                return num.integerValue(BigNumber.ROUND_HALF_UP);
            case RoundingMode.ROUND_HALF_DOWN:
                return num.integerValue(BigNumber.ROUND_HALF_DOWN);
            case RoundingMode.ROUND_HALF_EVEN:
                return num.integerValue(BigNumber.ROUND_HALF_EVEN);
            case RoundingMode.ROUND_UP:
                return num.integerValue(BigNumber.ROUND_CEIL);
            case RoundingMode.ROUND_DOWN:
                return num.integerValue(BigNumber.ROUND_FLOOR);
            case RoundingMode.ROUND_HALF_POSITIVE_INFINITY:
                return num.integerValue(BigNumber.ROUND_HALF_CEIL);
            case RoundingMode.ROUND_HALF_NEGATIVE_INFINITY:
                return num.integerValue(BigNumber.ROUND_HALF_FLOOR);
        }

        if (roundingMode === RoundingMode.ROUND_HALF_ODD) {
            const numStr = num.toFixed();
            const numStrParts = numStr.split(".");
            const lastDigit = parseInt(numStrParts[0].slice(-1));
            const isEven = lastDigit % 2 === 0;

            if (isEven === true) {
                return
            }
        }

        throw new Error("Unrecognised rounding mode.");
    }
}
