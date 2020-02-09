import BigNumber from "bignumber.js";
import { RoundingMode } from "./rounding";
import { arraySum, mapKeysWithSearch, objectKeysWithSearch } from "./_util";

interface NamedRatios {
    [name: string]: number;
}

interface NamedNumMap {
    [name: string]: Num2;
}

interface NamedBigNumMap {
    [name: string]: BigNumber;
}

/**
 * @private
 */
export default class Num2 {
    public readonly num: BigNumber;

    public readonly integerPart: string;
    public readonly fractionalPart: string;

    public constructor(num: numeric2) {
        if (num instanceof BigNumber) {
            this.num = num;
        } else {
            this.num = new BigNumber(num);
        }
        if (this.num.isFinite() === false) {
            throw new Error("Invalid number supplied.");
        }

        const numStr = this.num.toFixed();
        const numStrParts = numStr.split(".");
        this.integerPart = numStrParts[0];
        if (numStrParts.length === 2) {
            this.fractionalPart = numStrParts[1];
        } else {
            this.fractionalPart = "";
        }
    }

    public toString(): string {
        return this.num.toFixed();
    }

    public toJSON(): string {
        return this.toString();
    }

    public get isInteger(): boolean {
        return this.num.isInteger() === true;
    }

    public get isDecimal(): boolean {
        return this.num.isInteger() === false;
    }

    public get isHalf(): boolean {
        return this.fractionalPart === "5";
    }

    public get isEven(): boolean {
        const lastDigit = this.integerParts.slice(-1);
        return parseInt(lastDigit) % 2 === 0;
    }

    public get isOdd(): boolean {
        const lastDigit = this.integerParts.slice(-1);
        return parseInt(lastDigit) % 2 !== 0;
    }

    public get isCloserToNext(): boolean {
        if (this.fractionalPart === "") {
            return false;
        }

        return parseInt(this.fractionalPart[0]) >= 5;
    }

    public get isPositive(): boolean {
        return this.num.isPositive();
    }

    public get isNegative(): boolean {
        return this.num.isNegative();
    }

    public get isZero(): boolean {
        return this.num.isZero();
    }

    public getIntegerRoundingMultiplier(): 1 | -1 {
        if (this.num.isNegative() === true) {
            return -1;
        }

        return 1;
    }

    public compare(other: Num2 | numeric2): number {
        if (other instanceof Num2) {
            other = other.num;
        }

        return this.num.comparedTo(other);
    }

    public equals(other: Num2 | numeric2): boolean {
        if (other instanceof Num2) {
            other = other.num;
        }

        return this.num.isEqualTo(other);
    }

    public greaterThan(other: Num2 | numeric2): boolean {
        if (other instanceof Num2) {
            other = other.num;
        }

        return this.num.isGreaterThan(other);
    }

    public greaterThanOrEqual(other: Num2 | numeric2): boolean {
        if (other instanceof Num2) {
            other = other.num;
        }

        return this.num.isGreaterThanOrEqualTo(other);
    }

    public lessThan(other: Num2 | numeric2): boolean {
        if (other instanceof Num2) {
            other = other.num;
        }

        return this.num.isLessThan(other);
    }

    public lessThanOrEqual(other: Num2 | numeric2): boolean {
        if (other instanceof Num2) {
            other = other.num;
        }

        return this.num.isLessThanOrEqualTo(other);
    }

    public add(addend: Num2 | numeric2): Num2 {
        if (addend instanceof Num2) {
            addend = addend.num;
        }

        return new Num2(this.num.plus(addend));
    }

    public static add(amount: Num2 | numeric2, addends: Iterable<Num2 | numeric2>): BigNumber {
        if (amount instanceof Num2) {
            amount = amount.num;
        } else if (!(amount instanceof BigNumber)) {
            amount = new BigNumber(amount);
        }

        for (const addend of addends) {
            if (addend instanceof Num2) {
                amount = amount.plus(addend.num);
            } else {
                amount = amount.plus(addend);
            }
        }

        return amount;
    }

    public subtract(subtrahend: Num2 | numeric2): Num2 {
        if (subtrahend instanceof Num2) {
            subtrahend = subtrahend.num;
        }

        return new Num2(this.num.minus(subtrahend));
    }

    public static subtract(amount: Num2 | numeric2, subtrahends: Iterable<Num2 | numeric2>): BigNumber {
        if (amount instanceof Num2) {
            amount = amount.num;
        } else if (!(amount instanceof BigNumber)) {
            amount = new BigNumber(amount);
        }

        for (const subtrahend of subtrahends) {
            if (subtrahend instanceof Num2) {
                amount = amount.minus(subtrahend.num);
            } else {
                amount = amount.minus(subtrahend);
            }
        }

        return amount;
    }

    public multiply(multiplier: numeric2): Num2 {
        return new Num2(this.num.multipliedBy(multiplier));
    }

