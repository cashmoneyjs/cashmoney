import { Currency } from "../currency";
import { CurrencyList } from "../currencylist";

export class AggregateCurrencyList implements CurrencyList {
    private currencyLists: CurrencyList[];

    public constructor(currencyLists: CurrencyList[]) {
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

    public subunitFor(currency: Currency): number {
        for (const currencyList of this.currencyLists) {
            if (currencyList.contains(currency) === true) {
                return currencyList.subunitFor(currency);
            }
        }

        throw new Error("Cannot find currency " + currency.code);
    }

    public *[Symbol.iterator](): Generator<Currency> {
        for (const currencyList of this.currencyLists) {
            for (const currency of currencyList) {
                yield currency;
            }
        }
    }
}
