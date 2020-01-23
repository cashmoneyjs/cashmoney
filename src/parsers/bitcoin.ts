import { trimStart, trimEnd } from "trim-strings";

import Money from "../money";
import Currency from "../currency";
import MoneyParser from "../parser";
import { CODE as BITCOIN_CODE, SYMBOL as BITCOIN_SYMBOL } from "../currencylists/bitcoin";
import { stringPhpSubstr } from "../util";

const BITCOIN_SYMBOL_PATTERN = new RegExp(BITCOIN_SYMBOL, "g");

export default class BitcoinMoneyParser implements MoneyParser {
    private readonly fractionDigits: number;

    public constructor(fractionDigits: number) {
        this.fractionDigits = fractionDigits;
    }

    parse(money: string, forceCurrency?: Currency): Money {
        if (money.indexOf(BITCOIN_SYMBOL) === -1) {
            throw new Error("Value cannot be parsed as Bitcoin");
        }

        if (!forceCurrency) {
            forceCurrency = new Currency(BITCOIN_CODE);
        }

        let decimal = money.replace(BITCOIN_SYMBOL_PATTERN, "");
        const decimalSeparator = decimal.indexOf(".");

        if (decimalSeparator !== -1) {
            decimal = trimEnd(decimal, "0");
            const lengthDecimal = decimal.length;
            decimal = decimal.replace(/\./g, "");
            decimal += "0".repeat((lengthDecimal - decimalSeparator - this.fractionDigits - 1) * -1);
        } else {
            decimal += "0".repeat(this.fractionDigits);
        }

        if (stringPhpSubstr(decimal, 0, 1) === "-") {
            decimal = "-" + trimStart(stringPhpSubstr(decimal, 1), "0");
        } else {
            decimal = trimStart(decimal, "0");
        }

        if (decimal === "") {
            decimal = "0";
        }

        return new Money(decimal, forceCurrency);
    }
}
