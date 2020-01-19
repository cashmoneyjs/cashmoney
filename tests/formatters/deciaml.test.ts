import { TestFixture, Test, TestCases, Expect } from "alsatian";

import DecimalMoneyFormatter from "src/formatters/decimal";
import CustomCurrencyList from "src/currencylists/custom";
import Money from "src/money";
import Currency from "src/currency";

@TestFixture("DecimalMoneyFormatter")
export default class DecimalMoneyFormatterTest {
    @TestCases(DecimalMoneyFormatterTest.moneyExamples)
    @Test("it formats money")
    public itFormatsMoney(amount: number, currencyCode: string, subunit: number, expected: string) {
        const money = new Money(amount, new Currency(currencyCode));

        const currencyList = new CustomCurrencyList({ [currencyCode]: subunit });
        const formatter = new DecimalMoneyFormatter(currencyList);

        const actual = formatter.format(money);
        Expect(actual).toBe(expected);
    }

    public static moneyExamples() {
        return [
            [5005, 'USD', 2, '50.05'],
            [100, 'USD', 2, '1.00'],
            [41, 'USD', 2, '0.41'],
            [5, 'USD', 2, '0.05'],
            [50, 'USD', 3, '0.050'],
            [350, 'USD', 3, '0.350'],
            [1357, 'USD', 3, '1.357'],
            [61351, 'USD', 3, '61.351'],
            [-61351, 'USD', 3, '-61.351'],
            [-6152, 'USD', 2, '-61.52'],
            [5, 'JPY', 0, '5'],
            [50, 'JPY', 0, '50'],
            [500, 'JPY', 0, '500'],
            [-5055, 'JPY', 0, '-5055'],
            [5, 'JPY', 2, '0.05'],
            [50, 'JPY', 2, '0.50'],
            [500, 'JPY', 2, '5.00'],
            [-5055, 'JPY', 2, '-50.55'],
            [50050050, 'USD', 2, '500500.50'],
        ];
    }
}
