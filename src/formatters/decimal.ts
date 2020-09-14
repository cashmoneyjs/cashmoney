import type MoneyFormatter from "../formatter";
import type RoundedMoney from "../roundedmoney";

export default class DecimalMoneyFormatter implements MoneyFormatter {
    public format(money: RoundedMoney): string {
        return money.amount;
    }
}
