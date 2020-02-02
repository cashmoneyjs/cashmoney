import Money from "../money";
import MoneyFormatter from "../formatter";
import CurrencyList from "../currencylist";
import { stringPhpSubstr, stringPhpSubstrBroke } from "../_util";

interface IntlNumberFormatterSettings {
    locales?: string | string[];
    style?: "decimal" | "currency";
    currencyDisplay?: "symbol" | "code" | "name";
    useGrouping?: boolean;
    minFractionDigits?: number;
    maxFractionDigits?: number;
    normaliseWhitespace?: boolean;
}

export default class IntlMoneyFormatter implements MoneyFormatter {
    private readonly currencyList: CurrencyList;
    private readonly locales?: string | string[];
    private readonly style: string = "decimal";
    private readonly currencyDisplay: string = "symbol";
    private readonly useGrouping: boolean = true;
    private readonly minFractionDigits?: number;
    private readonly maxFractionDigits?: number;
    private readonly normaliseWhitespace: boolean = false;

    public constructor(
        currencyList: CurrencyList,
        formatOptions: IntlNumberFormatterSettings = {},
    ) {
        this.currencyList = currencyList;

        if (formatOptions.locales !== undefined) {
            this.locales = formatOptions.locales;
        }
        if (formatOptions.useGrouping !== undefined) {
            this.useGrouping = formatOptions.useGrouping;
        }
        if (formatOptions.style !== undefined) {
            this.style = formatOptions.style;
        }
        if (formatOptions.currencyDisplay !== undefined) {
            this.currencyDisplay = formatOptions.currencyDisplay;
        }
        if (formatOptions.minFractionDigits !== undefined) {
            this.minFractionDigits = formatOptions.minFractionDigits;
        }
        if (formatOptions.maxFractionDigits !== undefined) {
            this.maxFractionDigits = formatOptions.maxFractionDigits;
        }
        if (formatOptions.normaliseWhitespace !== undefined) {
            this.normaliseWhitespace = formatOptions.normaliseWhitespace;
        }

        if (this.minFractionDigits !== undefined && this.maxFractionDigits !== undefined) {
            if (this.minFractionDigits > this.maxFractionDigits) {
                throw new RangeError("Min fraction digits value cannot be greater than max fraction digits value.");
            }
        }
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

        const amountF = parseFloat(formatted);
        let amountS = amountF.toLocaleString(this.locales, {
            style: this.style,
            currency: money.currency.code,
            currencyDisplay: this.currencyDisplay,
            useGrouping: this.useGrouping,
            minimumFractionDigits: this.minFractionDigits !== undefined ? this.minFractionDigits : subunit,
            maximumFractionDigits: this.maxFractionDigits,
        });

        if (this.normaliseWhitespace === true) {
            amountS = amountS.replace(/\s/g, " ");
        }

        return amountS;
    }
}
