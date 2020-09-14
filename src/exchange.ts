import type Currency from "./currency";
import type CurrencyPair from "./currencypair";

export default interface Exchange {
    quote(baseCurrency: Currency, counterCurrency: Currency): CurrencyPair;
}
