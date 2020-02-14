import { Num, numeric } from "@cashmoney/number";
import Currency from "./currency";

const currency = "([A-Z]{2,3})";
const ratio = "([0-9]*\.?[0-9]+)";
const pattern = currency + "/" + currency + " " + ratio;
const isoRegex = new RegExp(pattern);

export default class CurrencyPair {
    public readonly baseCurrency: Currency;
    public readonly counterCurrency: Currency;
    public readonly conversionRatio: Num;

    public constructor(baseCurrency: Currency, counterCurrency: Currency, conversionRatio: Num | numeric) {
        this.baseCurrency = baseCurrency;
        this.counterCurrency = counterCurrency;

        if (conversionRatio instanceof Num) {
            this.conversionRatio = conversionRatio;
        } else {
            this.conversionRatio = new Num(conversionRatio);
        }
    }

    public static createFromIso(iso: string): CurrencyPair {
        const match = isoRegex.exec(iso);
        if (!match) {
            throw new Error(
                "Cannot create currency pair from ISO string '" + iso + "', format of string is invalid."
            );
        }

        const ratio = parseFloat(match[3]);
        if (isNaN(ratio)) {
            throw new Error(
                "Cannot create currency pair from ISO string '" + iso + "', conversion ratio is not a valid number."
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
            this.conversionRatio.equals(other.conversionRatio);
    }

    public toJSON(): object {
        return {
            baseCurrency: this.baseCurrency,
            counterCurrency: this.counterCurrency,
            ratio: this.conversionRatio.toJSON(),
        };
    }
}
