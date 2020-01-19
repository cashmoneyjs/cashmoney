import Money from "./money";
import Currency from "./currency";
import CurrencyList from "./currencylist";
import Exchange from "./exchange";
import Num from "./number";
import { RoundingMode } from "./rounding";

export default class Converter {
    private currencyList: CurrencyList;
    private exchange: Exchange;

    public constructor(currencyList: CurrencyList, exchange: Exchange) {
        this.currencyList = currencyList;
        this.exchange = exchange;
    }

    public convert(money: Money, counterCurrency: Currency, roundingMode: RoundingMode = RoundingMode.ROUND_HALF_UP) {
        const baseCurrency = money.currency;
        const ratio = this.exchange.quote(baseCurrency, counterCurrency).conversionRatio;

        const baseCurrencySubunit = this.currencyList.subunitFor(baseCurrency);
        const counterCurrencySubunit = this.currencyList.subunitFor(counterCurrency);
        const subunitDifference = baseCurrencySubunit - counterCurrencySubunit;

        const adjustedRatio = String(Num.fromNumber(ratio).base10(subunitDifference));

        const counterValue = money.multiply(adjustedRatio, roundingMode);

        return new Money(counterValue.amount, counterCurrency);
    }
}
