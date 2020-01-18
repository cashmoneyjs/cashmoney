import { Money } from "../money";
import MoneyFormatter from "../formatter";
import CurrencyList from "../currencylist";

export default class DecimalMoneyFormatter implements MoneyFormatter {
    private currencyList: CurrencyList;

    public constructor(currencyList: CurrencyList) {
        this.currencyList = currencyList;
    }

    public format(money: Money): string {
        let valueBase = money.amount;
        let negative = false;

        if (valueBase[0] === "-") {
            negative = true;
            valueBase = valueBase.substr(1);
        }

        const subunit = this.currencyList.subunitFor(money.currency);
        const valueLength = valueBase.length;

        let formatted: string;
        if (valueLength > subunit) {
            formatted = valueBase.substr(0, valueLength - subunit);
            const decimalDigits = valueBase.substr(valueLength - subunit);

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
