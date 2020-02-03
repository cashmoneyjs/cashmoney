import { TestFixture, Test, TestCases, Expect } from "alsatian";

import Money from "src/money";
import Currency from "src/currency";
import { RoundingMode } from "src/rounding";
import { numeric } from "src/types";

import { sumExamples, minExamples, maxExamples, avgExamples } from "fixtures/aggregate";
import { roundExamples } from "fixtures/rounding";

const AMOUNT = 10;
const CURRENCY = "EUR";
const OTHER_CURRENCY = "USD";

@TestFixture("Money")
export default class MoneyTest {
    @TestCases(MoneyTest.equalityExamples)
    @Test("it equals to another money")
    public itEqualsToAnotherMoney(amount: number, currency: Currency, equality: boolean) {
        const money = new Money(AMOUNT, new Currency(CURRENCY));

        const compareTo = new Money(amount, currency);
        Expect(money.equals(compareTo)).toBe(equality);
        // Test Dinero.js API compatibility method
        Expect(money.equalsTo(compareTo)).toBe(equality);
    }

    @TestCases(MoneyTest.comparisonExamples)
    @Test("it compares two amounts")
    public itComparesTwoAmounts(otherAmount: number, result: number) {
        const money = new Money(AMOUNT, new Currency(CURRENCY));
        const other = new Money(otherAmount, new Currency(CURRENCY));

        Expect(money.compare(other)).toBe(result);
        Expect(money.greaterThan(other)).toBe(result === 1);
        Expect(money.greaterThanOrEqual(other)).toBe(result >= 0);
        Expect(money.lessThan(other)).toBe(result === -1);
        Expect(money.lessThanOrEqual(other)).toBe(result <= 0);

        if (result === 0) {
            Expect(money).toBe(other);
        } else {
            Expect(money).not.toBe(other);
        }
    }

    @TestCases(roundExamples)
    @Test("it multiplies the amount")
    public itMultipliesTheAmount(multiplier: numeric, roundingMode: RoundingMode, expected: string) {
        const money = new Money(1, new Currency(CURRENCY));
        const multipliedMoney = money.multiply(multiplier, roundingMode);

        Expect(multipliedMoney instanceof Money).toBeTruthy();
        Expect(multipliedMoney.amount).toBe(expected);
    }

    @Test("multiplying by one gives same amount")
    public multiplyingByOneGivesSameAmount() {
        const money = new Money(AMOUNT, new Currency(CURRENCY));
        // TODO: One day typescript will hopefully let you sensibly iterate over all
        // the keys in an enum, and let you index into it. When this happens, this
        // case should be tested with all rounding modes and observe that it always
        // gives the same result (because no rounding should be necessary).
        const multipliedMoney = money.multiply(1);

        Expect(multipliedMoney instanceof Money).toBeTruthy();
        Expect(multipliedMoney.amount).toBe(String(AMOUNT));
        Expect(multipliedMoney).toEqual(money);
    }

    @TestCases(MoneyTest.invalidOperandExamples)
    @Test("it throws an exception when operand is invalid during multiplication")
    public itThrowsAnExceptionWhenOperandIsInvalidDuringMultiplication(operand: any) {
        const money = new Money(1, new Currency(CURRENCY));
        const throwFn = () => money.multiply(operand as numeric);
        Expect(throwFn).toThrow();
    }

    @TestCases(roundExamples)
    @Test("it divides the amount")
    public itDividesTheAmount(divisor: numeric, roundingMode: RoundingMode, expected: string) {
        if (typeof divisor === "string") {
            divisor = parseFloat(divisor);
        }

        const money = new Money(1, new Currency(CURRENCY));
        const dividedMoney = money.divide(1 / divisor, roundingMode);

        Expect(dividedMoney instanceof Money).toBeTruthy();
        Expect(dividedMoney.amount).toBe(expected);
    }

