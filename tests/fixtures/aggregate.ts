import PreciseMoney from "src/precisemoney";
import Currency from "src/currency";

const EUR = new Currency("EUR");

function PM(value: number): PreciseMoney {
    return new PreciseMoney(value, EUR);
}

export const sumExamples = [
    [[PM(5), PM(10), PM(15)], PM(30)],
    [[PM(-5), PM(-10), PM(-15)], PM(-30)],
    [[PM(0)], PM(0)],
    [[PM(-5), PM(0), PM(5)], PM(0)],
];

export const minExamples = [
    [[PM(5), PM(10), PM(15)], PM(5)],
    [[PM(-5), PM(-10), PM(-15)], PM(-15)],
    [[PM(0)], PM(0)],
    [[PM(-5), PM(5)], PM(-5)],
];

export const maxExamples = [
    [[PM(5), PM(10), PM(15)], PM(15)],
    [[PM(-5), PM(-10), PM(-15)], PM(-5)],
    [[PM(0)], PM(0)],
    [[PM(-5), PM(5)], PM(5)],
];

export const avgExamples = [
    [[PM(5), PM(10), PM(15)], PM(10)],
    [[PM(-5), PM(-10), PM(-15)], PM(-10)],
    [[PM(0)], PM(0)],
    [[PM(-5), PM(5)], PM(0)],
    [[PM(-5), PM(0), PM(5)], PM(0)],
];
