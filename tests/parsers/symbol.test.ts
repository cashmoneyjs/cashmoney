import { TestFixture, Test, TestCases, Expect } from "alsatian";

import SymbolMoneyParser from "src/parsers/symbol";
import PreciseMoney from "src/precisemoney";
import Currency from "src/currency";

@TestFixture("Symbol Money Parser")
export default class SymbolMoneyParserTest {
    @TestCases(SymbolMoneyParserTest.knownSymbolExamples)
    @Test("it parses inputs with known symbols denoting the currency")
    public itParsesInputsWithKnownSymbols(input: string, currencyCode: string, expected: string) {
        const parser = new SymbolMoneyParser({ "$": "AUD", "€": "EUR", "US$": "USD" });
        const currency = new Currency(currencyCode);

        const money = parser.parse(input);

        Expect(money instanceof PreciseMoney).toBeTruthy();
        Expect(money).toBe(new PreciseMoney(expected, currency));
        Expect(money.amount).toBe(expected);
    }

    public static knownSymbolExamples() {
        return [
            ["$0.12", "AUD", "0.12"],
            ["$-0.12", "AUD", "-0.12"],
            ["$0.12", "AUD", "0.12"],
            ["$-0.12", "AUD", "-0.12"],
            ["$ 0.12", "AUD", "0.12"],
            ["$ -0.12", "AUD", "-0.12"],
            ["$ 0.12", "AUD", "0.12"],
            ["$ -0.12", "AUD", "-0.12"],
            ["0.12$", "AUD", "0.12"],
            ["-0.12$", "AUD", "-0.12"],
            ["0.12$", "AUD", "0.12"],
            ["-0.12$", "AUD", "-0.12"],
            ["0.12 $", "AUD", "0.12"],
            ["-0.12 $", "AUD", "-0.12"],
            ["0.12 $", "AUD", "0.12"],
            ["-0.12 $", "AUD", "-0.12"],

            ["$1.23", "AUD", "1.23"],
            ["$-1.23", "AUD", "-1.23"],
            ["$1,23", "AUD", "1.23"],
            ["$-1,23", "AUD", "-1.23"],
            ["$ 1.23", "AUD", "1.23"],
            ["$ -1.23", "AUD", "-1.23"],
            ["$ 1,23", "AUD", "1.23"],
            ["$ -1,23", "AUD", "-1.23"],
            ["1.23$", "AUD", "1.23"],
            ["-1.23$", "AUD", "-1.23"],
            ["1,23$", "AUD", "1.23"],
            ["-1,23$", "AUD", "-1.23"],
            ["1.23 $", "AUD", "1.23"],
            ["-1.23 $", "AUD", "-1.23"],
            ["1,23 $", "AUD", "1.23"],
            ["-1,23 $", "AUD", "-1.23"],

            ["$123.456", "AUD", "123.456"],
            ["$-123.456", "AUD", "-123.456"],
            ["$123.456", "AUD", "123.456"],
            ["$-123.456", "AUD", "-123.456"],
            ["$ 123.456", "AUD", "123.456"],
            ["$ -123.456", "AUD", "-123.456"],
            ["$ 123.456", "AUD", "123.456"],
            ["$ -123.456", "AUD", "-123.456"],
            ["123.456$", "AUD", "123.456"],
            ["-123.456$", "AUD", "-123.456"],
            ["123.456$", "AUD", "123.456"],
            ["-123.456$", "AUD", "-123.456"],
            ["123.456 $", "AUD", "123.456"],
            ["-123.456 $", "AUD", "-123.456"],
            ["123.456 $", "AUD", "123.456"],
            ["-123.456 $", "AUD", "-123.456"],

            ["€0.12", "EUR", "0.12"],
            ["€-0.12", "EUR", "-0.12"],
            ["€0.12", "EUR", "0.12"],
            ["€-0.12", "EUR", "-0.12"],
            ["€ 0.12", "EUR", "0.12"],
            ["€ -0.12", "EUR", "-0.12"],
            ["€ 0.12", "EUR", "0.12"],
            ["€ -0.12", "EUR", "-0.12"],
            ["0.12€", "EUR", "0.12"],
            ["-0.12€", "EUR", "-0.12"],
            ["0.12€", "EUR", "0.12"],
            ["-0.12€", "EUR", "-0.12"],
            ["0.12 €", "EUR", "0.12"],
            ["-0.12 €", "EUR", "-0.12"],
            ["0.12 €", "EUR", "0.12"],
            ["-0.12 €", "EUR", "-0.12"],

            ["€1.23", "EUR", "1.23"],
            ["€-1.23", "EUR", "-1.23"],
            ["€1,23", "EUR", "1.23"],
            ["€-1,23", "EUR", "-1.23"],
            ["€ 1.23", "EUR", "1.23"],
            ["€ -1.23", "EUR", "-1.23"],
            ["€ 1,23", "EUR", "1.23"],
            ["€ -1,23", "EUR", "-1.23"],
            ["1.23€", "EUR", "1.23"],
            ["-1.23€", "EUR", "-1.23"],
            ["1,23€", "EUR", "1.23"],
            ["-1,23€", "EUR", "-1.23"],
            ["1.23 €", "EUR", "1.23"],
            ["-1.23 €", "EUR", "-1.23"],
            ["1,23 €", "EUR", "1.23"],
            ["-1,23 €", "EUR", "-1.23"],

            ["€123.456", "EUR", "123.456"],
            ["€-123.456", "EUR", "-123.456"],
            ["€123.456", "EUR", "123.456"],
            ["€-123.456", "EUR", "-123.456"],
            ["€ 123.456", "EUR", "123.456"],
            ["€ -123.456", "EUR", "-123.456"],
            ["€ 123.456", "EUR", "123.456"],
            ["€ -123.456", "EUR", "-123.456"],
            ["123.456€", "EUR", "123.456"],
            ["-123.456€", "EUR", "-123.456"],
            ["123.456€", "EUR", "123.456"],
            ["-123.456€", "EUR", "-123.456"],
            ["123.456 €", "EUR", "123.456"],
            ["-123.456 €", "EUR", "-123.456"],
            ["123.456 €", "EUR", "123.456"],
            ["-123.456 €", "EUR", "-123.456"],

            ["US$0.12", "USD", "0.12"],
            ["US$-0.12", "USD", "-0.12"],
            ["US$0.12", "USD", "0.12"],
            ["US$-0.12", "USD", "-0.12"],
            ["US$ 0.12", "USD", "0.12"],
            ["US$ -0.12", "USD", "-0.12"],
            ["US$ 0.12", "USD", "0.12"],
            ["US$ -0.12", "USD", "-0.12"],
            ["0.12US$", "USD", "0.12"],
            ["-0.12US$", "USD", "-0.12"],
            ["0.12US$", "USD", "0.12"],
            ["-0.12US$", "USD", "-0.12"],
            ["0.12 US$", "USD", "0.12"],
            ["-0.12 US$", "USD", "-0.12"],
            ["0.12 US$", "USD", "0.12"],
            ["-0.12 US$", "USD", "-0.12"],

            ["US$1.23", "USD", "1.23"],
            ["US$-1.23", "USD", "-1.23"],
            ["US$1,23", "USD", "1.23"],
            ["US$-1,23", "USD", "-1.23"],
            ["US$ 1.23", "USD", "1.23"],
            ["US$ -1.23", "USD", "-1.23"],
            ["US$ 1,23", "USD", "1.23"],
            ["US$ -1,23", "USD", "-1.23"],
            ["1.23US$", "USD", "1.23"],
            ["-1.23US$", "USD", "-1.23"],
            ["1,23US$", "USD", "1.23"],
            ["-1,23US$", "USD", "-1.23"],
            ["1.23 US$", "USD", "1.23"],
            ["-1.23 US$", "USD", "-1.23"],
            ["1,23 US$", "USD", "1.23"],
            ["-1,23 US$", "USD", "-1.23"],

            ["US$123.456", "USD", "123.456"],
            ["US$-123.456", "USD", "-123.456"],
            ["US$123.456", "USD", "123.456"],
            ["US$-123.456", "USD", "-123.456"],
            ["US$ 123.456", "USD", "123.456"],
            ["US$ -123.456", "USD", "-123.456"],
            ["US$ 123.456", "USD", "123.456"],
            ["US$ -123.456", "USD", "-123.456"],
            ["123.456US$", "USD", "123.456"],
            ["-123.456US$", "USD", "-123.456"],
            ["123.456US$", "USD", "123.456"],
            ["-123.456US$", "USD", "-123.456"],
            ["123.456 US$", "USD", "123.456"],
            ["-123.456 US$", "USD", "-123.456"],
            ["123.456 US$", "USD", "123.456"],
            ["-123.456 US$", "USD", "-123.456"],
        ];
    }