    @Test("dividing by one gives same amount")
    public dividingByOneGivesSameAmount() {
        const money = new Money(AMOUNT, new Currency(CURRENCY));
        // TODO: One day typescript will hopefully let you sensibly iterate over all
        // the keys in an enum, and let you index into it. When this happens, this
        // case should be tested with all rounding modes and observe that it always
        // gives the same result (because no rounding should be necessary).
        const dividedMoney = money.divide(1);

        Expect(dividedMoney instanceof Money).toBeTruthy();
        Expect(dividedMoney.amount).toBe(String(AMOUNT));
        Expect(dividedMoney).toEqual(money);
    }

    @TestCases(MoneyTest.invalidOperandExamples)
    @Test("it throws an exception when operand is invalid during division")
    public itThrowsAnExceptionWhenOperandIsInvalidDuringDivision(operand: any) {
        const money = new Money(1, new Currency(CURRENCY));
        const throwFn = () => money.divide(operand as numeric);
        Expect(throwFn).toThrow();
    }

    @TestCases(MoneyTest.allocationExamples)
    @Test("it allocates amount")
    public itAllocatesAmount(amount: number, ratios: number[], results: number[]) {
        const money = new Money(amount, new Currency(CURRENCY));
        const allocated = money.allocate(ratios);

        for (const [key, money] of allocated.entries()) {
            const compareTo = new Money(results[key], money.currency);
            Expect(money).toBe(compareTo);
        }
    }

    @TestCases(MoneyTest.allocationNamedExamples)
    @Test("it allocates named amounts")
    public itAllocatesNamedAmounts(amount: number, ratios: { [name: string]: number }, results: { [name: string]: number }) {
        const money = new Money(amount, new Currency(CURRENCY));
        const allocated = money.allocateNamed(ratios);

        for (const [key, money] of Object.entries(allocated)) {
            const compareTo = new Money(results[key], money.currency);
            Expect(money).toBe(compareTo);
        }
    }

    @TestCases(MoneyTest.allocationTargetExamples)
    @Test("it allocates amount to N targets")
    public itAllocatesAmountToNTargets(amount: number, target: number, results: number[]) {
        const money = new Money(amount, new Currency(CURRENCY));
        const allocated = money.allocateTo(target);

        for (const [key, money] of allocated.entries()) {
            const compareTo = new Money(results[key], money.currency);
            Expect(compareTo).toBe(money);
        }
    }

    @TestCases(MoneyTest.comparatorExamples)
    @Test("it has comparators")
    public itHasComparators(amount: numeric, isZero: boolean, isPositive: boolean, isNegative: boolean) {
        const money = new Money(amount, new Currency(CURRENCY));

        Expect(money.isZero).toBe(isZero);
        Expect(money.isPositive).toBe(isPositive);
        Expect(money.isNegative).toBe(isNegative);
    }

    @TestCases(MoneyTest.absoluteExamples)
    @Test("it calculates the absolute amount")
    public itCalculatesTheAbsoluteAmount(amount: numeric, expected: string) {
        const money = new Money(amount, new Currency(CURRENCY));
        const absMoney = money.absolute();

        Expect(absMoney.amount).toBe(expected);
    }

    @TestCases(MoneyTest.negativeExamples)
    @Test("it calculates the negative amount")
    public itCalculatesTheNegativeAmount(amount: numeric, expected: string) {
        const money = new Money(amount, new Currency(CURRENCY));
        const negativeMoney = money.negative();

        Expect(negativeMoney.amount).toBe(expected);
    }

    @TestCases(MoneyTest.modExamples)
    @Test("it calculates the modulus of an amount")
    public itCalculatesTheModulusOfAnAmount(left: number, right: number, expected: string) {
        const leftMoney = new Money(left, new Currency(CURRENCY));
        const rightMoney = new Money(right, new Currency(CURRENCY));

        const modMoney = leftMoney.mod(rightMoney);

        Expect(modMoney instanceof Money).toBeTruthy();
        Expect(modMoney.amount).toBe(expected);
    }

