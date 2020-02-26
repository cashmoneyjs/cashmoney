import { TestFixture, Test, Expect } from "alsatian";

import AggregateMoneyFormatter from "src/formatters/aggregate";
//import RoundedMoney from "src/roundedmoney";
//import Currency from "src/currency";

@TestFixture("Decimal Money Formatter")
export default class DecimalMoneyFormatterTest {
    @Test("it refuses to handle no delegate formatters being supplied")
    public itRefusesZeroDelegates() {
        const throwFn = () => new AggregateMoneyFormatter({});
        Expect(throwFn).toThrowError(Error, "Cannot initialise aggregate money formatter without any child formatters.");
    }
}
