import { Money } from "../money";
import Currency from "../currency";
import MoneyParser from "../parser";

export class AggregateMoneyParser implements MoneyParser {
    private parsers: Array<MoneyParser>;

    public constructor(parsers: Array<MoneyParser>) {
        if (parsers.length === 0) {
            throw new Error("Cannot initialize aggregate money parser without any child parsers");
        }

        this.parsers = parsers.slice(0);
    }

    public parse(money: string, forceCurrency?: Currency): Money {
        for (const parser of this.parsers) {
            try {
                return parser.parse(money, forceCurrency);
            } catch (e) {
            }
        }

        throw new Error("Unable to parse " + money);
    }
}
