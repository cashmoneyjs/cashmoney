import Currency from "../currency";
import CurrencyList from "../currencylist";

export interface ISOCurrencies {
    [code: string]: {
        alphabeticCode: string;
        currency: string;
        minorUnit: number;
        numericCode: number;
    };
}

export default class ISOCurrencyList implements CurrencyList {
    private readonly isoCurrencies: ISOCurrencies;

    public constructor(isoCurrencies: ISOCurrencies) {
        this.isoCurrencies = isoCurrencies;
    }

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
}
