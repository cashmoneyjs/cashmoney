import { Currency } from "./currency";
import { CurrencyPair } from "./currencypair";

export interface Exchange {
    quote(baseCurrency: Currency, counterCurrency: Currency): CurrencyPair;
}
