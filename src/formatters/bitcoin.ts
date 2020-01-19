import Num from "../number";
import Money from "../money";
import MoneyFormatter from "../formatter";
import CurrencyList from "../currencylist";
import { CODE as BITCOIN_CODE, SYMBOL as BITCOIN_SYMBOL } from "../currencylists/bitcoin";
import { stringPhpSubstr } from "../util";

export default class BitcoinMoneyFormatter implements MoneyFormatter {
    private fractionDigits: number;
    private currencyList: CurrencyList;

    public constructor(fractionDigits: number, currencyList: CurrencyList) {
        this.fractionDigits = fractionDigits;
        this.currencyList = currencyList;
    }

    public format(money: Money): string {
        if (money.currency.code !== BITCOIN_CODE) {
            throw new Error("Bitcoin Formatter can only format Bitcoin currency");
        }

        let valueBase = money.amount;
        let negative = false;

        if (valueBase[0] === "-") {
            negative = true;
            valueBase = stringPhpSubstr(valueBase, 1);
        }

        const subunit = this.currencyList.subunitFor(money.currency);
        valueBase = Num.roundMoneyValue(valueBase, this.fractionDigits, subunit);
        const valueLength = valueBase.length;

        let formatted: string;
        if (valueLength > subunit) {
            formatted = stringPhpSubstr(valueBase, 0, valueLength - subunit);

            if (subunit) {
                formatted += ".";
                formatted += stringPhpSubstr(valueBase, valueLength - subunit);
            }
        } else {
            formatted = "0." + "0".repeat(subunit - valueLength) + valueBase;
        }

        if (this.fractionDigits === 0) {
            formatted = stringPhpSubstr(formatted, 0, formatted.indexOf("."));
        } else if (this.fractionDigits > subunit) {
            formatted += "0".repeat(this.fractionDigits - subunit);
        } else if (this.fractionDigits < subunit) {
            const lastDigit = formatted.indexOf(".") + this.fractionDigits + 1;
            formatted = stringPhpSubstr(formatted, 0, lastDigit);
        }

        formatted = BITCOIN_SYMBOL + formatted;
        if (negative === true) {
            formatted = "-" + formatted;
        }

        return formatted;
    }
}
