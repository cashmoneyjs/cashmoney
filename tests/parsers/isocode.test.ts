import { TestFixture, Test, TestCases, Expect } from "alsatian";

import ISOCodeMoneyParser from "src/parsers/isocode";
import CustomCurrencyList from "src/currencylists/custom";
import PreciseMoney from "src/precisemoney";
import Currency from "src/currency";

@TestFixture("ISO Code Money Parser")
export default class ISOCodeMoneyParserTest {
    @TestCases(ISOCodeMoneyParserTest.regularExamples)
    @Test("it parses valid inputs")
    public itParsesValidInputs(input: string, currencyCode: string, expected: string) {
        const parser = new ISOCodeMoneyParser();
        const currency = new Currency(currencyCode);

        const money = parser.parse(input);

        Expect(money instanceof PreciseMoney).toBeTruthy();
        Expect(money).toBe(new PreciseMoney(expected, currency));
        Expect(money.amount).toBe(expected);
    }

    // TODO: Add more examples to this
    public static regularExamples() {
        return [
            ["AUD 0", "AUD", "0"],
            ["AUD -0", "AUD", "0"],
            ["AUD 0.0", "AUD", "0"],
            ["AUD -0.0", "AUD", "0"],
            ["AUD 0,0", "AUD", "0"],
            ["AUD -0,0", "AUD", "0"],
            ["AUD 0.000", "AUD", "0"],
            ["AUD -0.000", "AUD", "0"],
            ["AUD 0,000", "AUD", "0"],
            ["AUD -0,000", "AUD", "0"],
            ["0 AUD", "AUD", "0"],
            ["-0 AUD", "AUD", "0"],
            ["0.0 AUD", "AUD", "0"],
            ["-0.0 AUD", "AUD", "0"],
            ["0,0 AUD", "AUD", "0"],
            ["-0,0 AUD", "AUD", "0"],
            ["0.000 AUD", "AUD", "0"],
            ["-0.000 AUD", "AUD", "0"],
            ["0,000 AUD", "AUD", "0"],
            ["-0,000 AUD", "AUD", "0"],

            ["AUD 1", "AUD", "1"],
            ["AUD -1", "AUD", "-1"],
            ["AUD 1.0", "AUD", "1"],
            ["AUD -1.0", "AUD", "-1"],
            ["AUD 1,0", "AUD", "1"],
            ["AUD -1,0", "AUD", "-1"],
            ["AUD 1.0000", "AUD", "1"],
            ["AUD -1.0000", "AUD", "-1"],
            ["AUD 1,0000", "AUD", "1"],
            ["AUD -1,0000", "AUD", "-1"],
            ["1 AUD", "AUD", "1"],
            ["-1 AUD", "AUD", "-1"],
            ["1.0 AUD", "AUD", "1"],
            ["-1.0 AUD", "AUD", "-1"],
            ["1,0 AUD", "AUD", "1"],
            ["-1,0 AUD", "AUD", "-1"],
            ["1.0000 AUD", "AUD", "1"],
            ["-1.0000 AUD", "AUD", "-1"],
            ["1,0000 AUD", "AUD", "1"],
            ["-1,0000 AUD", "AUD", "-1"],

            ["AUD 0.12", "AUD", "0.12"],
            ["AUD -0.12", "AUD", "-0.12"],
            ["AUD 0,12", "AUD", "0.12"],
            ["AUD -0,12", "AUD", "-0.12"],
            ["AUD 0.1234", "AUD", "0.1234"],
            ["AUD -0.1234", "AUD", "-0.1234"],
            ["AUD 0,1234", "AUD", "0.1234"],
            ["AUD -0,1234", "AUD", "-0.1234"],
            ["0.12 AUD", "AUD", "0.12"],
            ["-0.12 AUD", "AUD", "-0.12"],
            ["0,12 AUD", "AUD", "0.12"],
            ["-0,12 AUD", "AUD", "-0.12"],
            ["0.1234 AUD", "AUD", "0.1234"],
            ["-0.1234 AUD", "AUD", "-0.1234"],
            ["0,1234 AUD", "AUD", "0.1234"],
            ["-0,1234 AUD", "AUD", "-0.1234"],

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
        ];
    }

    @Test("it rejects empty inputs")
    public itRejectsEmptyInputs() {
        const parser1 = new ISOCodeMoneyParser();
        const throwFn1 = () => parser1.parse("");
        Expect(throwFn1).toThrowError(Error, "ISOCodeMoneyParser cannot parse empty input.");

        const parser2 = new ISOCodeMoneyParser(new CustomCurrencyList({ AUD: 2 }));
        const throwFn2 = () => parser2.parse("");
        Expect(throwFn2).toThrowError(Error, "ISOCodeMoneyParser cannot parse empty input.");
    }
}
