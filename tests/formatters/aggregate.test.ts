import { TestFixture, Test, Expect } from "alsatian";

import AggregateMoneyFormatter from "src/formatters/aggregate";
import MoneyFormatter from "src/formatter";
import RoundedMoney from "src/roundedmoney";
import Currency from "src/currency";

@TestFixture("Decimal Money Formatter")
export default class DecimalMoneyFormatterTest {
    private createDummyFormatter(): MoneyFormatter {
        return {
            format(money: RoundedMoney): string {
                return money.amount;
            },
        };
    }

    @Test("it refuses to handle no delegate formatters being supplied")
    public itRefusesZeroDelegates() {
        const throwFn = () => new AggregateMoneyFormatter({});
        Expect(throwFn).toThrowError(Error, "Cannot initialise aggregate money formatter without any child formatters.");
    }

    @Test("it throws an error when no delegate can be found")
    public itThrowsWhenNoDelegateIsFound() {
        const currency = new Currency("AUD");
        const money = new RoundedMoney("1.23", 2, currency);
        const formatter = new AggregateMoneyFormatter({
            "USD": this.createDummyFormatter(),
        });

        const throwFn = () => formatter.format(money);

        Expect(throwFn).toThrowError(Error, "No formatter found for currency AUD.");
    }
}
