import { Num, numeric } from "@cashmoney/number";

import Currency from "./currency";

interface NamedRatios {
    [name: string]: number;
}

interface NamedMoneyMap {
    [name: string]: RoundedMoney;
}

export default class RoundedMoney {
    public readonly num: Num;
    public readonly subunit: number;
    public readonly currency: Currency;

    public constructor(amount: Num | numeric, subunit: number, currency: Currency) {
        if (amount instanceof Num) {
            this.num = amount;
        } else {
            this.num = new Num(amount);
        }

        if (subunit < this.num.fractionalPart.length) {
            throw new Error("Amount was not properly rounded.");
        }

        this.subunit = subunit;
        this.currency = currency;
    }

    private newInstance(amount: Num | numeric): RoundedMoney {
        return new RoundedMoney(amount, this.subunit, this.currency);
    }

    public toString(): string {
        return `${this.currency.code} ${this.amount}`;
    }

    public get amount(): string {
        let amountStr = this.num.toString();

        if (this.subunit > 0) {
            if (this.num.fractionalPart === "") {
                amountStr += ".";
            }

            amountStr += "0".repeat(this.subunit - this.num.fractionalPart.length);
        }

        return amountStr;
    }

    public isSameCurrency(other: RoundedMoney): boolean {
        return this.currency.equals(other.currency);
    }

    private assertSameCurrency(other: RoundedMoney): void {
        if (this.isSameCurrency(other) === false) {
            throw new Error("Currencies must be identical.");
        }
    }

    public isSamePrecision(other: RoundedMoney): boolean {
        return this.subunit === other.subunit;
    }

    private assertSamePrecision(other: RoundedMoney): void {
        if (this.isSamePrecision(other) === false) {
            throw new Error("Rounded precisions must be identical.");
        }
    }

    public equals(other: RoundedMoney): boolean {
        return this.isSameCurrency(other) && this.isSamePrecision(other) && this.num.equals(other.num);
    }

    public equalTo(other: RoundedMoney): boolean {
        return this.equals(other);
    }

    public equalsTo(other: RoundedMoney): boolean {
        return this.equals(other);
    }

    public isEqualTo(other: RoundedMoney): boolean {
        return this.equals(other);
    }

    public compare(other: RoundedMoney): number {
        this.assertSameCurrency(other);
        this.assertSamePrecision(other);

        return this.num.compare(other.num);
    }

    public greaterThan(other: RoundedMoney): boolean {
        return this.compare(other) > 0;
    }

    public isGreaterThan(other: RoundedMoney): boolean {
        return this.greaterThan(other);
    }

    public greaterThanOrEqual(other: RoundedMoney): boolean {
        return this.compare(other) >= 0;
    }

    public isGreaterThanOrEqualTo(other: RoundedMoney): boolean {
        return this.greaterThanOrEqual(other);
    }

    public lessThan(other: RoundedMoney): boolean {
        return this.compare(other) < 0;
    }

    public isLessThan(other: RoundedMoney): boolean {
        return this.lessThan(other);
    }

    public lessThanOrEqual(other: RoundedMoney): boolean {
        return this.compare(other) <= 0;
    }

    public isLessThanOrEqualTo(other: RoundedMoney): boolean {
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

    public add(...addends: RoundedMoney[]): RoundedMoney {
        const self = this;
        const genFunc = function*(): Generator<Num> {
            for (const addend of addends) {
                self.assertSameCurrency(addend);
                self.assertSamePrecision(addend);
                yield addend.num;
            }
        }
        return this.newInstance(Num.add(this.num, genFunc()));
    }

    public plus(...addends: RoundedMoney[]): RoundedMoney {
        return this.add(...addends);
    }

    public subtract(...subtrahends: RoundedMoney[]): RoundedMoney {
        const self = this;
        const genFunc = function*(): Generator<Num> {
            for (const subtrahend of subtrahends) {
                self.assertSameCurrency(subtrahend);
                self.assertSamePrecision(subtrahend);
                yield subtrahend.num;
            }
        };
        return this.newInstance(Num.subtract(this.num, genFunc()));
    }

    public minus(...subtrahends: RoundedMoney[]): RoundedMoney {
        return this.subtract(...subtrahends);
    }

    public absolute(): RoundedMoney {
        return this.newInstance(this.num.absolute());
    }

    public abs(): RoundedMoney {
        return this.absolute();
    }

    public negative(): RoundedMoney {
        return this.newInstance(this.num.negative());
    }

    public negate(): RoundedMoney {
        return this.negative();
    }

    public negated(): RoundedMoney {
        return this.negative();
    }

    public allocate(ratios: number[]): RoundedMoney[] {
        const allocations: RoundedMoney[] = [];
        const intNum = this.num.shiftRight(this.subunit);

        for (const allocatedIntNum of intNum.allocate(ratios)) {
            const allocatedNum = allocatedIntNum.shiftLeft(this.subunit);
            allocations.push(this.newInstance(allocatedNum));
        }

        return allocations;
    }

    public allocateNamed(ratios: NamedRatios): NamedMoneyMap {
        const allocations: NamedMoneyMap = {};
        const intNum = this.num.shiftRight(this.subunit);

        for (const [name, allocatedIntNum] of Object.entries(intNum.allocateNamed(ratios))) {
            const allocatedNum = allocatedIntNum.shiftLeft(this.subunit);
            allocations[name] = this.newInstance(allocatedNum);
        }

        return allocations;
    }

    public allocateTo(n: number): RoundedMoney[] {
        const allocations: RoundedMoney[] = [];
        const intNum = this.num.shiftRight(this.subunit);

        for (const allocatedIntNum of intNum.allocateTo(n)) {
            const allocatedNum = allocatedIntNum.shiftLeft(this.subunit);
            allocations.push(this.newInstance(allocatedNum));
        }

        return allocations;
    }

    public ratioOf(other: RoundedMoney): Num {
        return this.num.ratioOf(other.num);
    }

    public toJSON(): object {
        return {
            amount: this.amount,
            subunit: this.subunit,
            currency: this.currency.toJSON(),
        };
    }

    public static min(...collection: RoundedMoney[]): RoundedMoney {
        if (collection.length === 0) {
            throw new Error("Must pass at least one money object.");
        }

        let min = collection.shift() as RoundedMoney;

        for (const money of collection) {
            if (money.lessThan(min) === true) {
                min = money;
            }
        }

        return min;
    }

    public static max(...collection: RoundedMoney[]): RoundedMoney {
        if (collection.length === 0) {
            throw new Error("Must pass at least one money object.");
        }

        let max = collection.shift() as RoundedMoney;

        for (const money of collection) {
            if (money.greaterThan(max) === true) {
                max = money;
            }
        }

        return max;
    }

    public static sum(...collection: RoundedMoney[]): RoundedMoney {
        if (collection.length === 0) {
            throw new Error("Must pass at least one money object.");
        }

        const first = collection.shift() as RoundedMoney;
        return first.add(...collection);
    }
}
