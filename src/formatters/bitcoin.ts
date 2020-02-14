import MoneyFormatter from "../formatter";
import RoundedMoney from "../roundedmoney";
import {
    CODE as BITCOIN_CODE,
    SYMBOL as BITCOIN_SYMBOL,
} from "../currencylists/bitcoin";

export default class BitcoinMoneyFormatter implements MoneyFormatter {
    public format(money: RoundedMoney): string {
        if (money.currency.code !== BITCOIN_CODE) {
            throw new Error("Bitcoin Formatter can only format Bitcoin currency.");
        }

        return BITCOIN_SYMBOL + money.amount;
    }
}
