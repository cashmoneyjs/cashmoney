import { Currency } from "../currency";
import { CurrencyList } from "../currencylist";

export const CODE = "XBT";
export const SYMBOL = "\xC9\x83";

export class BitcoinCurrencyList implements CurrencyList {
    public contains(currency: Currency): boolean {
        return currency.code === CODE;
    }

    public subunitFor(currency: Currency): number {
        if (currency.code !== CODE) {
            throw new Error(
                currency.code + " is not bitcoin and is not supported by this currency repository"
            );
        }

        return 8;
    }

    public *[Symbol.iterator](): Generator<Currency> {
        yield new Currency(CODE);
    }
}
