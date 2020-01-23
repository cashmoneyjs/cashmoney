import Money from "../money";
import MoneyFormatter from "../formatter";
import CurrencyList from "../currencylist";
import { stringPhpSubstr, stringPhpSubstrBroke } from "../util";

export default class DecimalMoneyFormatter implements MoneyFormatter {
    private readonly currencyList: CurrencyList;

    public constructor(currencyList: CurrencyList) {
        this.currencyList = currencyList;
    }

    public format(money: Money): string {
        let valueBase = money.amount;
        let negative = false;

        if (valueBase[0] === "-") {
            negative = true;
            valueBase = stringPhpSubstr(valueBase, 1);
        }

        const subunit = this.currencyList.subunitFor(money.currency);
        const valueLength = valueBase.length;

        let formatted: string;
        if (valueLength > subunit) {
            formatted = stringPhpSubstrBroke(valueBase, 0, valueLength - subunit);
            const decimalDigits = stringPhpSubstrBroke(valueBase, valueLength - subunit);

            if (decimalDigits.length > 0) {
                formatted += "." + decimalDigits;
            }
        } else {
            formatted = "0." + "0".repeat(subunit - valueLength) + valueBase;
        }

        if (negative === true) {
            formatted = "-" + formatted;
        }

        return formatted;
    }
}
