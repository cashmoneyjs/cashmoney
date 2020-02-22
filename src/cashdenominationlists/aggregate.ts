import Currency from "../currency";
import CashDenominationList from "../cashdenominationlist";

export default class AggregateCashDenominationList implements CashDenominationList {
    private readonly cashDenominationLists: ReadonlyArray<CashDenominationList>;

    public constructor(cashDenominationLists: ReadonlyArray<CashDenominationList>) {
        this.cashDenominationLists = cashDenominationLists;
    }

    public contains(currency: Currency): boolean {
        for (const denominationList of this.cashDenominationLists) {
            if (denominationList.contains(currency) === true) {
                return true;
            }
        }

        return false;
    }

    public stepFor(currency: Currency): number {
        for (const denominationList of this.cashDenominationLists) {
            if (denominationList.contains(currency) === true) {
                return denominationList.stepFor(currency);
            }
        }

        throw new Error(`Cannot find currency ${currency.code}.`);
    }
}
