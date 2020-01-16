import { Currency } from "./currency";

export interface CurrencyList {
    contains(currency: Currency): boolean;
    subunitFor(currency: Currency): number;
    [Symbol.iterator](): Iterable<Currency>;
}
