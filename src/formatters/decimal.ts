import MoneyFormatter from "../formatter";
import RoundedMoney from "../roundedmoney";

export default class DecimalMoneyFormatter implements MoneyFormatter {
    public format(money: RoundedMoney): string {
        return money.amount;
    }
}