    @TestCases(MoneyTest.percentageExamples)
    @Test("it calculates percentages")
    public itCalculatesPercentages(amount: number, percent: number, roundingMode: RoundingMode, expected: string) {
        const money = new Money(amount, new Currency(CURRENCY));
        const smallerMoney = money.percentage(percent, roundingMode);

        Expect(smallerMoney instanceof Money).toBeTruthy();
        Expect(smallerMoney.amount).toBe(expected);
    }

    @TestCases(MoneyTest.invalidPercentageExamples)
    @Test("it throws for invalid percentages")
    public itThrowsForInvalidPercentages(percent: number) {
        const money = new Money(AMOUNT, new Currency(CURRENCY));

        const throwFn = (): void => {
            money.percentage(percent);
        };

        Expect(throwFn).toThrowError(RangeError, "Percentage values must be between 0 and 100.");
    }

    @Test("it converts to JSON")
    public itConvertsToJson() {
        const money = new Money(350, new Currency("EUR"));

        const jsonStringifyOutput = JSON.stringify(money);
        Expect(jsonStringifyOutput).toBe('{"amount":"350","currency":"EUR"}');

        const toJsonOutput = money.toJSON();
        Expect(toJsonOutput).toEqual({"amount": "350", "currency": "EUR"});
    }

    @Test("it supports max safe integer")
    public itSupportsMaxSafeInteger() {
        const currency = new Currency(CURRENCY);

        const one = new Money(1, new Currency(CURRENCY));

        const maxInt = new Money(Number.MAX_SAFE_INTEGER, currency);
        const maxIntPlusOne = (new Money(Number.MAX_SAFE_INTEGER, currency)).add(one);
        const maxIntMinusOne = (new Money(Number.MAX_SAFE_INTEGER, currency)).subtract(one);

        Expect(maxInt instanceof Money).toBeTruthy();
        Expect(maxIntPlusOne instanceof Money).toBeTruthy();
        Expect(maxIntMinusOne instanceof Money).toBeTruthy();
    }

    @Test("it returns ratio of")
    public itReturnsRatioOf() {
        const currency = new Currency(CURRENCY);

        const zero = new Money(0, currency);
        const three = new Money(3, currency);
        const six = new Money(6, currency);

        Expect(zero.ratioOf(six)).toBe("0");
        Expect(three.ratioOf(six)).toBe("0.5");
        Expect(three.ratioOf(three)).toBe("1");
        Expect(six.ratioOf(three)).toBe("2");
    }

    @Test("it throws when calculating ratio of zero")
    public itThrowsWhenCalculatingRatioOfZero() {
        const currency = new Currency(CURRENCY);

        const zero = new Money(0, currency);
        const six = new Money(6, currency);

        const throwFn = () => six.ratioOf(zero);

        Expect(throwFn).toThrow();
    }

    @TestCases(sumExamples)
    @Test("it calculates sum")
    public itCalculatesSum(values: Money[], sum: Money) {
        Expect(Money.sum(...values)).toBe(sum);
    }

    @TestCases(minExamples)
    @Test("it calculates min")
    public itCalculatesMin(values: Money[], min: Money) {
        Expect(Money.min(...values)).toBe(min);
    }

    @TestCases(maxExamples)
    @Test("it calculates max")
    public itCalculatesMax(values: Money[], max: Money) {
        Expect(Money.max(...values)).toBe(max);
    }

    @TestCases(avgExamples)
    @Test("it calculates avg")
    public itCalculatesAvg(values: Money[], avg: Money) {
        Expect(Money.avg(...values)).toBe(avg);
    }

