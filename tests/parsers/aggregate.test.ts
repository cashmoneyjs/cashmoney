import { TestFixture, Test, TestCases, Expect } from "alsatian";

import AggregateMoneyParser from "src/parsers/aggregate";
import ISOCodeMoneyParser from "src/parsers/isocode";
import SymbolMoneyParser from "src/parsers/symbol";
import BitcoinMoneyParser from "src/parsers/bitcoin";
import PreciseMoney from "src/precisemoney";
import Currency from "src/currency";

@TestFixture("Aggregate Money Parser")
export default class AggregateMoneyParserTest {
    @Test("it refuses to handle no delegate parsers being supplied")
    public itRefusesZeroDelegates() {
        const throwFn = () => new AggregateMoneyParser([]);
        Expect(throwFn).toThrowError(Error, "Cannot initialise aggregate money parser with no child parsers.");
    }

    @TestCases(AggregateMoneyParserTest.validExamples)
    @Test("it parses valid inputs")
    public itParsesValidInputs(input: string, currencyCode: string, expected: string) {
        const parser = new AggregateMoneyParser([
            new SymbolMoneyParser({ "$": "AUD", "US$": "USD" }),
            new SymbolMoneyParser({ "A$": "AUD", "€": "EUR", "$": "USD" }),
            new ISOCodeMoneyParser(),
            new BitcoinMoneyParser(),
        ]);

        const currency = new Currency(currencyCode);

        const money = parser.parse(input);

        Expect(money instanceof PreciseMoney).toBeTruthy();
        Expect(money).toBe(new PreciseMoney(expected, currency));
        Expect(money.amount).toBe(expected);
    }

