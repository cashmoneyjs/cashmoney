import { Test, TestCases, Expect } from "alsatian";

import Calculator from "src/calculator";
import { IntString, numeric } from "src/types";
import { RoundingMode } from "src/rounding";

import { compareLessExamples, compareEqualExamples } from "fixtures/compare";
import { additionExamples, subtractionExamples, multiplicationExamples, divisionExamples, divisionExactExamples } from "fixtures/arithmetic";
import { ceilExamples, floorExamples, roundExamples } from "fixtures/rounding";
import { absoluteExamples, modExamples } from "fixtures/maths";

const shareExamples = [
    ["10", 2, 4, "5"],
];

export default abstract class AbstractCalculatorTest {
    protected abstract getCalculator(): Calculator;

    @TestCases(compareLessExamples)
    @Test("it compares values less")
    public itComparesValuesLess(left: numeric, right: numeric) {
        const actualLessThan = this.getCalculator().compare(left, right);
        Expect(actualLessThan).toBeLessThan(0);

        const actualGreaterThan = this.getCalculator().compare(right, left);
        Expect(actualGreaterThan).toBeGreaterThan(0);
    }

    @TestCases(compareEqualExamples)
    @Test("it compares values")
    public itComparesValues(left: numeric, right: numeric) {
        const result1 = this.getCalculator().compare(left, right);
        Expect(result1).toBe(0);

        const result2 = this.getCalculator().compare(right, left);
        Expect(result2).toBe(0);
    }

    @TestCases(additionExamples)
    @Test("it adds two values")
    public itAddsTwoValues(value1: IntString, value2: IntString, expected: IntString) {
        const actual = this.getCalculator().add(value1, value2);
        Expect(actual).toBe(expected);
    }

    @TestCases(subtractionExamples)
    @Test("it subtracts one value from another")
    public itSubtractsOneValueFromAnother(value1: IntString, value2: IntString, expected: IntString) {
        const actual = this.getCalculator().subtract(value1, value2);
        Expect(actual).toBe(expected);
    }

    @TestCases(multiplicationExamples)
    @Test("it multiplies one value by another")
    public itMultipliesOneValueByAnother(value1: IntString, value2: numeric, expected: string) {
        const actual = this.getCalculator().multiply(value1, value2);
        Expect(actual).toBe(expected);
    }

    @TestCases(divisionExamples)
    @Test("it divides one value by another")
    public itDividesOneValueByAnother(value1: IntString, value2: numeric, expected: string) {
        const actual = this.getCalculator().divide(value1, value2);
        const modExpected = expected.substr(0, actual.length);
        Expect(actual).toBe(modExpected);
    }

    @TestCases(divisionExactExamples)
    @Test("it divides one value by another exactly")
    public itDividesOneValueByAnotherExact(value1: IntString, value2: numeric, expected: IntString) {
        const actual = this.getCalculator().divide(value1, value2);
        Expect(actual).toBe(expected);
    }

    @TestCases(ceilExamples)
    @Test("it ceils a value")
    public itCeilsAValue(value: numeric, expected: IntString) {
        const actual = this.getCalculator().ceil(value);
        Expect(actual).toBe(expected);
    }

    @TestCases(floorExamples)
    @Test("it floors a value")
    public itFloorsAValue(value: numeric, expected: IntString) {
        const actual = this.getCalculator().floor(value);
        Expect(actual).toBe(expected);
    }

    @TestCases(absoluteExamples)
    @Test("it calculates the absolute value")
    public itCalculatesTheAbsoluteValue(value: IntString, expected: IntString) {
        const actual = this.getCalculator().absolute(value);
        Expect(actual).toBe(expected);
    }

    @TestCases(roundExamples)
    @Test("it rounds a value")
    public itRoundsAValue(value: numeric, mode: RoundingMode, expected: IntString) {
        const actual = this.getCalculator().round(value, mode);
        Expect(actual).toBe(expected);
    }

    @TestCases(shareExamples)
    @Test("it shares a value")
    public itSharesAValue(value: IntString, ratio: numeric, total: numeric, expected: IntString) {
        const actual = this.getCalculator().share(value, ratio, total);
        Expect(actual).toBe(expected);
    }

    @TestCases(modExamples)
    @Test("it calculates the modulus of a value")
    public itCalculatesTheModulusOfAValue(amount: IntString, divisor: IntString, expected: IntString) {
        const actual = this.getCalculator().mod(amount, divisor);
        Expect(actual).toBe(expected);
    }
}
