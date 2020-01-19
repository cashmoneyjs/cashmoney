import { TestFixture, Test, TestCases, Expect } from "alsatian";

import Converter from "src/converter";
import Money from "src/money";
import Currency from "src/currency";
import CustomCurrencyList from "src/currencylists/custom";
import FixedExchange from "src/exchanges/fixed";
import { numeric } from "src/types";

@TestFixture("Converter")
export default class ConverterTest {
    @TestCases(ConverterTest.convertExamples)
    @Test("it converts to a different currency")
    public itConvertsToADifferentCurrency(
        baseCurrencyCode: string,
        counterCurrencyCode: string,
        subunitBase: number,
        subunitCounter: number,
        ratio: number,
        amount: numeric,
        expectedAmount: string,
    ) {
        const baseCurrency = new Currency(baseCurrencyCode);
        const counterCurrency = new Currency(counterCurrencyCode);

        const currencyList = new CustomCurrencyList({
            [baseCurrencyCode]: subunitBase,
            [counterCurrencyCode]: subunitCounter,
        });
        const exchange = new FixedExchange({
            [baseCurrencyCode]: { [counterCurrencyCode]: ratio },
        });

        const converter = new Converter(currencyList, exchange);

        const money = converter.convert(
            new Money(amount, baseCurrency),
            counterCurrency,
        );

        Expect(money instanceof Money).toBeTruthy();
        Expect(money.amount).toBe(expectedAmount);
        Expect(money.currency.code).toBe(counterCurrencyCode);
    }

    public static convertExamples() {
        return [
            ['USD', 'JPY', 2, 0, 101, 100, '101'],
            ['JPY', 'USD', 0, 2, 0.0099, 1000, '990'],
            ['USD', 'EUR', 2, 2, 0.89, 100, '89'],
            ['EUR', 'USD', 2, 2, 1.12, 100, '112'],
            ['XBT', 'USD', 8, 2, 6597, 1, '0'],
            ['XBT', 'USD', 8, 2, 6597, 10, '0'],
            ['XBT', 'USD', 8, 2, 6597, 100, '1'],
            ['ETH', 'EUR', 18, 2, 330.84, '100000000000000000', '3308'],
            ['BTC', 'USD', 8, 2, 13500, 100000000, '1350000'],
            ['USD', 'BTC', 2, 8, 1 / 13500, 1350000, '100000000'],
        ];
    }
}
