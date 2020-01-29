import { TestFixture, Test, TestCases, Expect } from "alsatian";

import DecimalMoneyParser from "src/parsers/decimal";
import Currency from "src/currency";
import CurrencyList from "src/currencylist";

@TestFixture("Decimal Money Parser")
export default class DecimalMoneyParserTest {
    @TestCases(DecimalMoneyParserTest.formattedMoneyExamples)
    @Test("it parses decimal money")
    public itParsesMoney(decimal: string, currencyCode: string, subunit: number, expected: string) {
        const fakeCurrencyList = this.makeFakeCurrencyList(subunit);
        const parser = new DecimalMoneyParser(fakeCurrencyList);

        const result = parser.parse(decimal, new Currency(currencyCode));
        Expect(result.amount).toBe(expected);
    }

    @TestCases(DecimalMoneyParserTest.invalidMoneyExamples)
    @Test("it throws an exception upon invalid inputs")
    public itThrowsAnExceptionUponInvalidInputs(input: string) {
        const fakeCurrencyList = this.makeFakeCurrencyList(2);
        const parser = new DecimalMoneyParser(fakeCurrencyList);

        const throwFn = () => parser.parse(input, new Currency("USD"));

        Expect(throwFn).toThrow();
    }

    private makeFakeCurrencyList(subunit: number): CurrencyList {
        return {
            contains(currency: Currency): boolean {
                return true;
            },
            nameFor(currency: Currency): string {
                return currency.code;
            },
            subunitFor(currency: Currency): number {
                return subunit;
            },
            [Symbol.iterator](): IterableIterator<Currency> {
                return [].values();
            },
        };
    }

    public static formattedMoneyExamples() {
        return [
            ['1000.50', 'USD', 2, '100050'],
            ['1000.00', 'USD', 2, '100000'],
            ['1000.0', 'USD', 2, '100000'],
            ['1000', 'USD', 2, '100000'],
            ['0.01', 'USD', 2, '1'],
            ['0.00', 'USD', 2, '0'],
            ['1', 'USD', 2, '100'],
            ['-1000.50', 'USD', 2, '-100050'],
            ['-1000.00', 'USD', 2, '-100000'],
            ['-1000.0', 'USD', 2, '-100000'],
            ['-1000', 'USD', 2, '-100000'],
            ['-0.01', 'USD', 2, '-1'],
            ['-1', 'USD', 2, '-100'],
            ['1000.501', 'USD', 3, '1000501'],
            ['1000.001', 'USD', 3, '1000001'],
            ['1000.50', 'USD', 3, '1000500'],
            ['1000.00', 'USD', 3, '1000000'],
            ['1000.0', 'USD', 3, '1000000'],
            ['1000', 'USD', 3, '1000000'],
            ['0.001', 'USD', 3, '1'],
            ['0.01', 'USD', 3, '10'],
            ['1', 'USD', 3, '1000'],
            ['-1000.501', 'USD', 3, '-1000501'],
            ['-1000.001', 'USD', 3, '-1000001'],
            ['-1000.50', 'USD', 3, '-1000500'],
            ['-1000.00', 'USD', 3, '-1000000'],
            ['-1000.0', 'USD', 3, '-1000000'],
            ['-1000', 'USD', 3, '-1000000'],
            ['-0.001', 'USD', 3, '-1'],
            ['-0.01', 'USD', 3, '-10'],
            ['-1', 'USD', 3, '-1000'],
            ['1000.50', 'JPY', 0, '1001'],
            ['1000.00', 'JPY', 0, '1000'],
            ['1000.0', 'JPY', 0, '1000'],
            ['1000', 'JPY', 0, '1000'],
            ['0.01', 'JPY', 0, '0'],
            ['1', 'JPY', 0, '1'],
            ['-1000.50', 'JPY', 0, '-1001'],
            ['-1000.00', 'JPY', 0, '-1000'],
            ['-1000.0', 'JPY', 0, '-1000'],
            ['-1000', 'JPY', 0, '-1000'],
            ['-0.01', 'JPY', 0, '0'],
            ['-1', 'JPY', 0, '-1'],
            ['', 'USD', 2, '0'],
            ['.99', 'USD', 2, '99'],
            ['99.', 'USD', 2, '9900'],
            ['-9.999', 'USD', 2, '-1000'],
            ['9.999', 'USD', 2, '1000'],
            ['9.99', 'USD', 2, '999'],
            ['-9.99', 'USD', 2, '-999'],
        ];
    }

    public static invalidMoneyExamples() {
        return [
            ['INVALID'],
            ['.'],
        ];
    }
}
