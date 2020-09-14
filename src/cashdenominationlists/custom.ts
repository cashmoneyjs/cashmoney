import type Currency from "../currency";
import type CashDenominationList from "../cashdenominationlist";

interface DenominationMap {
    [currencyCode: string]: number;
}

export default class CustomCashDenominationList implements CashDenominationList {
    private readonly denominationMap: DenominationMap;

    public constructor(denominationMap: DenominationMap) {
        for (const [code, subunit] of Object.entries(denominationMap)) {
            if (Number.isInteger(subunit) === false || subunit < 0) {
                throw new Error(
                    `Currency ${code} does not have a valid step unit. Must be a positive integer.`
                );
            }
        }

        this.denominationMap = denominationMap;
    }

    public contains(currency: Currency): boolean {
        return typeof this.denominationMap[currency.code] !== "undefined";
    }

    public stepFor(currency: Currency): number {
        if (this.contains(currency) === false) {
            throw new Error(`Cannot find currency ${currency.code}.`);
        }

        return this.denominationMap[currency.code];
    }
}
