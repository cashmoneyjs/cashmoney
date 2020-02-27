import MoneyParser from "../parser";
import PreciseMoney from "../precisemoney";
import Currency from "../currency";

interface SymbolMapping {
    [symbol: string]: string;
}

const PREFIX_PATTERN = /^([^\s\.,0-9-]{1,3})\s?(-?(?:0|[1-9]\d*)[\.,](?:\d+))$/;
const SUFFIX_PATTERN = /^(-?(?:0|[1-9]\d*)[\.,](?:\d+))\s?([^\s\.,0-9-]{1,3})$/;

export default class SymbolMoneyParser implements MoneyParser {
    private readonly symbolMapping: Readonly<SymbolMapping>;

    public constructor(symbolMapping: SymbolMapping) {
        if (Object.keys(symbolMapping).length === 0) {
            throw new Error("Cannot initialise symbol money parser with no symbol-to-currency mappings.")
        }

        this.symbolMapping = Object.assign({}, symbolMapping);
    }

    public parse(input: string): PreciseMoney {
        input = input.trim();
        if (input === "") {
            throw new Error("SymbolMoneyParser cannot parse empty input.");
        }

        const prefixMatches = PREFIX_PATTERN.exec(input);
        if (prefixMatches) {
            return this.make(prefixMatches[2], prefixMatches[1]);
        }

        const suffixMatches = SUFFIX_PATTERN.exec(input);
        if (suffixMatches) {
            return this.make(suffixMatches[1], suffixMatches[2]);
        }

        throw new Error(`Cannot parse '${input}' to Money.`);
    }

    private make(amount: string, symbol: string): PreciseMoney {
        if (typeof this.symbolMapping[symbol] === "undefined") {
            throw new Error(`Unrecognised currency symbol '${symbol}'.`);
        }

        const currency = new Currency(this.symbolMapping[symbol]);

        amount = amount.replace(",", ".");
        return new PreciseMoney(amount, currency);
    }
}
