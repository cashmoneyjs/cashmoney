import Currency from "../currency";
import CurrencyList from "../currencylist";

interface CustomCurrencies {
    [currencyCode: string]: number;
}

export default class CustomCurrencyList implements CurrencyList {
    private currencies: CustomCurrencies;

    public constructor(currencies: CustomCurrencies) {
        for (const [code, subunit] of Object.entries(currencies)) {
            if (Number.isInteger(subunit) === false || subunit < 0) {
                throw new Error(
                    "Currency " + code + " does not have a valid minor unit. Must be a positive integer."
                );
            }
        }

        this.currencies = currencies;
    }

    public contains(currency: Currency): boolean {
        return typeof this.currencies[currency.code] !== "undefined";
    }

    public subunitFor(currency: Currency): number {
        if (this.contains(currency) === false) {
            throw new Error("Cannot find currency " + currency.code);
        }

        return this.currencies[currency.code];
    }

    public *[Symbol.iterator](): Generator<Currency> {
        for (const code of Object.keys(this.currencies)) {
            yield new Currency(code);
        }
    }
}
