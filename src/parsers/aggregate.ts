import MoneyParser from "../parser";
import PreciseMoney from "../precisemoney";

export default class AggregateMoneyParser implements MoneyParser {
    private readonly parsers: ReadonlyArray<MoneyParser>;

    public constructor(parsers: ReadonlyArray<MoneyParser>) {
        if (parsers.length === 0) {
            throw new Error("Cannot initialize aggregate money parser without any child parsers");
        }

        this.parsers = parsers;
    }

    public parse(input: string): PreciseMoney {
        for (const parser of this.parsers) {
            try {
                return parser.parse(input);
            } catch (e) {
            }
        }

        throw new Error("Cannot parse '" + input + "' to Money.");
    }
}
