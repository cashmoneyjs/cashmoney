import { Money } from "./money";
import Currency from "./currency";

export default interface MoneyParser {
    parse(money: string, forceCurrency?: Currency): Money;
}
