import { trimStart } from "trim-strings";

import { Money } from "../money";
import Currency from "../currency";
import Num from "../number";
import CurrencyList from "../currencylist";
import MoneyParser from "../parser";
import { stringPhpSubstr } from "../util";

//const DECIMAL_PATTERN = /^(?P<sign>-)?(?P<digits>0|[1-9]\d*)?\.?(?P<fraction>\d+)?$/;
const DECIMAL_PATTERN = /^(-)?(0|[1-9]\d*)?\.?(\d+)?$/;

export default class DecimalMoneyParser implements MoneyParser {
    private currencyList: CurrencyList;

    public constructor(currencyList: CurrencyList) {
        this.currencyList = currencyList;
    }

    parse(money: string, forceCurrency?: Currency): Money {
        if (!forceCurrency) {
            throw new Error("DecimalMoneyParser cannot parse currency symbols. Use forceCurrency argument");
        }

        let decimal = money.trim();

        if (decimal === "") {
            return new Money(0, forceCurrency);
        }

        const subunit = this.currencyList.subunitFor(forceCurrency);

        const matches = DECIMAL_PATTERN.exec(decimal);
        if (!matches || !(matches[2] || matches[3])) {
            throw new Error("Cannot parse " + decimal + " to Money.");
        }

        const negative = Boolean(matches[1] && matches[1] === "-");

        decimal = matches[2] || "";

        if (negative === true) {
            decimal = "-" + decimal;
        }

        if (Boolean(matches[3])) {
            const fractionDigits = matches[3].length;
            decimal += matches[3];
            decimal = Num.roundMoneyValue(decimal, subunit, fractionDigits);

            if (fractionDigits > subunit) {
                decimal = stringPhpSubstr(decimal, 0, subunit - fractionDigits);
            } else if (fractionDigits < subunit) {
                decimal += "0".repeat(subunit - fractionDigits);
            }
        } else {
            decimal += "0".repeat(subunit);
        }

        if (negative === true) {
            decimal = "-" + trimStart(stringPhpSubstr(decimal, 1), "0");
        } else {
            decimal = trimStart(decimal, "0");
        }

        if (decimal === "" || decimal === "-") {
            decimal = "0";
        }

        return new Money(decimal, forceCurrency);
    }
}
