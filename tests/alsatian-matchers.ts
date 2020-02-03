import { Matcher } from "alsatian";
import Money from "src/money";
import Currency from "src/currency";
import CurrencyPair from "src/currencypair";

export class MoneyMatcher extends Matcher<Money> {
    public toBe(other: Money) {
        this._registerMatcher(
            (this.actualValue.equals(other)) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to equal ${JSON.stringify(other)}.`,
            other
        );
    }

    public toEqual(other: Money) {
        this.toBe(other);
    }

    public toBeLessThan(other: Money) {
        this._registerMatcher(
            (this.actualValue.lessThan(other)) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to be less than ${JSON.stringify(other)}.`,
            other
        );
    }

    public toBeLessThanOrEqual(other: Money) {
        this._registerMatcher(
            (this.actualValue.lessThanOrEqual(other)) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to be less than or equal to ${JSON.stringify(other)}.`,
            other
        );
    }

    public toBeGreaterThan(other: Money) {
        this._registerMatcher(
            (this.actualValue.greaterThan(other)) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to be greater than ${JSON.stringify(other)}.`,
            other
        );
    }

    public toBeGreaterThanOrEqual(other: Money) {
        this._registerMatcher(
            (this.actualValue.greaterThanOrEqual(other)) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to be greater than or equal to ${JSON.stringify(other)}.`,
            other
        );
    }

    public toHaveSameCurrency(other: Money) {
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
