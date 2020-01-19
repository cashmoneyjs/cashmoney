import Calculator from "./calculator";
import CalculatorRegistry from "./calculator-registry";
import Currency from "./currency";
import Num from "./number";
import { RoundingMode } from "./rounding";
import { numeric } from "./types";
import { arraySum, arrayKeysWithSearch, objectKeysWithSearch } from "./util";

interface NamedRatios {
    [name: string]: number;
}

interface NamedMoneyMap {
    [name: string]: Money;
}

export default class Money {
    public readonly amount: string;
    public readonly currency: Currency;

    public constructor(amount: numeric, currency: Currency) {
        if (typeof amount === "number") {
            if (Number.isInteger(amount) === false) {
                throw new Error("Amount must be an integer(ish) value");
            }

            this.amount = String(amount);
        } else {
            const numObj = Num.fromString(amount);
            if (numObj.isInteger === false) {
                throw new Error("Amount must be an integer(ish) value");
            }

            this.amount = numObj.integerPart;
        }

        this.currency = currency;
    }

    private newInstance(amount: numeric): Money {
        return new Money(amount, this.currency);
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
        return this.isSameCurrency(other) && this.amount === other.amount;
    }

    public compare(other: Money): number {
        this.assertSameCurrency(other);

        return this.calculator.compare(this.amount, other.amount);
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
        let amount = this.amount;
        const calculator = this.calculator;

        for (const addend of addends) {
            this.assertSameCurrency(addend);

            amount = calculator.add(amount, addend.amount);
        }

        return new Money(amount, this.currency);
    }

    public subtract(...subtrahends: Money[]): Money {
        let amount = this.amount;
        const calculator = this.calculator;

        for (const subtrahend of subtrahends) {
            this.assertSameCurrency(subtrahend);

            amount = calculator.subtract(amount, subtrahend.amount);
        }

        return new Money(amount, this.currency);
    }

    private assertOperand(operand: numeric): asserts operand is numeric {
        const operandType = typeof(operand);
        if (["string", "number"].includes(operandType) === false) {
            throw new Error(
                "Operand should be a numeric value, " + operandType + " given."
            );
        }
    }

    public multiply(multiplier: numeric, roundingMode: RoundingMode = RoundingMode.ROUND_HALF_UP): Money {
        this.assertOperand(multiplier);

        const product = this.round(
            this.calculator.multiply(this.amount, multiplier),
            roundingMode,
        );

        return this.newInstance(product);
    }

    public divide(divisor: numeric, roundingMode: RoundingMode = RoundingMode.ROUND_HALF_UP): Money {
        this.assertOperand(divisor);

        const divisorS = String(Num.fromNumber(divisor));

        if (this.calculator.compare(divisorS, "0") === 0) {
            throw new Error("Division by zero");
        }

        const quotient = this.round(
            this.calculator.divide(this.amount, divisorS),
            roundingMode,
        );

        return this.newInstance(quotient);
    }

    public mod(divisor: Money): Money {
        this.assertSameCurrency(divisor);

        return new Money(
            this.calculator.mod(this.amount, divisor.amount),
            this.currency,
        );
    }

    public allocate(ratios: number[]): Money[] {
        if (ratios.length === 0) {
            throw new Error("Cannot allocate to none, ratios cannot be an empty array");
        }

        let remainder = this.amount;
        const results: Money[] = [];
        const total = arraySum(ratios);

        if (total <= 0) {
            throw new Error("Cannot allocate to none, sum of ratios must be greater than zero");
        }

        for (const [key, ratio] of ratios.entries()) {
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
        const fractions = ratios.map((ratio: number): number => {
            const share = (ratio / total) * thisAmountInt;

            return share - Math.floor(share);
        });

        while (this.calculator.compare(remainder, "0") > 0) {
            const index = Object.keys(fractions).length > 0 ? arrayKeysWithSearch(fractions, Math.max(...fractions))[0] : 0;
            results[index] = results[index].newInstance(this.calculator.add(results[index].amount, "1"));
            remainder = this.calculator.subtract(remainder, "1");
            delete fractions[index];
        }

        return results;
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
            currency: this.currency,
        };
    }

    public static min(first: Money, ...collection: Money[]): Money {
        let min = first;

        for (const money of collection) {
            if (money.lessThan(min) === true) {
                min = money;
            }
        }

        return min;
    }

    public static max(first: Money, ...collection: Money[]): Money {
        let max = first;

        for (const money of collection) {
            if (money.greaterThan(max) === true) {
                max = money;
            }
        }

        return max;
    }

    public static sum(first: Money, ...collection: Money[]): Money {
        return first.add(...collection);
    }

    public static avg(first: Money, ...collection: Array<Money>): Money {
        const argCount = collection.length + 1;
        return first.add(...collection).divide(argCount);
    }

    public get calculator(): Calculator {
        return CalculatorRegistry.getCalculator();
    }
}
