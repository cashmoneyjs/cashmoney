import type PreciseMoney from "./precisemoney";
import type RoundedMoney from "./roundedmoney";
import type CurrencyList from "./currencylist";
import type CashDenominationList from "./cashdenominationlist";
import { RoundingMode } from "@cashmoney/number";

export default class CashRounder {
    private readonly currencyList: CurrencyList;
    private readonly cashDenominationList: CashDenominationList;
    private readonly defaultRoundingMode: RoundingMode;

    public constructor(
        currencyList: CurrencyList,
        cashDenominationList: CashDenominationList,
        defaultRoundingMode: RoundingMode = RoundingMode.ROUND_HALF_EVEN
    ) {
        this.currencyList = currencyList;
        this.cashDenominationList = cashDenominationList;
        this.defaultRoundingMode = defaultRoundingMode;
    }

    public round(money: PreciseMoney, roundingMode?: RoundingMode): RoundedMoney {
        if (roundingMode === undefined) {
            roundingMode = this.defaultRoundingMode;
        }

        const places = this.currencyList.subunitFor(money.currency);
        const step = this.cashDenominationList.stepFor(money.currency);

        return money.divide(step).roundToDecimalPlaces(places).multiplyAndRound(step);
    }

    public adjust(money: RoundedMoney, roundingMode?: RoundingMode): RoundedMoney {
        if (roundingMode === undefined) {
            roundingMode = this.defaultRoundingMode;
        }

        const places = this.currencyList.subunitFor(money.currency);
        if (money.subunit !== places) {
            throw new Error(`Cannot adjust rounded money of unknown rounding for ${money.currency}.`);
        }

        const step = this.cashDenominationList.stepFor(money.currency);

        return money.divideAndRound(step).multiplyAndRound(step);
    }
}