    @TestCases(SymbolMoneyParserTest.unknownSymbolExamples)
    @Test("it rejects inputs with unknown symbols")
    public itRejectsInputsWithUnknownSymbols(input: string, expectedSymbol: string) {
        const parser = new SymbolMoneyParser({ "$": "AUD" });

        const throwFn = () => parser.parse(input);

        Expect(throwFn).toThrowError(Error, `Unrecognised currency symbol '${expectedSymbol}'.`);
    }

    public static unknownSymbolExamples() {
        return [
            ["€1.23", "€"],
            ["€-1.23", "€"],
            ["€1,23", "€"],
            ["€-1,23", "€"],
            ["€ 1.23", "€"],
            ["€ -1.23", "€"],
            ["€ 1,23", "€"],
            ["€ -1,23", "€"],
            ["1.23€", "€"],
            ["-1.23€", "€"],
            ["1,23€", "€"],
            ["-1,23€", "€"],
            ["1.23 €", "€"],
            ["-1.23 €", "€"],
            ["1,23 €", "€"],
            ["-1,23 €", "€"],

            ["US$1.23", "US$"],
            ["US$-1.23", "US$"],
            ["US$1,23", "US$"],
            ["US$-1,23", "US$"],
            ["US$ 1.23", "US$"],
            ["US$ -1.23", "US$"],
            ["US$ 1,23", "US$"],
            ["US$ -1,23", "US$"],
            ["1.23US$", "US$"],
            ["-1.23US$", "US$"],
            ["1,23US$", "US$"],
            ["-1,23US$", "US$"],
            ["1.23 US$", "US$"],
            ["-1.23 US$", "US$"],
            ["1,23 US$", "US$"],
            ["-1,23 US$", "US$"],
        ];
    }

