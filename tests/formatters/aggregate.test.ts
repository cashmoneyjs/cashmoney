import { TestFixture, Test, TestCases, Expect } from "alsatian";

import AggregateMoneyFormatter from "src/formatters/aggregate";
import MoneyFormatter from "src/formatter";
import RoundedMoney from "src/roundedmoney";
import Currency from "src/currency";

@TestFixture("Aggregate Money Formatter")
export default class AggregateMoneyFormatterTest {
    private createDummyFormatter(prefix: string = ""): MoneyFormatter {
        return {
            format(money: RoundedMoney): string {
                return `${prefix}${money.amount}`;
            },
        };
    }

    @Test("it refuses to handle no delegate formatters being supplied")
    public itRefusesZeroDelegates() {
        const throwFn = () => new AggregateMoneyFormatter({});
        Expect(throwFn).toThrowError(Error, "Cannot initialise aggregate money formatter with no child formatters.");
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

    @TestCases(AggregateMoneyFormatterTest.regularExamples)
    @Test("it selects the correct delegate when available")
    public itSelectsTheCorrectDelegate(amount: string, subunit: number, currencyCode: string, expected: string) {
        const currency = new Currency(currencyCode);
        const money = new RoundedMoney(amount, subunit, currency);

        const formatter = new AggregateMoneyFormatter({
            "EUR": this.createDummyFormatter("€"),
            "JPY": this.createDummyFormatter("￥"),
            "*": this.createDummyFormatter(),
        });

        const actual = formatter.format(money);
        Expect(actual).toBe(expected);
    }

    public static regularExamples() {
        return [
            ["0", 2, "AUD", "0.00"],
            ["0", 2, "EUR", "€0.00"],
            ["0", 0, "JPY", "￥0"],
            ["0.01", 2, "AUD", "0.01"],
            ["0.01", 2, "EUR", "€0.01"],
            ["0.01", 2, "JPY", "￥0.01"],
            ["0.1", 1, "AUD", "0.1"],
            ["0.1", 1, "EUR", "€0.1"],
            ["0.1", 1, "JPY", "￥0.1"],
            ["1", 2, "AUD", "1.00"],
            ["1", 2, "EUR", "€1.00"],
            ["1", 0, "JPY", "￥1"],
            ["1.01", 2, "AUD", "1.01"],
            ["1.01", 2, "EUR", "€1.01"],
            ["1.01", 2, "JPY", "￥1.01"],
            ["1.1", 1, "AUD", "1.1"],
            ["1.1", 1, "EUR", "€1.1"],
            ["1.1", 1, "JPY", "￥1.1"],
            ["100", 2, "AUD", "100.00"],
            ["100", 2, "EUR", "€100.00"],
            ["100", 0, "JPY", "￥100"],
            ["100.01", 2, "AUD", "100.01"],
            ["100.01", 2, "EUR", "€100.01"],
            ["100.01", 2, "JPY", "￥100.01"],
            ["100.1", 1, "AUD", "100.1"],
            ["100.1", 1, "EUR", "€100.1"],
            ["100.1", 1, "JPY", "￥100.1"],
            ["-0", 2, "AUD", "0.00"],
            ["-0", 2, "EUR", "€0.00"],
            ["-0", 0, "JPY", "￥0"],
            ["-0.01", 2, "AUD", "-0.01"],
            ["-0.01", 2, "EUR", "€-0.01"],
            ["-0.01", 2, "JPY", "￥-0.01"],
            ["-0.1", 1, "AUD", "-0.1"],
            ["-0.1", 1, "EUR", "€-0.1"],
            ["-0.1", 1, "JPY", "￥-0.1"],
            ["-1", 2, "AUD", "-1.00"],
            ["-1", 2, "EUR", "€-1.00"],
            ["-1", 0, "JPY", "￥-1"],
            ["-1.01", 2, "AUD", "-1.01"],
            ["-1.01", 2, "EUR", "€-1.01"],
            ["-1.01", 2, "JPY", "￥-1.01"],
            ["-1.1", 1, "AUD", "-1.1"],
            ["-1.1", 1, "EUR", "€-1.1"],
            ["-1.1", 1, "JPY", "￥-1.1"],
            ["-100", 2, "AUD", "-100.00"],
            ["-100", 2, "EUR", "€-100.00"],
            ["-100", 0, "JPY", "￥-100"],
            ["-100.01", 2, "AUD", "-100.01"],
            ["-100.01", 2, "EUR", "€-100.01"],
            ["-100.01", 2, "JPY", "￥-100.01"],
            ["-100.1", 1, "AUD", "-100.1"],
            ["-100.1", 1, "EUR", "€-100.1"],
            ["-100.1", 1, "JPY", "￥-100.1"],
        ];
    }
}
