import PreciseMoney from "./precisemoney";
import type Currency from "./currency";
import type CurrencyList from "./currencylist";
import type Exchange from "./exchange";

export default class Converter {
    private readonly currencyList: CurrencyList;
    private readonly exchange: Exchange;

    public constructor(currencyList: CurrencyList, exchange: Exchange) {
        this.currencyList = currencyList;
        this.exchange = exchange;
    }

    public convert(money: PreciseMoney, counterCurrency: Currency) {
        const baseCurrency = money.currency;
        const ratio = this.exchange.quote(baseCurrency, counterCurrency).conversionRatio;

        const baseCurrencySubunit = this.currencyList.subunitFor(baseCurrency);
        const counterCurrencySubunit = this.currencyList.subunitFor(counterCurrency);
        const subunitDifference = baseCurrencySubunit - counterCurrencySubunit;

        const adjustedRatio = ratio.shiftLeft(subunitDifference);

        const counterValue = money.multiply(adjustedRatio);

        return new PreciseMoney(counterValue.num, counterCurrency);
    }
}
