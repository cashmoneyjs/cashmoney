import type Currency from "./currency";

export default interface CurrencyList {
    contains(currency: Currency): boolean;
    nameFor(currency: Currency): string;
    subunitFor(currency: Currency): number;
    [Symbol.iterator](): IterableIterator<Currency>;
}
