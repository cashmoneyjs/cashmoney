import { TestFixture, Test, TestCases, Expect } from "alsatian";

import DecimalMoneyFormatter from "src/formatters/decimal";
import RoundedMoney from "src/roundedmoney";
import Currency from "src/currency";

@TestFixture("Decimal Money Formatter")
export default class DecimalMoneyFormatterTest {
    @TestCases(DecimalMoneyFormatterTest.moneyExamples)
    @Test("it formats money")
    public itFormatsMoney(amount: string, currencyCode: string, subunit: number, expected: string) {
        const money = new RoundedMoney(amount, subunit, new Currency(currencyCode));

        const formatter = new DecimalMoneyFormatter();

        const actual = formatter.format(money);
        Expect(actual).toBe(expected);
    }

    public static moneyExamples() {
        return [
            ['50.05', 'USD', 2, '50.05'],
            ['1', 'USD', 2, '1.00'],
            ['1.0', 'USD', 2, '1.00'],
            ['1.00', 'USD', 2, '1.00'],
            ['0.41', 'USD', 2, '0.41'],
            ['0.05', 'USD', 2, '0.05'],
            ['0.05', 'USD', 3, '0.050'],
            ['0.050', 'USD', 3, '0.050'],
            ['0.35', 'USD', 3, '0.350'],
            ['0.350', 'USD', 3, '0.350'],
            ['1.357', 'USD', 3, '1.357'],
            ['61.351', 'USD', 3, '61.351'],
            ['-61.351', 'USD', 3, '-61.351'],
            ['-61.52', 'USD', 2, '-61.52'],
            ['5', 'JPY', 0, '5'],
            ['50', 'JPY', 0, '50'],
            ['500', 'JPY', 0, '500'],
            ['-5055', 'JPY', 0, '-5055'],
            ['0.05', 'JPY', 2, '0.05'],
            ['0.5', 'JPY', 2, '0.50'],
            ['0.50', 'JPY', 2, '0.50'],
            ['5.00', 'JPY', 2, '5.00'],
            ['-0.05', 'JPY', 2, '-0.05'],
            ['-0.5', 'JPY', 2, '-0.50'],
            ['-0.50', 'JPY', 2, '-0.50'],
            ['-5.00', 'JPY', 2, '-5.00'],
            ['-50.55', 'JPY', 2, '-50.55'],
            ['500500.5', 'USD', 2, '500500.50'],
            ['500500.50', 'USD', 2, '500500.50'],
        ];
    }
}
