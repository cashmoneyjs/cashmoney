import Currency from "./currency";

export default interface CurrencyList {
    contains(currency: Currency): boolean;
    subunitFor(currency: Currency): number;
    [Symbol.iterator](): IterableIterator<Currency>;
}
