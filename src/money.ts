import BigNumber from "bignumber.mjs";
import Calculator from "./calculator";
import CalculatorRegistry from "./calculator-registry";
import Currency from "./currency";
import Num from "./_number";
import Num2 from "./_number2";
import { RoundingMode } from "./rounding";
import { numeric2 } from "./types";
import { arraySum, mapKeysWithSearch, objectKeysWithSearch } from "./_util";

interface NamedRatios {
    [name: string]: number;
}

interface NamedMoneyMap {
    [name: string]: Money;
}

export default class Money {
    private readonly _amount: Num2;
    public readonly currency: Currency;

    public constructor(amount: numeric2 | Num2, currency: Currency) {
        if (amount instanceof Num2) {
            this._amount = amount;
        } else {
            this._amount = new Num2(amount);
        }

        this.currency = currency;
    }

    private newInstance(amount: Num2 | numeric2): Money {
        return new Money(amount, this.currency);
    }

    public get amount(): string {
        return this._amount.toString();
    }

    public get value(): BigNumber {
        return this._amount.num;
    }

    public isSameCurrency(other: Money): boolean {
        return this.currency.equals(other.currency);
    }

    private assertSameCurrency(other: Money): void {
        if (this.isSameCurrency(other) === false) {
            throw new Error("Currencies must be identical");
        }
    }

    public equals(other: Money): boolean {
        return this.isSameCurrency(other) && this._amount.equals(other._amount);
    }

    /**
     * This is a wrapper method for compatibility with the Dinero.js API.
     */
    public equalsTo(other: Money): boolean {
        return this.equals(other);
    }

    public compare(other: Money): number {
        this.assertSameCurrency(other);

        return this._amount.compare(other._amount);
    }

    public greaterThan(other: Money): boolean {
        return this.compare(other) > 0;
    }

    public greaterThanOrEqual(other: Money): boolean {
        return this.compare(other) >= 0;
    }

    public lessThan(other: Money): boolean {
        return this.compare(other) < 0;
    }

    public lessThanOrEqual(other: Money): boolean {
        return this.compare(other) <= 0;
    }

    public add(...addends: Money[]): Money {
        const genFunc = (): Generator<Num2> => {
            for (const addend of addends) {
                this.assertSameCurrency(addend);
                yield addend._amount;
            }
        };
        return this.newInstance(Num2.add(this._amount, genFunc()));
    }

    public plus(...addends: Money[]): Money {
        return this.add(...addends);
    }

    public subtract(...subtrahends: Money[]): Money {
        const genFunc = (): Generator<Num2> => {
            for (const subtrahend of subtrahends) {
                this.assertSameCurrency(subtrahend);
                yield subtrahend._amount;
            }
        };
        return this.newInstance(Num2.subtract(this._amount, genFunc()));
    }

    public minus(...subtrahends: Money[]): Money {
        return this.subtract(...subtrahends);
    }

    public multiply(multiplier: numeric2): Money {
        return this.newInstance(this._amount.multiply(multiplier));
    }

    public times(multiplier: numeric2): Money {
        return this.multiply(multiplier);
    }

    public multipliedBy(multiplier: numeric2): Money {
        return this.multiply(multiplier);
    }

    public divide(divisor: numeric2): Money {
        return this.newInstance(this._amount.divide(divisor));
    }

    public dividedBy(divisor: numeric2): Money {
        return this.divide(divisor);
    }

    public mod(divisor: Money): Money {
        this.assertSameCurrency(divisor);

        return this.newInstance(this._amount.mod(divisor._amount));
    }

    public percentage(percent: number): Money {
        return this.newInstance(this._amount.percent(percent));
    }

    public percent(percent: number): Money {
        return this.percentage(percent, roundingMode);
    }

    public subtractPercentage(percent: number): Money {
        if (percent < 0 || percent > 100) {
            throw new RangeError("Percentage values must be between 0 and 100.");
        }

        return this.newInstance(this._amount.subtractPercent(percent));
    }

    public subtractPercent(percent: number): Money {
        return this.subtractPercentage(percent, roundingMode);
    }

    public allocate(ratios: number[]): Money[] {
        if (ratios.length === 0) {
            throw new Error("Cannot allocate to none, ratios cannot be an empty array");
        }

        let remainder = this.amount;
        const results = new Map<number, Money>();
        const total = arraySum(ratios);

        if (total <= 0) {
            throw new Error("Cannot allocate to none, sum of ratios must be greater than zero");
        }

        for (const [key, ratio] of ratios.entries()) {
            if (ratio < 0) {
                throw new Error("Cannot allocate to none, ratio must be zero or positive");
            }

            const share = this.calculator.share(this.amount, ratio, total);
            results.set(key, this.newInstance(share));
            remainder = this.calculator.subtract(remainder, share);
        }

        if (this.calculator.compare(remainder, "0") === 0) {
            return [...results.values()];
        }

        const thisAmountInt = parseInt(this.amount);
        const fractionsMap = new Map<number, number>();
        ratios.forEach((ratio, index) => {
            const share = (ratio / total) * thisAmountInt;
            const fraction = share - Math.floor(share);
            fractionsMap.set(index, fraction);
        });

        while (this.calculator.compare(remainder, "0") > 0) {
            const index = fractionsMap.size > 0 ? mapKeysWithSearch(fractionsMap, Math.max(...fractionsMap.values()))[0] : 0;
            results.set(index, results.get(index)!.newInstance(this.calculator.add(results.get(index)!.amount, "1")));
            remainder = this.calculator.subtract(remainder, "1");
            fractionsMap.delete(index);
        }

        return [...results.values()];
    }

