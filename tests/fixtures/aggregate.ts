import Money from "src/money";
import Currency from "src/currency";
import { numeric } from "src/types";

const EUR = new Currency("EUR");

function M(value: numeric): Money {
    return new Money(value, EUR);
}

export const sumExamples = [
    [[M(5), M(10), M(15)], M(30)],
    [[M(-5), M(-10), M(-15)], M(-30)],
    [[M(0)], M(0)],
    [[M(-5), M(0), M(5)], M(0)],
];

export const minExamples = [
    [[M(5), M(10), M(15)], M(5)],
    [[M(-5), M(-10), M(-15)], M(-15)],
    [[M(0)], M(0)],
    [[M(-5), M(5)], M(-5)],
];

export const maxExamples = [
    [[M(5), M(10), M(15)], M(15)],
    [[M(-5), M(-10), M(-15)], M(-5)],
    [[M(0)], M(0)],
    [[M(-5), M(5)], M(5)],
];

export const avgExamples = [
    [[M(5), M(10), M(15)], M(10)],
    [[M(-5), M(-10), M(-15)], M(-10)],
    [[M(0)], M(0)],
    [[M(-5), M(5)], M(0)],
    [[M(-5), M(0), M(5)], M(0)],
];
