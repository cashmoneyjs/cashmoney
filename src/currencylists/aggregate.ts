import type Currency from "../currency";
import type CurrencyList from "../currencylist";

export default class AggregateCurrencyList implements CurrencyList {
    private readonly currencyLists: ReadonlyArray<CurrencyList>;

    public constructor(currencyLists: ReadonlyArray<CurrencyList>) {
        this.currencyLists = currencyLists;
    }

    public contains(currency: Currency): boolean {
        for (const currencyList of this.currencyLists) {
            if (currencyList.contains(currency) === true) {
                return true;
            }
        }

        return false;
    }

    public nameFor(currency: Currency): string {
        for (const currencyList of this.currencyLists) {
            if (currencyList.contains(currency) === true) {
                return currencyList.nameFor(currency);
            }
        }

        throw new Error(`Cannot find currency ${currency.code}.`);
    }

    public subunitFor(currency: Currency): number {
        for (const currencyList of this.currencyLists) {
            if (currencyList.contains(currency) === true) {
                return currencyList.subunitFor(currency);
            }
        }

        throw new Error(`Cannot find currency ${currency.code}.`);
    }

    public *[Symbol.iterator](): Generator<Currency> {
        for (const currencyList of this.currencyLists) {
            for (const currency of currencyList) {
                yield currency;
            }
        }
    }
}
