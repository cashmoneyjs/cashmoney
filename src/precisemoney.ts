import { Num, RoundingMode, numeric } from "@cashmoney/number";

import Currency from "./currency";
import RoundedMoney from "./roundedmoney";

export default class PreciseMoney {
    public readonly num: Num;
    public readonly currency: Currency;

    public constructor(amount: Num | numeric, currency: Currency) {
        if (amount instanceof Num) {
            this.num = amount;
        } else {
            this.num = new Num(amount);
        }

        this.currency = currency;
    }

    public static fromArray(amounts: (Num | numeric)[], currency: Currency): PreciseMoney[] {
        return amounts.map(amount => new PreciseMoney(amount, currency));
    }

    private newInstance(amount: Num | numeric): PreciseMoney {
        return new PreciseMoney(amount, this.currency);
    }

    public toString(): string {
        return `${this.currency.code} ${this.amount}`;
    }

    public get amount(): string {
        return this.num.toString();
    }

    public getRoundedAmount(decimalPlaces: number, roundingMode: RoundingMode = RoundingMode.ROUND_HALF_EVEN): string {
        return this.num.toRoundedString(decimalPlaces, roundingMode);
    }

    public isSameCurrency(other: PreciseMoney): boolean {
        return this.currency.equals(other.currency);
    }

    private assertSameCurrency(other: PreciseMoney): void {
        if (this.isSameCurrency(other) === false) {
            throw new Error("Currencies must be identical.");
        }
    }

    public equals(other: PreciseMoney): boolean {
        return this.isSameCurrency(other) && this.num.equals(other.num);
    }

    public equalTo(other: PreciseMoney): boolean {
        return this.equals(other);
    }

    public equalsTo(other: PreciseMoney): boolean {
        return this.equals(other);
    }

    public isEqualTo(other: PreciseMoney): boolean {
        return this.equals(other);
    }

    public compare(other: PreciseMoney): number {
        this.assertSameCurrency(other);

        return this.num.compare(other.num);
    }

    public greaterThan(other: PreciseMoney): boolean {
        return this.compare(other) > 0;
    }

    public isGreaterThan(other: PreciseMoney): boolean {
        return this.greaterThan(other);
    }

    public greaterThanOrEqual(other: PreciseMoney): boolean {
        return this.compare(other) >= 0;
    }

    public isGreaterThanOrEqualTo(other: PreciseMoney): boolean {
        return this.greaterThanOrEqual(other);
    }

    public lessThan(other: PreciseMoney): boolean {
        return this.compare(other) < 0;
    }

    public isLessThan(other: PreciseMoney): boolean {
        return this.lessThan(other);
    }

    public lessThanOrEqual(other: PreciseMoney): boolean {
        return this.compare(other) <= 0;
    }

    public isLessThanOrEqualTo(other: PreciseMoney): boolean {
        return this.lessThanOrEqual(other);
    }

    public get isZero(): boolean {
        return this.num.isZero;
    }

    public get isPositive(): boolean {
        return this.num.isPositive;
    }

    public get isNegative(): boolean {
        return this.num.isNegative;
    }

    public add(...addends: PreciseMoney[]): PreciseMoney {
        const self = this;
        const genFunc = function*(): Generator<Num> {
            for (const addend of addends) {
                self.assertSameCurrency(addend);
                yield addend.num;
            }
        };
        return this.newInstance(Num.add(this.num, genFunc()));
    }

    public plus(...addends: PreciseMoney[]): PreciseMoney {
        return this.add(...addends);
    }

    public subtract(...subtrahends: PreciseMoney[]): PreciseMoney {
        const self = this;
        const genFunc = function*(): Generator<Num> {
            for (const subtrahend of subtrahends) {
                self.assertSameCurrency(subtrahend);
                yield subtrahend.num;
            }
        };
        return this.newInstance(Num.subtract(this.num, genFunc()));
    }

    public minus(...subtrahends: PreciseMoney[]): PreciseMoney {
        return this.subtract(...subtrahends);
    }

    public multiply(multiplier: Num | numeric): PreciseMoney {
        return this.newInstance(this.num.multiply(multiplier));
    }

    public times(multiplier: Num | numeric): PreciseMoney {
        return this.multiply(multiplier);
    }

    public multipliedBy(multiplier: Num | numeric): PreciseMoney {
        return this.multiply(multiplier);
    }

    public divide(divisor: Num | numeric): PreciseMoney {
        return this.newInstance(this.num.divide(divisor));
    }

    public dividedBy(divisor: Num | numeric): PreciseMoney {
        return this.divide(divisor);
    }

    public percentage(percent: number): PreciseMoney {
        return this.newInstance(this.num.percent(percent));
    }

    public percent(percent: number): PreciseMoney {
        return this.percentage(percent);
    }

    public subtractPercentage(percent: number): PreciseMoney {
        return this.newInstance(this.num.subtractPercent(percent));
    }

    public subtractPercent(percent: number): PreciseMoney {
        return this.subtractPercentage(percent);
    }

    public absolute(): PreciseMoney {
        return this.newInstance(this.num.absolute());
    }

    public abs(): PreciseMoney {
        return this.absolute();
    }

    public negative(): PreciseMoney {
        return this.newInstance(this.num.negative());
    }

    public negate(): PreciseMoney {
        return this.negative();
    }

    public negated(): PreciseMoney {
        return this.negative();
    }

    public mod(divisor: PreciseMoney): PreciseMoney {
        this.assertSameCurrency(divisor);

        return this.newInstance(this.num.mod(divisor.num));
    }

    public modulo(divisor: PreciseMoney): PreciseMoney {
        return this.mod(divisor);
    }

    public ratioOf(other: PreciseMoney): Num {
        return this.num.ratioOf(other.num);
    }

    public roundToDecimalPlaces(places: number, roundingMode: RoundingMode = RoundingMode.ROUND_HALF_EVEN): RoundedMoney {
        return new RoundedMoney(
            this.num.roundToDecimalPlaces(places, roundingMode),
            places,
            this.currency,
        );
    }

    public toJSON(): object {
        return {
            amount: this.amount,
            currency: this.currency.toJSON(),
        };
    }

    public static min(...collection: PreciseMoney[]): PreciseMoney {
        if (collection.length === 0) {
            throw new Error("Must pass at least one money object.");
        }

        let min = collection.shift() as PreciseMoney;

        for (const money of collection) {
            if (money.lessThan(min) === true) {
                min = money;
            }
        }

        return min;
    }

    public static max(...collection: PreciseMoney[]): PreciseMoney {
        if (collection.length === 0) {
            throw new Error("Must pass at least one money object.");
        }

        let max = collection.shift() as PreciseMoney;

        for (const money of collection) {
            if (money.greaterThan(max) === true) {
                max = money;
            }
        }

        return max;
    }

    public static sum(...collection: PreciseMoney[]): PreciseMoney {
        if (collection.length === 0) {
            throw new Error("Must pass at least one money object.");
        }

        const first = collection.shift() as PreciseMoney;
        return first.add(...collection);
    }

    public static avg(...collection: PreciseMoney[]): PreciseMoney {
        const argCount = collection.length;
        if (argCount === 0) {
            throw new Error("Must pass at least one money object.");
        }

        const first = collection.shift() as PreciseMoney;
        return first.add(...collection).divide(argCount);
    }
}