    public divide(divisor: numeric2): Num2 {
        if ((new BigNumber(divisor)).isZero() === true) {
            throw new Error("Cannot divide by zero.");
        }

        return new Num2(this.num.dividedBy(divisor));
    }

    public percent(percent: number): Num2 {
        if (percent < 0 || percent > 100) {
            throw new RangeError("Percentage values must be between 0 and 100.");
        }

        return this.multiply(percent / 100);
    }

    public subtractPercent(percent: number): Num2 {
        return new Num2(Num2.subtractPercent(this.num, percent));
    }

    public static subtractPercent(amount: Num2 | numeric2, percent: number): BigNumber {
        if (amount instanceof Num2) {
            amount = amount.num;
        } else if (!(amount instanceof BigNumber)) {
            amount = new BigNumber(amount);
        }

        const percentage = amount.multipliedBy(percent / 100);
        return amount.minus(percentage);
    }

    public ceil(): Num2 {
        return this.round(RoundingMode.ROUND_UP);
    }

    public floor(): Num2 {
        return this.round(RoundingMode.ROUND_DOWN);
    }

    public absolute(): Num2 {
        return new Num2(this.num.abs());
    }

    public round(roundingMode: RoundingMode): Num2 {
        return new Num2(this._round(roundingMode));
    }

    public allocate(ratios: number[]): Generator<Num2> {
        for (const bigNum of Num2.allocate(this.num, ratios)) {
            yield new Num2(bigNum);
        }
    }

    public static allocate(amount: Num2 | numeric2, ratios: number[]): Iterable<BigNumber> {
        if (ratios.length === 0) {
            throw new Error("Cannot allocate to none, ratios cannot be an empty array.");
        }

        if (amount instanceof Num2) {
            amount = amount.num;
        } else if (!(amount instanceof BigNumber)) {
            amount = new BigNumber(amount);
        }

        let remainder = amount;
        const results = new Map<number, BigNumber>();
        const total = arraySum(ratios);

        if (total <= 0) {
            throw new Error("Cannot allocate to none, sum of ratios must be greater than zero.");
        }

        for (const [key, ratio] of ratios.entries()) {
            if (ratio < 0) {
                throw new Error("Cannot allocate to none, ratio must be zero or positive.");
            }

            const share = Num2.share(amount, ratio, total);
            results.set(key, share);
            remainder = remainder.minus(share);
        }

        if (remainder.isZero() === true) {
            return results.values();
        }

        const fractionsMap = new Map<number, BigNumber>();
        ratios.forEach((ratio, index) => {
            const share = amount.multipliedBy(ratio / total);
            const fraction = share.minus(share.integerValue(BigNumber.ROUND_FLOOR));
            fractionsMap.set(index, fraction);
        });

        while (remainder.isZero() === false) {
            const index = fractionsMap.size > 0 ? mapKeysWithSearch(fractionsMap, BigNumber.max(...fractionsMap.values()))[0] : 0;
            const match = results.get(index) as BigNumber;
            results.set(index, match.plus(1));
            remainder = remainder.minus(1);
            fractionsMap.delete(index);
        }

        return results.values();
    }

    public allocateNamed(ratios: number[]): NamedNumMap {
        const namedBigNumMap = Num2.allocateNamed(this.num, ratios);

        const namedNumMap: NamedNumMap = {};
        for (const [name, bigNum] of Object.entries(namedBigNumMap)) {
            namedNumMap[name] = new Num2(bigNum);
        }

        return namedNumMap;
    }

    public static allocateNamed(ratios: NamedRatios): NamedBigNumMap {
        if (Object.keys(ratios).length === 0) {
            throw new Error("Cannot allocate to none, ratios must be an empty array.");
        }

        if (amount instanceof Num2) {
            amount = amount.num;
        } else if (!(amount instanceof BigNumber)) {
            amount = new BigNumber(amount);
        }

        let remainder = amount;
        const results: NamedBigNumMap = {};
        const total = arraySum(Object.values(ratios));

        if (total <= 0) {
            throw new Error("Cannot allocate to none, sum of ratios must be greater than zero.");
        }

        for (const [key, value] of Object.entries(ratios)) {
            if (ratio < 0) {
                throw new Error("Cannot allocate to none, ratio must be zero or positive.");
            }

            const share = Num2.share(amount, ratio, total);
            results[key] = share;
            remainder = remainder.minus(share);
        }

        if (remainder.isZero() === true) {
            return results;
        }

        const fractions: NamedRatios = {};
        for (const [key, ratio] of Object.entries(ratios)) {
            const share = amount.multipliedBy(ratio / total);
            const fraction = share.minus(share.integerValue(BigNumber.ROUND_FLOOR));
            fractions[key] = fraction;
        }

        while (remainder.isZero() === false) {
            // TODO: I don't know how this is supposed to handle the case where Object.keys(fractions).length === 0 for named allocations
            const index = Object.keys(fractions).length > 0 ? objectKeysWithSearch(fractions, BigNumber.max(...Object.values(fractions)))[0] : 0;
            const match = results[index];
            results[index] = match.plus(1);
            remainder = remainder.minus(1);
            delete fractions[index];
        }

        return results;
    }

