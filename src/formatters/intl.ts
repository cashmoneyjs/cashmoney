import type MoneyFormatter from "../formatter";
import type RoundedMoney from "../roundedmoney";

export interface IntlNumberFormatterSettings {
    locales?: string | string[];
    style?: "decimal" | "currency";
    currencyDisplay?: "symbol" | "code" | "name";
    useGrouping?: boolean;
    minFractionDigits?: number;
    maxFractionDigits?: number;
    normaliseWhitespace?: boolean;
}

export default class IntlMoneyFormatter implements MoneyFormatter {
    private readonly locales?: string | string[];
    private readonly style: string = "decimal";
    private readonly currencyDisplay: string = "symbol";
    private readonly useGrouping: boolean = true;
    private readonly minFractionDigits?: number;
    private readonly maxFractionDigits?: number;
    private readonly normaliseWhitespace: boolean = false;

    public constructor(
        formatOptions: IntlNumberFormatterSettings = {},
    ) {
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

    public format(money: RoundedMoney): string {
        const amountF = parseFloat(money.amount);
        let formattedAmount = amountF.toLocaleString(this.locales, {
            style: this.style,
            currency: money.currency.code,
            currencyDisplay: this.currencyDisplay,
            useGrouping: this.useGrouping,
            minimumFractionDigits: this.minFractionDigits !== undefined ? this.minFractionDigits : money.subunit,
            maximumFractionDigits: this.maxFractionDigits,
        });

        if (this.normaliseWhitespace === true) {
            formattedAmount = formattedAmount.replace(/\s/g, " ");
        }

        return formattedAmount;
    }
}
