import type Currency from "./currency";

export default interface CashDenominationList {
    contains(currency: Currency): boolean;
    stepFor(currency: Currency): number;
}
