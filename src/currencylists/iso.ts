import { Currency } from "../currency";
import { CurrencyList } from "../currencylist";

export class ISOCurrencyList implements CurrencyList {
    public contains(currency: Currency): boolean {
        return false;
    }

    public subunitFor(currency: Currency): number {
        if (this.contains(currency) === false) {
            throw new Error("Cannot find ISO currency " + currency.code);
        }

        return 0;
    }

    public numericCodeFor(currency: Currency): number {
        if (this.contains(currency) === false) {
            throw new Error("Cannot find ISO currency " + currency.code);
        }

        return 0;
    }

    public *[Symbol.iterator](): Generator<Currency> {
    }
}
