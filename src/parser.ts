import { Money } from "./money";
import { Currency } from "./currency";

export interface MoneyParser {
    parse(money: string, forceCurrency?: Currency): Money;
}