    public allocateTo(n: number): Generator<Num2> {
        for (const bigNum of Num2.allocateTo(this.num, ratios)) {
            yield new Num2(bigNum);
        }
    }

    public static allocateTo(amount: Num2 | numeric2, n: number): Iterable<BigNumber> {
        if (Number.isInteger(n) === false) {
            throw new Error("Number of targets must be an integer.");
        }

        if (n <= 0) {
            throw new Error("Cannot allocate to none, target count must be greater than zero.");
        }

        const ratios: number[] = [];
        ratios.length = n;
        ratios.fill(1, 0, n);
        return Num2.allocate(amount, ratios);
    }

    public share(ratio: numeric2, total: numeric2): Num2 {
        return new Num2(Num2.share(this.num, ratio, total));
    }

    public static share(amount: Num2 | numeric2, ratio: numeric2, total: numeric2): BigNumber {
        if (amount instanceof Num2) {
            amount = amount.num;
        } else if (!(amount instanceof BigNumber)) {
            amount = new BigNumber(amount);
        }

        // floor(amount * ratio / total)
        return amount.multipliedBy(ratio).dividedBy(total).integerValue(BigNumber.ROUND_FLOOR);
    }

    public mod(divisor: Num2 | numeric2): Num2 {
        if (divisor instanceof Num2) {
            divisor = divisor.num;
        }

        return new Num2(this.num.mod(divisor));
    }

    public ratioOf(other: Num2): Num2 {
        return Num2.ratioOf(this.num, other.num);
    }

    public static ratioOf(amount: Num2 | numeric, other: Num2 | numeric): BigNumber {
        if (amount instanceof Num2) {
            amount = amount.num;
        } else if (!(amount instanceof BigNumber)) {
            amount = new BigNumber(amount);
        }

        if (other instanceof Num2) {
            other = other.num;
        }

        return amount.dividedBy(other);
    }

    public static min(...collection: (Num2 | numeric2)[]): Num2 {
        if (collection.length === 0) {
            throw new Error("Must pass at least one number.");
        }

        const operands: numeric2[] = [];
        for (const entity of collection) {
            if (entity instanceof Num2) {
                operands.push(entity.num);
            } else {
                operands.push(entity);
            }
        }

        return new Num2(BigNumber.min(...operands));
    }

    public static max(...collection: (Num2 | numeric2)[]): Num2 {
        if (collection.length === 0) {
            throw new Error("Must pass at least one number.");
        }

        const operands: numeric2[] = [];
        for (const entity of collection) {
            if (entity instanceof Num2) {
                operands.push(entity.num);
            } else {
                operands.push(entity);
            }
        }

        return new Num2(BigNumber.max(...operands));
    }

    public static sum(...collection: (Num2 | numeric2)[]): Num2 {
        if (collection.length === 0) {
            throw new Error("Must pass at least one number.");
        }

        const first = collection.shift() as Num2 | numeric2;
        return new Num2(Num2.add(first, collection));
    }

    public static avg(...collection: (Num2 | numeric2)[]): Num2 {
        const argCount = collection.length;
        if (argCount === 0) {
            throw new Error("Must pass at least one number.");
        }

        const first = collection.shift() as Num2 | numeric;
        const sum = Num2.add(first, collection);
        return new Num2(sum.divide(argCount));
    }

    private _round(roundingMode: RoundingMode): BigNumber {
        switch (roundingMode) {
            case RoundingMode.ROUND_HALF_UP:
                return this.num.integerValue(BigNumber.ROUND_HALF_UP);
            case RoundingMode.ROUND_HALF_DOWN:
                return this.num.integerValue(BigNumber.ROUND_HALF_DOWN);
            case RoundingMode.ROUND_HALF_EVEN:
                return this.num.integerValue(BigNumber.ROUND_HALF_EVEN);
            case RoundingMode.ROUND_UP:
                return this.num.integerValue(BigNumber.ROUND_CEIL);
            case RoundingMode.ROUND_DOWN:
                return this.num.integerValue(BigNumber.ROUND_FLOOR);
            case RoundingMode.ROUND_HALF_POSITIVE_INFINITY:
                return this.num.integerValue(BigNumber.ROUND_HALF_CEIL);
            case RoundingMode.ROUND_HALF_NEGATIVE_INFINITY:
                return this.num.integerValue(BigNumber.ROUND_HALF_FLOOR);
            case RoundingMode.ROUND_TRUNCATE:
                return new BigNumber(this.integerPart);
        }

        if (roundingMode === RoundingMode.ROUND_HALF_ODD) {
            const truncated = this._round(RoundingMode.ROUND_TRUNCATE);
            if (this.isOdd === true) {
                return truncated;
            }
            return truncated.plus(this.getIntegerRoundingMultiplier());
        }

        throw new Error("Unrecognised rounding mode.");
    }
}
