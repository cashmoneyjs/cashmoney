import MoneyParser from "../parser";
import PreciseMoney from "../precisemoney";
import Currency from "../currency";
import CurrencyList from "../currencylist";

const INTEGER_PATTERN_CODE_PREFIX = /^([A-Z]{3})\s(-?(?:0|[1-9]\d*))$/;
const INTEGER_PATTERN_CODE_SUFFIX = /^(-?(?:0|[1-9]\d*))\s([A-Z]{3})$/;
const DECIMAL_PATTERN_CODE_PREFIX = /^([A-Z]{3})\s(-?(?:0|[1-9]\d*)[\.,](?:\d+))$/;
const DECIMAL_PATTERN_CODE_SUFFIX = /^(-?(?:0|[1-9]\d*)[\.,](?:\d+))\s([A-Z]{3})$/;

const CODE_PREFIX_PATTERNS = [
    INTEGER_PATTERN_CODE_PREFIX,
    DECIMAL_PATTERN_CODE_PREFIX,
] as ReadonlyArray<RegExp>;
const CODE_SUFFIX_PATTERNS = [
    INTEGER_PATTERN_CODE_SUFFIX,
    DECIMAL_PATTERN_CODE_SUFFIX,
] as ReadonlyArray<RegExp>;

export default class ISOCodeMoneyParser implements MoneyParser {
    private readonly currencyList: CurrencyList | null;

    public constructor(currencyList?: CurrencyList) {
        this.currencyList = currencyList || null;
    }

    public parse(input: string): PreciseMoney {
        input = input.trim();
        if (input === "") {
            throw new Error("ISOCodeMoneyParser cannot parse empty input.");
        }

        for (const pattern of CODE_PREFIX_PATTERNS) {
            const matches = pattern.exec(input);
            if (matches) {
                return this.make(matches[2], matches[1]);
            }
        }

        for (const pattern of CODE_SUFFIX_PATTERNS) {
            const matches = pattern.exec(input);
            if (matches) {
                return this.make(matches[1], matches[2]);
            }
        }

        throw new Error(`Cannot parse '${input}' to Money.`);
    }

    private make(amount: string, currencyCode: string): PreciseMoney {
        const currency = new Currency(currencyCode);
        if (this.currencyList) {
            if (this.currencyList.contains(currency) === false) {
                throw new Error(`Unknown currency code '${currencyCode}'.`);
            }
        }

        amount = amount.replace(",", ".");
        return new PreciseMoney(amount, currency);
    }
}
