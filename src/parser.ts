import type PreciseMoney from "./precisemoney";

export default interface MoneyParser {
    parse(input: string): PreciseMoney;
}
