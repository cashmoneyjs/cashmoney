import { TestFixture, Test, TestCases, Expect } from "alsatian";

import BitcoinMoneyParser from "src/parsers/bitcoin";
import PreciseMoney from "src/precisemoney";
import Currency from "src/currency";

@TestFixture("Bitcoin Money Parser")
export default class BitcoinMoneyParserTest {
    @TestCases(BitcoinMoneyParserTest.validExamples)
    @Test("it parses valid inputs")
    public itParsesValidInputs(input: string, expected: string) {
        const parser = new BitcoinMoneyParser();
        const currency = new Currency("XBT");

        const money = parser.parse(input);

        Expect(money instanceof PreciseMoney).toBeTruthy();
        Expect(money).toBe(new PreciseMoney(expected, currency));
        Expect(money.amount).toBe(expected);
    }

    public static validExamples() {
        return [
            ["\xC9\x830.12", "0.12"],
            ["\xC9\x83-0.12", "-0.12"],
            ["\xC9\x830.12", "0.12"],
            ["\xC9\x83-0.12", "-0.12"],
            ["\xC9\x83 0.12", "0.12"],
            ["\xC9\x83 -0.12", "-0.12"],
            ["\xC9\x83 0.12", "0.12"],
            ["\xC9\x83 -0.12", "-0.12"],
            ["0.12\xC9\x83", "0.12"],
            ["-0.12\xC9\x83", "-0.12"],
            ["0.12\xC9\x83", "0.12"],
            ["-0.12\xC9\x83", "-0.12"],
            ["0.12 \xC9\x83", "0.12"],
            ["-0.12 \xC9\x83", "-0.12"],
            ["0.12 \xC9\x83", "0.12"],
            ["-0.12 \xC9\x83", "-0.12"],

            ["\xC9\x831.23", "1.23"],
            ["\xC9\x83-1.23", "-1.23"],
            ["\xC9\x831,23", "1.23"],
            ["\xC9\x83-1,23", "-1.23"],
            ["\xC9\x83 1.23", "1.23"],
            ["\xC9\x83 -1.23", "-1.23"],
            ["\xC9\x83 1,23", "1.23"],
            ["\xC9\x83 -1,23", "-1.23"],
            ["1.23\xC9\x83", "1.23"],
            ["-1.23\xC9\x83", "-1.23"],
            ["1,23\xC9\x83", "1.23"],
            ["-1,23\xC9\x83", "-1.23"],
            ["1.23 \xC9\x83", "1.23"],
            ["-1.23 \xC9\x83", "-1.23"],
            ["1,23 \xC9\x83", "1.23"],
            ["-1,23 \xC9\x83", "-1.23"],

            ["\xC9\x83123.456", "123.456"],
            ["\xC9\x83-123.456", "-123.456"],
            ["\xC9\x83123.456", "123.456"],
            ["\xC9\x83-123.456", "-123.456"],
            ["\xC9\x83 123.456", "123.456"],
            ["\xC9\x83 -123.456", "-123.456"],
            ["\xC9\x83 123.456", "123.456"],
            ["\xC9\x83 -123.456", "-123.456"],
            ["123.456\xC9\x83", "123.456"],
            ["-123.456\xC9\x83", "-123.456"],
            ["123.456\xC9\x83", "123.456"],
            ["-123.456\xC9\x83", "-123.456"],
            ["123.456 \xC9\x83", "123.456"],
            ["-123.456 \xC9\x83", "-123.456"],
            ["123.456 \xC9\x83", "123.456"],
            ["-123.456 \xC9\x83", "-123.456"],
        ];
    }

    @TestCases(BitcoinMoneyParserTest.unknownSymbolExamples)
    @Test("it rejects inputs with unknown symbols")
    public itRejectsInputsWithUnknownSymbols(input: string, expectedSymbol: string) {
        const parser = new BitcoinMoneyParser();

        const throwFn = () => parser.parse(input);

        Expect(throwFn).toThrowError(Error, `Unrecognised currency symbol '${expectedSymbol}'.`);
    }

    public static unknownSymbolExamples() {
        return [
            ["$1.23", "$"],
            ["$-1.23", "$"],
            ["$1,23", "$"],
            ["$-1,23", "$"],
            ["$ 1.23", "$"],
            ["$ -1.23", "$"],
            ["$ 1,23", "$"],
            ["$ -1,23", "$"],
            ["1.23$", "$"],
            ["-1.23$", "$"],
            ["1,23$", "$"],
            ["-1,23$", "$"],
            ["1.23 $", "$"],
            ["-1.23 $", "$"],
            ["1,23 $", "$"],
            ["-1,23 $", "$"],

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

    @TestCases(BitcoinMoneyParserTest.badExamples)
    @Test("it fails when no match can be found")
    public itFailsWhenNoMatchCanBeFound(input: string) {
        const parser = new BitcoinMoneyParser();

        const throwFn = () => parser.parse(input);

        Expect(throwFn).toThrowError(Error, `Cannot parse '${input}' to Money.`);
    }

    public static *badExamples() {
        const examples = [
            "abc", "matt", "1.23", "1,23", "123", "$123", "$ 123", "123$", "123 $",
            "0123", "0123.45", "$0123.45", "$ 0123.45", "0123.45$", "0123.45 $",
            "$1,234.56", "$ 1,234.56", "1,234.56$", "1,234.56 $",
            "\xC9\x83123", "\xC9\x83 123", "123\xC9\x83", "123 \xC9\x83",
            "\xC9\x830123.45", "\xC9\x83 0123.45", "0123.45\xC9\x83", "0123.45 \xC9\x83",
            "\xC9\x831,234.45", "\xC9\x83 1,234.56", "1,234.56\xC9\x83", "1,234.56 \xC9\x83",
        ];
        for (const example of examples) {
            yield [example];
        }
    }

    @Test("it rejects empty inputs")
    public itRejectsEmptyInputs() {
        const parser = new BitcoinMoneyParser();

        const throwFn = () => parser.parse("");

        Expect(throwFn).toThrowError(Error, "Cannot parse empty input.");
    }
}
