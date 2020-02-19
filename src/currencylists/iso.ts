import Currency from "../currency";
import CurrencyList from "../currencylist";

export interface ISOCurrencyData {
    alphabeticCode: string;
    currency: string;
    minorUnit: number;
    numericCode: number;
}

export interface ISOCurrencies {
    [currencyCode: string]: ISOCurrencyData;
}

export default class ISOCurrencyList implements CurrencyList {
    private static readonly currencyData: ISOCurrencies = {};

    public contains(currency: Currency): boolean {
        return typeof this.isoCurrencies[currency.code] !== "undefined";
    }

    public nameFor(currency: Currency): string {
        if (this.contains(currency) === false) {
            throw new Error(`Cannot find ISO currency ${currency.code}.`);
        }

        return this.isoCurrencies[currency.code]["currency"];
    }

    public subunitFor(currency: Currency): number {
        if (this.contains(currency) === false) {
            throw new Error(`Cannot find ISO currency ${currency.code}.`);
        }

        return this.isoCurrencies[currency.code]["minorUnit"];
    }

    public numericCodeFor(currency: Currency): number {
        if (this.contains(currency) === false) {
            throw new Error(`Cannot find ISO currency ${currency.code}.`);
        }

        return this.isoCurrencies[currency.code]["numericCode"];
    }

    public *[Symbol.iterator](): Generator<Currency> {
        for (const code of Object.keys(this.isoCurrencies)) {
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