    public static validExamples() {
        return [
            ["$123.45", "AUD", "123.45"],
            ["A$123.45", "AUD", "123.45"],
            ["$-123.45", "AUD", "-123.45"],
            ["A$-123.45", "AUD", "-123.45"],
            ["$123,45", "AUD", "123.45"],
            ["A$123,45", "AUD", "123.45"],
            ["$-123,45", "AUD", "-123.45"],
            ["A$-123,45", "AUD", "-123.45"],
            ["$ 123.45", "AUD", "123.45"],
            ["A$ 123.45", "AUD", "123.45"],
            ["$ -123.45", "AUD", "-123.45"],
            ["A$ -123.45", "AUD", "-123.45"],
            ["$ 123,45", "AUD", "123.45"],
            ["A$ 123,45", "AUD", "123.45"],
            ["$ -123,45", "AUD", "-123.45"],
            ["A$ -123,45", "AUD", "-123.45"],
            ["123.45$", "AUD", "123.45"],
            ["123.45A$", "AUD", "123.45"],
            ["-123.45$", "AUD", "-123.45"],
            ["-123.45A$", "AUD", "-123.45"],
            ["123,45$", "AUD", "123.45"],
            ["123,45A$", "AUD", "123.45"],
            ["-123,45$", "AUD", "-123.45"],
            ["-123,45A$", "AUD", "-123.45"],
            ["123.45 $", "AUD", "123.45"],
            ["123.45 A$", "AUD", "123.45"],
            ["-123.45 $", "AUD", "-123.45"],
            ["-123.45 A$", "AUD", "-123.45"],
            ["123,45 $", "AUD", "123.45"],
            ["123,45 A$", "AUD", "123.45"],
            ["-123,45 $", "AUD", "-123.45"],
            ["-123,45 A$", "AUD", "-123.45"],

            ["€123.45", "EUR", "123.45"],
            ["€-123.45", "EUR", "-123.45"],
            ["€123,45", "EUR", "123.45"],
            ["€-123,45", "EUR", "-123.45"],
            ["€ 123.45", "EUR", "123.45"],
            ["€ -123.45", "EUR", "-123.45"],
            ["€ 123,45", "EUR", "123.45"],
            ["€ -123,45", "EUR", "-123.45"],
            ["123.45€", "EUR", "123.45"],
            ["-123.45€", "EUR", "-123.45"],
            ["123,45€", "EUR", "123.45"],
            ["-123,45€", "EUR", "-123.45"],
            ["123.45 €", "EUR", "123.45"],
            ["-123.45 €", "EUR", "-123.45"],
            ["123,45 €", "EUR", "123.45"],
            ["-123,45 €", "EUR", "-123.45"],

            ["US$123.45", "USD", "123.45"],
            ["US$-123.45", "USD", "-123.45"],
            ["US$123,45", "USD", "123.45"],
            ["US$-123,45", "USD", "-123.45"],
            ["US$ 123.45", "USD", "123.45"],
            ["US$ -123.45", "USD", "-123.45"],
            ["US$ 123,45", "USD", "123.45"],
            ["US$ -123,45", "USD", "-123.45"],
            ["123.45US$", "USD", "123.45"],
            ["-123.45US$", "USD", "-123.45"],
            ["123,45US$", "USD", "123.45"],
            ["-123,45US$", "USD", "-123.45"],
            ["123.45 US$", "USD", "123.45"],
            ["-123.45 US$", "USD", "-123.45"],
            ["123,45 US$", "USD", "123.45"],
            ["-123,45 US$", "USD", "-123.45"],

            ["AUD 123", "AUD", "123"],
            ["AUD -123", "AUD", "-123"],
            ["AUD 123.45", "AUD", "123.45"],
            ["AUD -123.45", "AUD", "-123.45"],
            ["AUD 123,45", "AUD", "123.45"],
            ["AUD -123,45", "AUD", "-123.45"],
            ["123 AUD", "AUD", "123"],
            ["-123 AUD", "AUD", "-123"],
            ["123.45 AUD", "AUD", "123.45"],
            ["-123.45 AUD", "AUD", "-123.45"],
            ["123,45 AUD", "AUD", "123.45"],
            ["-123,45 AUD", "AUD", "-123.45"],

            ["EUR 123", "EUR", "123"],
            ["EUR -123", "EUR", "-123"],
            ["EUR 123.45", "EUR", "123.45"],
            ["EUR -123.45", "EUR", "-123.45"],
            ["EUR 123,45", "EUR", "123.45"],
            ["EUR -123,45", "EUR", "-123.45"],
            ["123 EUR", "EUR", "123"],
            ["-123 EUR", "EUR", "-123"],
            ["123.45 EUR", "EUR", "123.45"],
            ["-123.45 EUR", "EUR", "-123.45"],
            ["123,45 EUR", "EUR", "123.45"],
            ["-123,45 EUR", "EUR", "-123.45"],

            ["JPY 123", "JPY", "123"],
            ["JPY -123", "JPY", "-123"],
            ["JPY 123.45", "JPY", "123.45"],
            ["JPY -123.45", "JPY", "-123.45"],
            ["JPY 123,45", "JPY", "123.45"],
            ["JPY -123,45", "JPY", "-123.45"],
            ["123 JPY", "JPY", "123"],
            ["-123 JPY", "JPY", "-123"],
            ["123.45 JPY", "JPY", "123.45"],
            ["-123.45 JPY", "JPY", "-123.45"],
            ["123,45 JPY", "JPY", "123.45"],
            ["-123,45 JPY", "JPY", "-123.45"],

            ["USD 123", "USD", "123"],
            ["USD -123", "USD", "-123"],
            ["USD 123.45", "USD", "123.45"],
            ["USD -123.45", "USD", "-123.45"],
            ["USD 123,45", "USD", "123.45"],
            ["USD -123,45", "USD", "-123.45"],
            ["123 USD", "USD", "123"],
            ["-123 USD", "USD", "-123"],
            ["123.45 USD", "USD", "123.45"],
            ["-123.45 USD", "USD", "-123.45"],
            ["123,45 USD", "USD", "123.45"],
            ["-123,45 USD", "USD", "-123.45"],

            ["\xC9\x83123.456", "XBT", "123.456"],
            ["\xC9\x83-123.456", "XBT", "-123.456"],
            ["\xC9\x83123.456", "XBT", "123.456"],
            ["\xC9\x83-123.456", "XBT", "-123.456"],
            ["\xC9\x83 123.456", "XBT", "123.456"],
            ["\xC9\x83 -123.456", "XBT", "-123.456"],
            ["\xC9\x83 123.456", "XBT", "123.456"],
            ["\xC9\x83 -123.456", "XBT", "-123.456"],
            ["123.456\xC9\x83", "XBT", "123.456"],
            ["-123.456\xC9\x83", "XBT", "-123.456"],
            ["123.456\xC9\x83", "XBT", "123.456"],
            ["-123.456\xC9\x83", "XBT", "-123.456"],
            ["123.456 \xC9\x83", "XBT", "123.456"],
            ["-123.456 \xC9\x83", "XBT", "-123.456"],
            ["123.456 \xC9\x83", "XBT", "123.456"],
            ["-123.456 \xC9\x83", "XBT", "-123.456"],
        ];
    }

    @TestCases(AggregateMoneyParserTest.noDelegateExamples)
    @Test("it throws an error when no delegate can be found")
    public itThrowsWhenNoDelegateIsFound(input: string) {
        const parser = new AggregateMoneyParser([
            new BitcoinMoneyParser(),
            new SymbolMoneyParser({ "$": "AUD" }),
        ]);

        const throwFn = () => parser.parse(input);

        Expect(throwFn).toThrowError(Error, `Cannot parse '${input}' to Money.`);
    }

    public static *noDelegateExamples() {
        const examples = [
            "", "abc", "matt", "1.23", "1,23", "123", "US$123", "US$ 123", "123US$", "123 US$",
            "0123", "0123.45", "US$0123.45", "US$ 0123.45", "0123.45US$", "0123.45 US$",
            "US$1,234.56", "US$ 1,234.56", "1,234.56US$", "1,234.56 US$", "$123", "$ 123", "123$",
            "123 $", "$0123.45", "$ 0123.45", "0123.45$", "0123.45 $", "$1,234.56", "$ 1,234.56",
            "1,234.56$", "1,234.56 $", "\xC9\x83123", "\xC9\x83 123", "123\xC9\x83", "123 \xC9\x83",
            "\xC9\x830123.45", "\xC9\x83 0123.45", "0123.45\xC9\x83", "0123.45 \xC9\x83",
            "\xC9\x831,234.45", "\xC9\x83 1,234.56", "1,234.56\xC9\x83", "1,234.56 \xC9\x83",
        ];
        for (const example of examples) {
            yield [example];
        }
    }
}
