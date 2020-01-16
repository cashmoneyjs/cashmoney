import { RoundingMode } from "./rounding";
import { numeric } from "./types";

export interface Calculator {
    compare(a: string, b: string): number;
    add(amount: string, addend: string): string;
    subtract(amount: string, subtrahend: string): string;
    multiply(amount: string, multiplier: numeric): string;
    divide(amount: string, divisor: numeric): string;
    ceil(num: string): string;
    floor(num: string): string;
    absolute(num: string): string;
    round(num: numeric, roundingMode: RoundingMode): string;
    share(amount: string, ratio: numeric, total: numeric): string;
    mod(amount: string, divisor: numeric): string;
}
