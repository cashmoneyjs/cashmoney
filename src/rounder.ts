import PreciseMoney from "./precisemoney";
import type RoundedMoney from "./roundedmoney";
import type CurrencyList from "./currencylist";
import { RoundingMode } from "@cashmoney/number";

export default class MoneyRounder {
    private readonly currencyList: CurrencyList;
    private readonly defaultRoundingMode: RoundingMode;

    public constructor(currencyList: CurrencyList, defaultRoundingMode: RoundingMode = RoundingMode.ROUND_HALF_EVEN) {
        this.currencyList = currencyList;
        this.defaultRoundingMode = defaultRoundingMode;
    }

    public round(money: PreciseMoney, roundingMode?: RoundingMode): RoundedMoney {
        if (roundingMode === undefined) {
            roundingMode = this.defaultRoundingMode;
        }

        const places = this.currencyList.subunitFor(money.currency);
        return money.roundToDecimalPlaces(places, roundingMode);
    }

    public roundWithDelta(money: PreciseMoney, roundingMode?: RoundingMode): [RoundedMoney, PreciseMoney] {
        const roundedMoney = this.round(money, roundingMode);

        // To avoid encouraging everyone else to do this (because it is almost
        // always a bad idea) we do it ourselves here.
        const tempPreciseRoundedMoney = new PreciseMoney(roundedMoney.num, money.currency);
        const delta = tempPreciseRoundedMoney.subtract(money);

        return [roundedMoney, delta];
    }
}
