import MoneyFormatter from "../formatter";
import RoundedMoney from "../roundedmoney";
import {
    CODE as BITCOIN_CODE,
    SYMBOL as BITCOIN_SYMBOL,
} from "../currencylists/bitcoin";
import { trimTrailingDecimalPlaceZeroes } from "../_util";

export default class BitcoinMoneyFormatter implements MoneyFormatter {
    private readonly trimTrailingZeroes: boolean;

    public constructor(trimTrailingZeroes: boolean = false) {
        this.trimTrailingZeroes = trimTrailingZeroes;
    }

    public format(money: RoundedMoney): string {
        if (money.currency.code !== BITCOIN_CODE) {
            throw new Error("Bitcoin Formatter can only format Bitcoin currency.");
        }

        let amount = money.amount;
        if (this.trimTrailingZeroes === true) {
            amount = trimTrailingDecimalPlaceZeroes(amount);
        }

        return BITCOIN_SYMBOL + amount;
    }
}