    public static equalityExamples() {
        return [
            [AMOUNT, new Currency(CURRENCY), true],
            [AMOUNT + 1, new Currency(CURRENCY), false],
            [AMOUNT, new Currency(OTHER_CURRENCY), false],
            [AMOUNT + 1, new Currency(OTHER_CURRENCY), false],
            [String(AMOUNT), new Currency(CURRENCY), true],
            [String(AMOUNT) + ".000", new Currency(CURRENCY), true],
        ];
    }

    public static comparisonExamples() {
        return [
            [AMOUNT, 0],
            [AMOUNT - 1, 1],
            [AMOUNT + 1, -1],
        ];
    }

    public static invalidOperandExamples() {
        return [
            [[]],
            [false],
            ['operand'],
            [null],
            [{}],
        ];
    }

    public static allocationExamples() {
        return [
            [100, [1, 1, 1], [34, 33, 33]],
            [101, [1, 1, 1], [34, 34, 33]],
            [5, [3, 7], [2, 3]],
            [5, [7, 3], [4, 1]],
            [5, [7, 3, 0], [4, 1, 0]],
            [-5, [7, 3], [-3, -2]],
            [5, [0, 7, 3], [0, 4, 1]],
            [5, [7, 0, 3], [4, 0, 1]],
            [5, [0, 0, 1], [0, 0, 5]],
            [5, [0, 3, 7], [0, 2, 3]],
            [0, [0, 0, 1], [0, 0, 0]],
            [2, [1, 1, 1], [1, 1, 0]],
            [1, [1, 1], [1, 0]],
            [1, [0.33, 0.66], [0, 1]],
            [101, [3, 7], [30, 71]],
            [101, [7, 3], [71, 30]],
            [500, [1, 1, 1], [167, 167, 166]],
            [1000, [1, 1, 1], [334, 333, 333]],
        ];
    }

    public static allocationNamedExamples() {
        return [
            [101, {'foo': 7, 'bar': 3}, {'foo': 71, 'bar': 30}],
        ];
    }

    public static allocationTargetExamples() {
        return [
            [15, 2, [8, 7]],
            [10, 2, [5, 5]],
            [15, 3, [5, 5, 5]],
            [10, 3, [4, 3, 3]],
        ];
    }

    public static comparatorExamples() {
        return [
            [1, false, true, false],
            [0, true, false, false],
            [-1, false, false, true],
            ['1', false, true, false],
            ['0', true, false, false],
            ['-1', false, false, true],
        ];
    }

    public static absoluteExamples() {
        return [
            [1, '1'],
            [0, '0'],
            [-1, '1'],
            ['1', '1'],
            ['0', '0'],
            ['-1', '1'],
        ];
    }

    public static negativeExamples() {
        return [
            [1, '-1'],
            [0, '0'],
            [-1, '1'],
            ['1', '-1'],
            ['0', '0'],
            ['-1', '1'],
        ];
    }

    public static modExamples() {
        return [
            [11, 5, '1'],
            [9, 3, '0'],
            [1006, 10, '6'],
            [1007, 10, '7'],
        ];
    }

    public static percentageExamples() {
        return [
            [350, 0, RoundingMode.ROUND_HALF_UP, '0'],
            [350, 100, RoundingMode.ROUND_HALF_UP, '350'],
            [350, 50, RoundingMode.ROUND_HALF_UP, '175'],
            [10, 100, RoundingMode.ROUND_HALF_UP, '10'],
            [10, 30, RoundingMode.ROUND_HALF_UP, '3'],
            [10, 25, RoundingMode.ROUND_HALF_UP, '3'],
            [10, 24, RoundingMode.ROUND_HALF_UP, '2'],
            [10, 25, RoundingMode.ROUND_HALF_DOWN, '2'],
            [100, 25, RoundingMode.ROUND_HALF_UP, '25'],
            [100, 25, RoundingMode.ROUND_HALF_DOWN, '25'],
        ];
    }

    public static invalidPercentageExamples() {
        return [
            [100.01],
            [101],
            [1000],
            [-0.01],
            [-1],
            [-101],
        ];
    }
}
