import { RoundingMode } from "./rounding";
import { IntString, numeric } from "./types";

export default interface Calculator {
    compare(a: numeric, b: numeric): number;
    add(amount: IntString, addend: IntString): IntString;
    subtract(amount: IntString, subtrahend: IntString): IntString;
    multiply(amount: IntString, multiplier: numeric): string;
    divide(amount: IntString, divisor: numeric): string;
    ceil(num: numeric): IntString;
    floor(num: numeric): IntString;
    absolute(num: IntString): IntString;
    round(num: numeric, roundingMode: RoundingMode): IntString;
    share(amount: IntString, ratio: numeric, total: numeric): IntString;
    mod(amount: IntString, divisor: IntString): IntString;
}
