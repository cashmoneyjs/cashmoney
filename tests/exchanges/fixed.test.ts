import { TestFixture, Test, Expect } from "alsatian";

import { Num } from "@cashmoney/number";

import FixedExchange from "src/exchanges/fixed";
import Currency from "src/currency";
import CurrencyPair from "src/currencypair";

@TestFixture("Fixed Exchange")
export default class FixedExchangeTest {
    @Test("it quotes")
    public itQuotes() {
        const exchange = new FixedExchange({
            "EUR": {
                "USD": 1.25,
            },
        });

        const baseCurrency = new Currency("EUR");
        const counterCurrency = new Currency("USD");

        const currencyPair = exchange.quote(baseCurrency, counterCurrency);
        Expect(currencyPair instanceof CurrencyPair).toBeTruthy();

        Expect(currencyPair.baseCurrency).toBe(baseCurrency);
        Expect(currencyPair.counterCurrency).toBe(counterCurrency);
        Expect(currencyPair.conversionRatio).toBe(new Num(1.25));
    }

    @Test("it throws an error for non-existent mappings")
    public itThrowsForUnknownMappings() {
        const exchange = new FixedExchange({
            "EUR": {
                "USD": 1.25,
            },
        });

        const baseCurrency = new Currency("USD");
        const counterCurrency = new Currency("EUR");

        const throwFn = () => exchange.quote(baseCurrency, counterCurrency);

        Expect(throwFn).toThrowError(Error, "Cannot resolve a currency pair for currencies: USD/EUR.");
    }
}
