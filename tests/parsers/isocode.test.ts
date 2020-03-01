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
        const currency = new Currency(currencyCode);

        const parser = new ISOCodeMoneyParser();
        const money = parser.parse(input);

        Expect(money instanceof PreciseMoney).toBeTruthy();
        Expect(money).toBe(new PreciseMoney(expected, currency));
        Expect(money.amount).toBe(expected);
    }

    @TestCases(ISOCodeMoneyParserTest.regularExamples)
    @Test("it parses valid inputs with a validation currency list")
    public itParsesValidInputsWithValidationCurrencyList(input: string, currencyCode: string, expected: string) {
        const currency = new Currency(currencyCode);

        const currencyList = new CustomCurrencyList({ AUD: 2, EUR: 2, JPY: 0, USD: 2 });
        const parser = new ISOCodeMoneyParser(currencyList);
        const money = parser.parse(input);

        Expect(money instanceof PreciseMoney).toBeTruthy();
        Expect(money).toBe(new PreciseMoney(expected, currency));
        Expect(money.amount).toBe(expected);
    }

    @TestCases(ISOCodeMoneyParserTest.regularExamples)
    @Test("it rejects valid inputs with a validation currency list")
    public itRejectsValidInputsWithValidationCurrencyList(input: string, currencyCode: string) {
        const currencyList = new CustomCurrencyList({ USD: 2 });
        const parser = new ISOCodeMoneyParser(currencyList);

        const throwFn = () => parser.parse(input);

        Expect(throwFn).toThrowError(Error, `Unknown currency code '${currencyCode}'.`);
    }

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

            ["EUR 0", "EUR", "0"],
            ["EUR -0", "EUR", "0"],
            ["EUR 0.0", "EUR", "0"],
            ["EUR -0.0", "EUR", "0"],
            ["EUR 0,0", "EUR", "0"],
            ["EUR -0,0", "EUR", "0"],
            ["EUR 0.000", "EUR", "0"],
            ["EUR -0.000", "EUR", "0"],
            ["EUR 0,000", "EUR", "0"],
            ["EUR -0,000", "EUR", "0"],
            ["0 EUR", "EUR", "0"],
            ["-0 EUR", "EUR", "0"],
            ["0.0 EUR", "EUR", "0"],
            ["-0.0 EUR", "EUR", "0"],
            ["0,0 EUR", "EUR", "0"],
            ["-0,0 EUR", "EUR", "0"],
            ["0.000 EUR", "EUR", "0"],
            ["-0.000 EUR", "EUR", "0"],
            ["0,000 EUR", "EUR", "0"],
            ["-0,000 EUR", "EUR", "0"],

            ["EUR 1", "EUR", "1"],
            ["EUR -1", "EUR", "-1"],
            ["EUR 1.0", "EUR", "1"],
            ["EUR -1.0", "EUR", "-1"],
            ["EUR 1,0", "EUR", "1"],
            ["EUR -1,0", "EUR", "-1"],
            ["EUR 1.0000", "EUR", "1"],
            ["EUR -1.0000", "EUR", "-1"],
            ["EUR 1,0000", "EUR", "1"],
            ["EUR -1,0000", "EUR", "-1"],
            ["1 EUR", "EUR", "1"],
            ["-1 EUR", "EUR", "-1"],
            ["1.0 EUR", "EUR", "1"],
            ["-1.0 EUR", "EUR", "-1"],
            ["1,0 EUR", "EUR", "1"],
            ["-1,0 EUR", "EUR", "-1"],
            ["1.0000 EUR", "EUR", "1"],
            ["-1.0000 EUR", "EUR", "-1"],
            ["1,0000 EUR", "EUR", "1"],
            ["-1,0000 EUR", "EUR", "-1"],

            ["EUR 0.12", "EUR", "0.12"],
            ["EUR -0.12", "EUR", "-0.12"],
            ["EUR 0,12", "EUR", "0.12"],
            ["EUR -0,12", "EUR", "-0.12"],
            ["EUR 0.1234", "EUR", "0.1234"],
            ["EUR -0.1234", "EUR", "-0.1234"],
            ["EUR 0,1234", "EUR", "0.1234"],
            ["EUR -0,1234", "EUR", "-0.1234"],
            ["0.12 EUR", "EUR", "0.12"],
            ["-0.12 EUR", "EUR", "-0.12"],
            ["0,12 EUR", "EUR", "0.12"],
            ["-0,12 EUR", "EUR", "-0.12"],
            ["0.1234 EUR", "EUR", "0.1234"],
            ["-0.1234 EUR", "EUR", "-0.1234"],
            ["0,1234 EUR", "EUR", "0.1234"],
            ["-0,1234 EUR", "EUR", "-0.1234"],

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

            ["JPY 0", "JPY", "0"],
            ["JPY -0", "JPY", "0"],
            ["JPY 0.0", "JPY", "0"],
            ["JPY -0.0", "JPY", "0"],
            ["JPY 0,0", "JPY", "0"],
            ["JPY -0,0", "JPY", "0"],
            ["JPY 0.000", "JPY", "0"],
            ["JPY -0.000", "JPY", "0"],
            ["JPY 0,000", "JPY", "0"],
            ["JPY -0,000", "JPY", "0"],
            ["0 JPY", "JPY", "0"],
            ["-0 JPY", "JPY", "0"],
            ["0.0 JPY", "JPY", "0"],
            ["-0.0 JPY", "JPY", "0"],
            ["0,0 JPY", "JPY", "0"],
            ["-0,0 JPY", "JPY", "0"],
            ["0.000 JPY", "JPY", "0"],
            ["-0.000 JPY", "JPY", "0"],
            ["0,000 JPY", "JPY", "0"],
            ["-0,000 JPY", "JPY", "0"],

            ["JPY 1", "JPY", "1"],
            ["JPY -1", "JPY", "-1"],
            ["JPY 1.0", "JPY", "1"],
            ["JPY -1.0", "JPY", "-1"],
            ["JPY 1,0", "JPY", "1"],
            ["JPY -1,0", "JPY", "-1"],
            ["JPY 1.0000", "JPY", "1"],
            ["JPY -1.0000", "JPY", "-1"],
            ["JPY 1,0000", "JPY", "1"],
            ["JPY -1,0000", "JPY", "-1"],
            ["1 JPY", "JPY", "1"],
            ["-1 JPY", "JPY", "-1"],
            ["1.0 JPY", "JPY", "1"],
            ["-1.0 JPY", "JPY", "-1"],
            ["1,0 JPY", "JPY", "1"],
            ["-1,0 JPY", "JPY", "-1"],
            ["1.0000 JPY", "JPY", "1"],
            ["-1.0000 JPY", "JPY", "-1"],
            ["1,0000 JPY", "JPY", "1"],
            ["-1,0000 JPY", "JPY", "-1"],

            ["JPY 0.12", "JPY", "0.12"],
            ["JPY -0.12", "JPY", "-0.12"],
            ["JPY 0,12", "JPY", "0.12"],
            ["JPY -0,12", "JPY", "-0.12"],
            ["JPY 0.1234", "JPY", "0.1234"],
            ["JPY -0.1234", "JPY", "-0.1234"],
            ["JPY 0,1234", "JPY", "0.1234"],
            ["JPY -0,1234", "JPY", "-0.1234"],
            ["0.12 JPY", "JPY", "0.12"],
            ["-0.12 JPY", "JPY", "-0.12"],
            ["0,12 JPY", "JPY", "0.12"],
            ["-0,12 JPY", "JPY", "-0.12"],
            ["0.1234 JPY", "JPY", "0.1234"],
            ["-0.1234 JPY", "JPY", "-0.1234"],
            ["0,1234 JPY", "JPY", "0.1234"],
            ["-0,1234 JPY", "JPY", "-0.1234"],

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
