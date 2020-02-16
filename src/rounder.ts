import PreciseMoney from "./precisemoney";
import RoundedMoney from "./roundedmoney";
import CurrencyList from "./currencylist";
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
}
