import Money from "../money";
import MoneyFormatter from "../formatter";

interface MoneyFormatterMap {
    [currencyCode: string]: MoneyFormatter;
}

export default class AggregateMoneyFormatter implements MoneyFormatter {
    private formatters: MoneyFormatterMap;

    public constructor(formatters: MoneyFormatterMap) {
        if (Object.keys(formatters).length === 0) {
            throw new Error("Cannot initialize aggregate money formatter without any child formatters");
        }

        this.formatters = Object.assign({}, formatters);
    }

    public format(money: Money): string {
        const currencyCode = money.currency.code;

        if (typeof this.formatters[currencyCode] !== "undefined") {
            return this.formatters[currencyCode].format(money);
        }

        if (typeof this.formatters["*"] !== "undefined") {
            return this.formatters["*"].format(money);
        }

        throw new Error("No formatter found for currency " + currencyCode);
    }
}
