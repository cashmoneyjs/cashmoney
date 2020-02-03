import Money from "../money";
import Currency from "../currency";

interface DineroOptions {
    amount: number;
    currency?: string;
    precision?: number;
}

let defaultCurrency: Currency | null = null;

export function setDefaultDineroCurrency(currencyCode: string): void {
    defaultCurrency = new Currency(currencyCode);
}

/**
 * NOTE: This doesn't handle the precision option at all. In
 * CashMoney, the precision option translates to a value returned
 * by a currency list, known as the "subunit" value.
 * If you're relying on manually specifying precisions that differ
 * from the currency's default subunit (precision), you'll need to
 * handle that specially.
 */
export function dineroToMoney(opts: DineroOptions): Money {
    let currency: Currency;
    if (opts.currency) {
        currency = new Currency(opts.currency);
    } else if (defaultCurrency) {
        currency = defaultCurrency;
    } else {
        throw new Error("Cannot create money object from dinero options due to no currency being specified.");
    }

    return new Money(opts.amount, currency);
}
