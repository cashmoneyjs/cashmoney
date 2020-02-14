import { Matcher } from "alsatian";
import PreciseMoney from "./precisemoney";
import RoundedMoney from "./roundedmoney";
import Currency from "./currency";
import CurrencyPair from "./currencypair";

export class PreciseMoneyMatcher extends Matcher<PreciseMoney> {
    public toBe(other: PreciseMoney) {
        this._registerMatcher(
            (this.actualValue.equals(other)) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to equal ${JSON.stringify(other)}.`,
            other
        );
    }

    public toEqual(other: PreciseMoney) {
        this.toBe(other);
    }

    public toBeLessThan(other: PreciseMoney) {
        this._registerMatcher(
            (this.actualValue.lessThan(other)) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to be less than ${JSON.stringify(other)}.`,
            other
        );
    }

    public toBeLessThanOrEqual(other: PreciseMoney) {
        this._registerMatcher(
            (this.actualValue.lessThanOrEqual(other)) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to be less than or equal to ${JSON.stringify(other)}.`,
            other
        );
    }

    public toBeGreaterThan(other: PreciseMoney) {
        this._registerMatcher(
            (this.actualValue.greaterThan(other)) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to be greater than ${JSON.stringify(other)}.`,
            other
        );
    }

    public toBeGreaterThanOrEqual(other: PreciseMoney) {
        this._registerMatcher(
            (this.actualValue.greaterThanOrEqual(other)) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to be greater than or equal to ${JSON.stringify(other)}.`,
            other
        );
    }

    public toHaveSameCurrency(other: PreciseMoney) {
        this._registerMatcher(
            (this.actualValue.isSameCurrency(other)) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to have the same currency as ${JSON.stringify(other)}.`,
            other
        );
    }

    public toBeZero() {
        this._registerMatcher(
            (this.actualValue.isZero) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to be zero.`,
            this.shouldMatch ? "zero" : "not zero"
        );
    }

    public toBePositive() {
        this._registerMatcher(
            (this.actualValue.isPositive) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to be positive.`,
            this.shouldMatch ? "positive" : "negative"
        );
    }

    public toBeNegative() {
        this._registerMatcher(
            (this.actualValue.isNegative) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to be negative.`,
            this.shouldMatch ? "negative" : "positive"
        );
    }
}

export class RoundedMoneyMatcher extends Matcher<RoundedMoney> {
    public toBe(other: RoundedMoney) {
        this._registerMatcher(
            (this.actualValue.equals(other)) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to equal ${JSON.stringify(other)}.`,
            other
        );
    }

    public toEqual(other: RoundedMoney) {
        this.toBe(other);
    }

    public toBeLessThan(other: RoundedMoney) {
        this._registerMatcher(
            (this.actualValue.lessThan(other)) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to be less than ${JSON.stringify(other)}.`,
            other
        );
    }

    public toBeLessThanOrEqual(other: RoundedMoney) {
        this._registerMatcher(
            (this.actualValue.lessThanOrEqual(other)) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to be less than or equal to ${JSON.stringify(other)}.`,
            other
        );
    }

    public toBeGreaterThan(other: RoundedMoney) {
        this._registerMatcher(
            (this.actualValue.greaterThan(other)) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to be greater than ${JSON.stringify(other)}.`,
            other
        );
    }

    public toBeGreaterThanOrEqual(other: RoundedMoney) {
        this._registerMatcher(
            (this.actualValue.greaterThanOrEqual(other)) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to be greater than or equal to ${JSON.stringify(other)}.`,
            other
        );
    }

    public toHaveSameCurrency(other: RoundedMoney) {
        this._registerMatcher(
            (this.actualValue.isSameCurrency(other)) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to have the same currency as ${JSON.stringify(other)}.`,
            other
        );
    }

    public toBeZero() {
        this._registerMatcher(
            (this.actualValue.isZero) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to be zero.`,
            this.shouldMatch ? "zero" : "not zero"
        );
    }

    public toBePositive() {
        this._registerMatcher(
            (this.actualValue.isPositive) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to be positive.`,
            this.shouldMatch ? "positive" : "negative"
        );
    }

    public toBeNegative() {
        this._registerMatcher(
            (this.actualValue.isNegative) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to be negative.`,
            this.shouldMatch ? "negative" : "positive"
        );
    }
}

export class CurrencyMatcher extends Matcher<Currency> {
    public toBe(other: Currency) {
        this._registerMatcher(
            (this.actualValue.equals(other)) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to equal ${JSON.stringify(other)}.`,
            other
        );
    }

    public toEqual(other: Currency) {
        this.toBe(other);
    }
}

export class CurrencyPairMatcher extends Matcher<CurrencyPair> {
    public toBe(other: CurrencyPair) {
        this._registerMatcher(
            (this.actualValue.equals(other)) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to equal ${JSON.stringify(other)}.`,
            other
        );
    }

    public toEqual(other: CurrencyPair) {
        this.toBe(other);
    }
}
