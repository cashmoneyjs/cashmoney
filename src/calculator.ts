import BigNumber from "bignumber.mjs";
import { RoundingMode } from "./rounding";
import { IntString, numeric } from "./types";

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
    private transform(num: string | number): BigNumber {
        const bigNum = new BigNumber(num);
        if (bigNum.isFinite() === true) {
            return bigNum;
        } else {
            throw new Error("Invalid number specified.");
        }
    }

    public compare(a: BigNumber | number | string, b: BigNumber | number | string): number {
        if (!(a instanceof BigNumber)) {
            a = this.transform(a);
        }

        return a.comparedTo(b);
    }

    public add(amount: BigNumber | number, addend: BigNumber | number): BigNumber {
        if (!(amount instanceof BigNumber)) {
            amount = new BigNumber(amount);
        }

        return amount.plus(addend);
    }

    public subtract(amount: BigNumber | number, subtrahend: BigNumber | number): BigNumber {
        if (!(amount instanceof BigNumber)) {
            amount = new BigNumber(amount);
        }

        return amount.minus(subtrahend);
    }

    public multiply(amount: BigNumber | number, multiplier: BigNumber | number): BigNumber {
        if (!(amount instanceof BigNumber)) {
            amount = new BigNumber(amount);
        }

        return amount.multipliedBy(multiplier);
    }

    public divide(amount: BigNumber | number, divisor: BigNumber | number): BigNumber {
        if (!(amount instanceof BigNumber)) {
            amount = new BigNumber(amount);
        }

        return amount.dividedBy(divisor);
    }

    public ceil(num: BigNumber | number): BigNumber {
        if (!(num instanceof BigNumber)) {
            num = new BigNumber(num);
        }

        return num.integerValue(BigNumber.ROUND_CEIL);
    }

    public floor(num: BigNumber | number): BigNumber {
        if (!(num instanceof BigNumber)) {
            num = new BigNumber(num);
        }

        return num.integerValue(BigNumber.ROUND_FLOOR);
    }

    public absolute(num: BigNumber | number): BigNumber {

    }
}