    @TestCases(SymbolMoneyParserTest.badExamples)
    @Test("it fails when no match can be found")
    public itFailsWhenNoMatchCanBeFound(input: string) {
        const parser = new SymbolMoneyParser({ "$": "CAD", "NZ$": "NZD" });

        const throwFn = () => parser.parse(input);

        Expect(throwFn).toThrowError(Error, `Cannot parse '${input}' to Money.`);
    }

    public static *badExamples() {
        const examples = [
            "abc", "matt", "1.23", "1,23", "123", "$123", "$ 123", "123$", "123 $", "0123", "0123.45", "$0123.45", "$ 0123.45", "0123.45$", "0123.45 $",
            "$1,234.56", "$ 1,234.56", "1,234.56$", "1,234.56 $",
        ];
        for (const example of examples) {
            yield [example];
        }
    }

    @Test("it rejects empty inputs")
    public itRejectsEmptyInputs() {
        const parser = new SymbolMoneyParser({ "$": "AUD" });

        const throwFn = () => parser.parse("");

        Expect(throwFn).toThrowError(Error, "SymbolMoneyParser cannot parse empty input.");
    }

    @Test("it refuses to handle no mappings being supplied")
    public itRefusesZeroMappings() {
        const throwFn = () => new SymbolMoneyParser({});
        Expect(throwFn).toThrowError(Error, "Cannot initialise symbol money parser with no symbol-to-currency mappings.");
    }
}
