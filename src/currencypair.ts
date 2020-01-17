import Currency from "./currency";

const currency = "([A-Z]{2,3})";
const ratio = "([0-9]*\.?[0-9]+)";
const pattern = currency + "/" + currency + " " + ratio;
const isoRegex = new RegExp(pattern);

export default class CurrencyPair {
    public readonly baseCurrency: Currency;
    public readonly counterCurrency: Currency;
    public readonly conversionRatio: number;

    public constructor(baseCurrency: Currency, counterCurrency: Currency, conversionRatio: number) {
        this.baseCurrency = baseCurrency;
        this.counterCurrency = counterCurrency;
        this.conversionRatio = conversionRatio;
    }

    public static createFromIso(iso: string): CurrencyPair {
        const match = isoRegex.exec(iso);
        if (!match) {
            throw new Error(
                "Cannot create currency pair from ISO string '" + iso + "', format of string is invalid"
            );
        }

        const ratio = parseFloat(match[3]);
        if (isNaN(ratio)) {
            throw new Error(
                "Cannot create currency pair from ISO string '" + iso + "', conversion ratio is not a valid number"
            );
        }

        return new CurrencyPair(
            new Currency(match[1]),
            new Currency(match[2]),
            ratio,
        );
    }

    public equals(other: CurrencyPair): boolean {
        return this.baseCurrency.equals(other.baseCurrency) &&
            this.counterCurrency.equals(other.counterCurrency) &&
            this.conversionRatio === other.conversionRatio;
    }

    public toJSON(): object {
        return {
            baseCurrency: this.baseCurrency,
            counterCurrency: this.counterCurrency,
            ratio: this.conversionRatio,
        };
    }
}
