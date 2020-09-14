import Currency from "../currency";
import type CurrencyList from "../currencylist";

export const CODE = "XBT";
export const SYMBOL = "\xC9\x83";
export const SUBUNIT = 8;

export default class BitcoinCurrencyList implements CurrencyList {
    public contains(currency: Currency): boolean {
        return currency.code === CODE;
    }

    public nameFor(currency: Currency): string {
        if (currency.code !== CODE) {
            throw new Error(
                `${currency.code} is not bitcoin and is not supported by this currency list.`
            );
        }

        return "Bitcoin";
    }

    public subunitFor(currency: Currency): number {
        if (currency.code !== CODE) {
            throw new Error(
                `${currency.code} is not bitcoin and is not supported by this currency list.`
            );
        }

        return SUBUNIT;
    }

    public *[Symbol.iterator](): Generator<Currency> {
        yield new Currency(CODE);
    }
}
