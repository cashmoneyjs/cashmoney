import Currency from "./currency";
import CurrencyPair from "./currencypair";

export default interface Exchange {
    quote(baseCurrency: Currency, counterCurrency: Currency): CurrencyPair;
}
