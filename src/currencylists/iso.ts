import type {
    CurrencyData as ISOCurrencyData,
    CurrencyDataMap as ISOCurrencies,
} from "@cashmoney/iso-currency-contracts";

import Currency from "../currency";
import type CurrencyList from "../currencylist";

export default class ISOCurrencyList implements CurrencyList {
    private static readonly currencyData: ISOCurrencies = {};

    public contains(currency: Currency): boolean {
        return typeof ISOCurrencyList.currencyData[currency.code] !== "undefined";
    }

    public nameFor(currency: Currency): string {
        if (this.contains(currency) === false) {
            throw new Error(`Cannot find ISO currency ${currency.code}.`);
        }

        return ISOCurrencyList.currencyData[currency.code]["currency"];
    }

    public subunitFor(currency: Currency): number {
        if (this.contains(currency) === false) {
            throw new Error(`Cannot find ISO currency ${currency.code}.`);
        }

        return ISOCurrencyList.currencyData[currency.code]["minorUnit"];
    }

    public numericCodeFor(currency: Currency): number {
        if (this.contains(currency) === false) {
            throw new Error(`Cannot find ISO currency ${currency.code}.`);
        }

        return ISOCurrencyList.currencyData[currency.code]["numericCode"];
    }

    public *[Symbol.iterator](): Generator<Currency> {
        for (const code of Object.keys(ISOCurrencyList.currencyData)) {
            yield new Currency(code);
        }
    }

    public static registerCurrency(currencyCode: string, currencyData: ISOCurrencyData): void {
        ISOCurrencyList.currencyData[currencyCode] = Object.assign({}, currencyData);
    }

    public static registerCurrencies(currenciesData: ISOCurrencies): void {
        for (const [currencyCode, currencyData] of Object.entries(currenciesData)) {
            ISOCurrencyList.registerCurrency(currencyCode, currencyData);
        }
    }
}
