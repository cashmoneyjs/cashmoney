import Exchange from "../exchange";
import Currency from "../currency";
import CurrencyPair from "../currencypair";

interface CurrencyRatioMap {
    [baseCurrencyCode: string]: {
        [counterCurrencyCode: string]: number;
    };
}

export default class FixedExchange implements Exchange {
    private list: CurrencyRatioMap;

    public constructor(list: CurrencyRatioMap) {
        this.list = list;
    }

    public quote(baseCurrency: Currency, counterCurrency: Currency): CurrencyPair {
        if (
            typeof this.list[baseCurrency.code] !== "undefined" &&
            typeof this.list[baseCurrency.code][counterCurrency.code] !== "undefined"
        ) {
            return new CurrencyPair(
                baseCurrency,
                counterCurrency,
                this.list[baseCurrency.code][counterCurrency.code]
            );
        }

        throw new Error(
            "Cannot resolve a currency pair for currencies: " + baseCurrency.code + "/" + counterCurrency.code
        );
    }
}