    public allocateNamed(ratios: NamedRatios): NamedMoneyMap {
        if (Object.keys(ratios).length === 0) {
            throw new Error("Cannot allocate to none, ratios cannot be an empty array");
        }

        let remainder = this.amount;
        const results: NamedMoneyMap = {};
        const total = arraySum(Object.values(ratios));

        if (total <= 0) {
            throw new Error("Cannot allocate to none, sum of ratios must be greater than zero");
        }

        for (const [key, ratio] of Object.entries(ratios)) {
            if (ratio < 0) {
                throw new Error("Cannot allocate to none, ratio must be zero or positive");
            }

            const share = this.calculator.share(this.amount, ratio, total);
            results[key] = this.newInstance(share);
            remainder = this.calculator.subtract(remainder, share);
        }

        if (this.calculator.compare(remainder, "0") === 0) {
            return results;
        }

        const thisAmountInt = parseInt(this.amount);
        const fractions: NamedRatios = {};
        for (const [key, ratio] of Object.entries(ratios)) {
            const share = (ratio / total) * thisAmountInt;

            fractions[key] = share - Math.floor(share);
        }

        while (this.calculator.compare(remainder, "0") > 0) {
            // TODO: I don't know how this is supposed to handle the case where Object.keys(fractions).length === 0 for named allocations
            const index = Object.keys(fractions).length > 0 ? objectKeysWithSearch(fractions, Math.max(...Object.values(fractions)))[0] : 0;
            results[index] = results[index].newInstance(this.calculator.add(results[index].amount, "1"));
            remainder = this.calculator.subtract(remainder, "1");
            delete fractions[index];
        }

        return results;
    }

    public allocateTo(n: number): Money[] {
        if (Number.isInteger(n) === false) {
            throw new Error("Number of targets must be an integer");
        }

        if (n <= 0) {
            throw new Error("Cannot allocate to none, target must be greater than zero");
        }

        const ratios: number[] = [];
        ratios.length = n;
        ratios.fill(1, 0, n);
        return this.allocate(ratios);
    }

    public ratioOf(money: Money): string {
        if (money.isZero) {
            throw new Error("Cannot calculate a ratio of zero");
        }

        return this.calculator.divide(this.amount, money.amount);
    }

    private round(amount: string, roundingMode: RoundingMode): string {
        if (roundingMode === RoundingMode.ROUND_UP) {
            return this.calculator.ceil(amount);
        }

        if (roundingMode === RoundingMode.ROUND_DOWN) {
            return this.calculator.floor(amount);
        }

        return this.calculator.round(amount, roundingMode);
    }

    public absolute(): Money {
        return this.newInstance(
            this.calculator.absolute(this.amount),
        );
    }

    public negative(): Money {
        return this.newInstance(0).subtract(this);
    }

    public get isZero(): boolean {
        return this.calculator.compare(this.amount, "0") === 0;
    }

    public get isPositive(): boolean {
        return this.calculator.compare(this.amount, "0") > 0;
    }

    public get isNegative(): boolean {
        return this.calculator.compare(this.amount, "0") < 0;
    }

    public toJSON(): object {
        return {
            amount: this.amount,
            currency: this.currency.toJSON(),
        };
    }

    public static min(...collection: Money[]): Money {
        if (collection.length === 0) {
            throw new Error("Must pass at least one money object.");
        }

        let min = collection.shift() as Money;

        for (const money of collection) {
            if (money.lessThan(min) === true) {
                min = money;
            }
        }

        return min;
    }

    public static max(...collection: Money[]): Money {
        if (collection.length === 0) {
            throw new Error("Must pass at least one money object.");
        }

        let max = collection.shift() as Money;

        for (const money of collection) {
            if (money.greaterThan(max) === true) {
                max = money;
            }
        }

        return max;
    }

    public static sum(...collection: Money[]): Money {
        if (collection.length === 0) {
            throw new Error("Must pass at least one money object.");
        }

        const first = collection.shift() as Money;
        return first.add(...collection);
    }

    public static avg(...collection: Money[]): Money {
        const argCount = collection.length;
        if (argCount === 0) {
            throw new Error("Must pass at least one money object.");
        }

        const first = collection.shift() as Money;
        return first.add(...collection).divide(argCount);
    }

    public get calculator(): Calculator {
        return CalculatorRegistry.getCalculator();
    }
}
