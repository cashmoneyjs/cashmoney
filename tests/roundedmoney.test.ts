/// <reference path="../src/alsatian-ambient.d.ts" />
import { TestFixture, Test, TestCases, Expect } from "alsatian";

import RoundedMoney from "src/roundedmoney";
import PreciseMoney from "src/precisemoney";
import Currency from "src/currency";
import { numeric } from "@cashmoney/number";

@TestFixture("Rounded Money")
export default class RoundedMoneyTest {
    @Test("it can create an array of money objects")
    public itCanCreateAnArrayOfMoneyObjects() {
        const amounts = ["1.23", "4.56", "7.89"];
        const currency = new Currency("CAD");

        const monies = RoundedMoney.fromArray(amounts, 2, currency);
        Expect(monies.length).toBe(3);

        Expect(monies[0] instanceof RoundedMoney).toBeTruthy();
        Expect(monies[0].amount).toBe("1.23");
        Expect(monies[0].currency).toBe(currency);

        Expect(monies[1] instanceof RoundedMoney).toBeTruthy();
        Expect(monies[1].amount).toBe("4.56");
        Expect(monies[1].currency).toBe(currency);

        Expect(monies[2] instanceof RoundedMoney).toBeTruthy();
        Expect(monies[2].amount).toBe("7.89");
        Expect(monies[2].currency).toBe(currency);
    }

    @TestCases(RoundedMoneyTest.inaccurateSubunitExamples)
    @Test("it throws an error when subunit is not accurate")
    public itThrowsWhenSubunitIsNotAccurate(amount: string, subunit: number) {
        const throwFn = () => new RoundedMoney(amount, subunit, new Currency("EUR"));
        Expect(throwFn).toThrowError(Error, "Amount was not properly rounded.");
    }

    public static inaccurateSubunitExamples() {
        return [
            ["100.1", 0],
            ["100.10", 0],
            ["100.12", 0],
            ["100.34", 1],
            ["100.100", 0],
            ["100.120", 0],
            ["100.120", 1],
            ["100.123", 0],
            ["100.456", 1],
            ["100.789", 2],
            ["100.1230", 0],
            ["100.4560", 1],
            ["100.7890", 2],
        ];
    }

    @TestCases(RoundedMoneyTest.equalityExamples)
    @Test("it equals to another money")
    public itEqualsToAnotherMoney(amount: numeric, subunit: number, currency: Currency, equality: boolean) {
        const money = new RoundedMoney(100, subunit, new Currency("EUR"));

        const compareTo = new RoundedMoney(amount, subunit, currency);
        Expect(money.equals(compareTo)).toBe(equality);
        Expect(money.equalTo(compareTo)).toBe(equality);
        Expect(money.equalsTo(compareTo)).toBe(equality);
        Expect(money.isEqualTo(compareTo)).toBe(equality);
    }

    public static equalityExamples() {
        return [
            [100, 2, new Currency("EUR"), true],
            [101, 2, new Currency("EUR"), false],
            [100, 2, new Currency("USD"), false],
            [101, 2, new Currency("AUD"), false],
            ["100", 2, new Currency("EUR"), true],
            ["100.00", 2, new Currency("EUR"), true],
            ["100.01", 2, new Currency("EUR"), false],
            ["100", 2, new Currency("USD"), false],
            ["100.00", 2, new Currency("USD"), false],
        ];
    }

    @TestCases(RoundedMoneyTest.comparisonExamples)
    @Test("it compares two amounts")
    public itComparesTwoAmounts(otherAmount: number, result: 0 | 1 | -1) {
        const money = new RoundedMoney(10, 2, new Currency("EUR"));
        const other = new RoundedMoney(otherAmount, 2, new Currency("EUR"));

        Expect(money.compare(other)).toBe(result);
        Expect(money.greaterThan(other)).toBe(result === 1);
        Expect(money.isGreaterThan(other)).toBe(result === 1);
        Expect(money.greaterThanOrEqual(other)).toBe(result >= 0);
        Expect(money.isGreaterThanOrEqualTo(other)).toBe(result >= 0);
        Expect(money.lessThan(other)).toBe(result === -1);
        Expect(money.isLessThan(other)).toBe(result === -1);
        Expect(money.lessThanOrEqual(other)).toBe(result <= 0);
        Expect(money.isLessThanOrEqualTo(other)).toBe(result <= 0);

        if (result === 0) {
            Expect(money).toBe(other);
        } else {
            Expect(money).not.toBe(other);
        }
    }

    public static comparisonExamples() {
        return [
            [10, 0],
            ["10.00", 0],
            ["9.99", 1],
            [9, 1],
            [8, 1],
            [1, 1],
            [-1, 1],
            [11, -1],
            [12, -1],
            [50, -1],
            ["10.01", -1],
        ];
    }

    @Test("it refuses to compare amounts with different currencies")
    public itRefusesToCompareAmountsWithDifferentCurrencies() {
        const money = new RoundedMoney(10, 2, new Currency("AUD"));
        const other = new RoundedMoney(10, 2, new Currency("USD"));

        const throwFn = () => money.compare(other);

        Expect(throwFn).toThrow();
    }

    @Test("it refuses to compare amounts with different precisions")
    public itRefusesToCompareAmountsWithDifferentPrecisions() {
        const currency = new Currency("USD");
        const money = new RoundedMoney("23.45", 2, currency);
        const other = new RoundedMoney("23.4567", 4, currency);

        const throwFn = () => money.compare(other);

        Expect(throwFn).toThrow();
    }

    @TestCases(RoundedMoneyTest.addExamples)
    @Test("it adds one or more amounts")
    public itAddsAmounts(addendAmounts: string[], expected: string) {
        const currency = new Currency("EUR");
        const money = new RoundedMoney(100, 2, currency);

        const addendMonies = addendAmounts.map(amount => new RoundedMoney(amount, 2, currency));
        const addResult = money.add(...addendMonies);

        Expect(addResult instanceof RoundedMoney).toBeTruthy();
        Expect(addResult).toBe(new RoundedMoney(expected, 2, currency));
        Expect(addResult.amount).toBe(expected);

        const plusResult = money.plus(...addendMonies);
        Expect(plusResult).toBe(addResult);
    }

    public static addExamples() {
        return [
            [["10"], "110.00"],
            [["10", "10"], "120.00"],
            [["100"], "200.00"],
            [["-10"], "90.00"],
            [["0"], "100.00"],
            [["-100"], "0.00"],
            [["5", "10", "15"], "130.00"],
            [["2.5"], "102.50"],
            [["0.1", "0.2"], "100.30"],
            [["0.1", "0.2", "0.3"], "100.60"],
            [["-0.5", "-1.5"], "98.00"],
            [["-2", "2"], "100.00"],
            [["1.3", "4.9"], "106.20"],
            [["99.99"], "199.99"],
        ];
    }

    @TestCases(RoundedMoneyTest.diffCurrencyRefusalExamples)
    @Test("it refuses to add amounts of different currencies")
    public itRefusesToAddAmountsOfDifferentCurrencies(addendMonies: RoundedMoney[]) {
        const currency = new Currency("EUR");
        const money = new RoundedMoney("100.00", 2, currency);

        const throwFn = () => money.add(...addendMonies);

        Expect(throwFn).toThrow();
    }

    @Test("it refuses to add amounts with different precisions")
    public itRefusesToAddAmountsWithDifferentPrecisions() {
        const currency = new Currency("NZD");
        const money = new RoundedMoney("34.56", 2, currency);
        const other = new RoundedMoney("34.5678", 4, currency);

        const throwFn = () => money.add(other);

        Expect(throwFn).toThrow();
    }

    @TestCases(RoundedMoneyTest.subtractExamples)
    @Test("it subtracts one or more amounts")
    public itSubtractsAmounts(subtrahendAmounts: string[], expected: string) {
        const currency = new Currency("EUR");
        const money = new RoundedMoney(100, 2, currency);

        const subtrahendMonies = subtrahendAmounts.map(amount => new RoundedMoney(amount, 2, currency));
        const subtractResult = money.subtract(...subtrahendMonies);

        Expect(subtractResult instanceof RoundedMoney).toBeTruthy();
        Expect(subtractResult).toBe(new RoundedMoney(expected, 2, currency));
        Expect(subtractResult.amount).toBe(expected);

        const minusResult = money.minus(...subtrahendMonies);
        Expect(minusResult).toBe(subtractResult);
    }

    public static subtractExamples() {
        return [
            [["10"], "90.00"],
            [["10", "10"], "80.00"],
            [["100"], "0.00"],
            [["75", "125"], "-100.00"],
            [["75", "-125"], "150.00"],
            [["-10"], "110.00"],
            [["0"], "100.00"],
            [["-100"], "200.00"],
            [["5", "5", "5"], "85.00"],
            [["5", "-10", "15"], "90.00"],
            [["2.5"], "97.50"],
            [["0.1", "0.2"], "99.70"],
            [["0.1", "0.2", "0.3"], "99.40"],
            [["-0.5", "-1.5"], "102.00"],
            [["-2", "2"], "100.00"],
            [["1.3", "4.9"], "93.80"],
            [["99.99"], "0.01"],
        ];
    }

    @TestCases(RoundedMoneyTest.diffCurrencyRefusalExamples)
    @Test("it refuses to subtract amounts of different currencies")
    public itRefusesToSubtractAmountsOfDifferentCurrencies(subtrahendMonies: RoundedMoney[]) {
        const currency = new Currency("EUR");
        const money = new RoundedMoney("100.00", 2, currency);

        const throwFn = () => money.subtract(...subtrahendMonies);

        Expect(throwFn).toThrow();
    }

    @Test("it refuses to subtract amounts with different precisions")
    public itRefusesToSubtractAmountsWithDifferentCurrencies() {
        const currency = new Currency("CAD");
        const money = new RoundedMoney("45.67", 2, currency);
        const other = new RoundedMoney("45.6789", 4, currency);

        const throwFn = () => money.add(other);

        Expect(throwFn).toThrow();
    }

    @TestCases(RoundedMoneyTest.multiplyExamples)
    @Test("it multiplies the amount")
    public itMultipliesTheAmount(multiplier: string, subunit: number) {
        const currency = new Currency("EUR");
        const money = new RoundedMoney(1, subunit, currency);
        const multiplyMoney = money.multiply(multiplier);

        Expect(multiplyMoney instanceof PreciseMoney).toBeTruthy();
        Expect(multiplyMoney).toBe(new PreciseMoney(multiplier, currency));
        Expect(multiplyMoney.amount).toBe(multiplier);

        const timesMoney = money.times(multiplier);
        Expect(timesMoney).toBe(multiplyMoney);

        const multipliedByMoney = money.multipliedBy(multiplier);
        Expect(multipliedByMoney).toBe(multiplyMoney);
    }

    @TestCases(RoundedMoneyTest.multiplyExamples)
    @Test("multiplying by zero always gives zero")
    public multiplyingByZeroAlwaysGivesZero(amount: string, subunit: number) {
        const currency = new Currency("EUR");
        const money = new RoundedMoney(amount, subunit, currency);
        const multipliedMoney = money.multiply(0);

        Expect(multipliedMoney instanceof PreciseMoney).toBeTruthy();
        Expect(multipliedMoney).toBe(new PreciseMoney(0, currency));
        Expect(multipliedMoney.amount).toBe("0");
    }

    @TestCases(RoundedMoneyTest.multiplyExamples)
    @Test("multiplying by one gives same amount")
    public multiplyingByOneGivesSameAmount(amount: string, subunit: number) {
        const currency = new Currency("EUR");
        const money = new RoundedMoney(amount, subunit, currency);
        const multipliedMoney = money.multiply(1);

        Expect(multipliedMoney instanceof PreciseMoney).toBeTruthy();
        Expect(multipliedMoney).toBe(new PreciseMoney(amount, currency));
        Expect(multipliedMoney.amount).toBe(amount);
    }

    public static multiplyExamples() {
        const numbers = ['1', '0.1', '0.5', '2', '10', '10.5', '100', '0', '-0.1', '-0.5', '-1', '-2', '-10', '-15.8', '-100'];
        return numbers.map(num => [num, 2]);
    }

    @TestCases(RoundedMoneyTest.invalidOperandExamples)
    @Test("it throws an exception when operand is invalid during multiplication")
    public itThrowsAnExceptionWhenOperandIsInvalidDuringMultiplication(operand: any) {
        const money = new RoundedMoney(1, 2, new Currency("EUR"));
        const throwFn = () => money.multiply(operand as numeric);
        Expect(throwFn).toThrow();
    }

    @TestCases(RoundedMoneyTest.divideExamples)
    @Test("it divides the amount")
    public itDividesTheAmount(divisor: string, _subunit: number, expected: string) {
        const currency = new Currency("EUR");
        const money = new RoundedMoney("10.00", 2, currency);
        const dividedMoney = money.divide(divisor);

        Expect(dividedMoney instanceof PreciseMoney).toBeTruthy();
        Expect(dividedMoney).toBe(new PreciseMoney(expected, currency));
        Expect(dividedMoney.amount).toBe(expected);
    }

    @TestCases(RoundedMoneyTest.divideExamples)
    @Test("dividing by one gives same amount")
    public dividingByOneGivesSameAmount(amount: string, subunit: number) {
        const currency = new Currency("EUR");
        const money = new RoundedMoney(amount, subunit, currency);
        const dividedMoney = money.divide(1);

        Expect(dividedMoney instanceof PreciseMoney).toBeTruthy();
        Expect(dividedMoney).toEqual(new PreciseMoney(amount, currency));
        Expect(dividedMoney.amount).toBe(amount);
    }

    public static divideExamples() {
        return [
            ["2", 2, "5"],
            ["5", 2, "2"],
            ["3", 2, "3.33333333333333333333"],
            ["2.5", 2, "4"],
            ["1", 2, "10"],
            ["0.5", 2, "20"],
            ["0.25", 2, "40"],
            ["0.2", 2, "50"],
        ];
    }

    @TestCases(RoundedMoneyTest.invalidOperandExamples)
    @Test("it throws an exception when operand is invalid during division")
    public itThrowsAnExceptionWhenOperandIsInvalidDuringDivision(operand: any) {
        const money = new RoundedMoney(1, 2, new Currency("EUR"));
        const throwFn = () => money.divide(operand as numeric);
        Expect(throwFn).toThrow();
    }

    @TestCases(RoundedMoneyTest.allocationExamples)
    @Test("it allocates amount")
    public itAllocatesAmount(money: RoundedMoney, ratios: number[], results: string[]) {
        const allocated = money.allocate(ratios);

        for (const [key, allocatedMoney] of allocated.entries()) {
            const compareTo = new RoundedMoney(results[key], money.subunit, money.currency);
            Expect(allocatedMoney).toBe(compareTo);
        }
    }

    public static allocationExamples() {
        const EUR = new Currency("EUR");
        const JPY = new Currency("JPY");

        return [
            [new RoundedMoney("100.00", 2, EUR), [1, 1, 1], ["33.34", "33.33", "33.33"]],
            [new RoundedMoney("101.00", 2, EUR), [1, 1, 1], ["33.67", "33.67", "33.66"]],
            [new RoundedMoney("100.01", 2, EUR), [1, 1, 1], ["33.34", "33.34", "33.33"]],
            [new RoundedMoney("100.00", 2, EUR), [1, 1], ["50.00", "50.00"]],
            [new RoundedMoney("101.00", 2, EUR), [1, 1], ["50.50", "50.50"]],
            [new RoundedMoney("5.00", 2, EUR), [3, 7], ["1.50", "3.50"]],
            [new RoundedMoney("0.05", 2, EUR), [3, 7], ["0.02", "0.03"]],
            [new RoundedMoney("5.00", 2, EUR), [7, 3], ["3.50", "1.50"]],
            [new RoundedMoney("0.05", 2, EUR), [7, 3], ["0.04", "0.01"]],
            [new RoundedMoney("5.00", 2, EUR), [7, 3, 0], ["3.50", "1.50", "0.00"]],
            [new RoundedMoney("0.05", 2, EUR), [7, 3, 0], ["0.04", "0.01", "0.00"]],
            [new RoundedMoney("-5.00", 2, EUR), [3, 7], ["-1.50", "-3.50"]],
            [new RoundedMoney("-0.05", 2, EUR), [3, 7], ["-0.01", "-0.04"]],
            [new RoundedMoney("-5.00", 2, EUR), [7, 3], ["-3.50", "-1.50"]],
            [new RoundedMoney("-0.05", 2, EUR), [7, 3], ["-0.03", "-0.02"]],
            [new RoundedMoney("5.00", 2, EUR), [0, 7, 3], ["0.00", "3.50", "1.50"]],
            [new RoundedMoney("0.05", 2, EUR), [0, 7, 3], ["0.00", "0.04", "0.01"]],
            [new RoundedMoney("5.00", 2, EUR), [7, 0, 3], ["3.50", "0.00", "1.50"]],
            [new RoundedMoney("0.05", 2, EUR), [7, 0, 3], ["0.04", "0.00", "0.01"]],
            [new RoundedMoney("5.00", 2, EUR), [0, 0, 1], ["0.00", "0.00", "5.00"]],
            [new RoundedMoney("0.05", 2, EUR), [0, 0, 1], ["0.00", "0.00", "0.05"]],
            [new RoundedMoney("5.00", 2, EUR), [0, 0, 100], ["0.00", "0.00", "5.00"]],
            [new RoundedMoney("0.05", 2, EUR), [0, 0, 100], ["0.00", "0.00", "0.05"]],
            [new RoundedMoney("5.00", 2, EUR), [0, 3, 7], ["0.00", "1.50", "3.50"]],
            [new RoundedMoney("0.05", 2, EUR), [0, 3, 7], ["0.00", "0.02", "0.03"]],
            [new RoundedMoney("5.00", 2, EUR), [3, 0, 7], ["1.50", "0.00", "3.50"]],
            [new RoundedMoney("0.05", 2, EUR), [3, 0, 7], ["0.02", "0.00", "0.03"]],
            [new RoundedMoney("0.00", 2, EUR), [0, 0, 1], ["0.00", "0.00", "0.00"]],
            [new RoundedMoney("0.00", 2, EUR), [1, 0, 0], ["0.00", "0.00", "0.00"]],
            [new RoundedMoney("0.00", 2, EUR), [2, 3, 4], ["0.00", "0.00", "0.00"]],
            [new RoundedMoney("2.00", 2, EUR), [1, 1, 1], ["0.67", "0.67", "0.66"]],
            [new RoundedMoney("0.02", 2, EUR), [1, 1, 1], ["0.01", "0.01", "0.00"]],
            [new RoundedMoney("0.02", 2, EUR), [2, 2, 2], ["0.01", "0.01", "0.00"]],
            [new RoundedMoney("1.00", 2, EUR), [1, 1], ["0.50", "0.50"]],
            [new RoundedMoney("1.00", 2, EUR), [1, 1, 1], ["0.34", "0.33", "0.33"]],
            [new RoundedMoney("0.01", 2, EUR), [1, 1], ["0.01", "0.00"]],
            [new RoundedMoney("1.00", 2, EUR), [0.33, 0.66], ["0.33", "0.67"]],
            [new RoundedMoney("0.01", 2, EUR), [0.33, 0.66], ["0.00", "0.01"]],
            [new RoundedMoney("1.01", 2, EUR), [3, 7], ["0.30", "0.71"]],
            [new RoundedMoney("1.01", 2, EUR), [7, 3], ["0.71", "0.30"]],
            [new RoundedMoney("5.00", 2, EUR), [1, 1, 1], ["1.67", "1.67", "1.66"]],
            [new RoundedMoney("10.00", 2, EUR), [1, 1, 1], ["3.34", "3.33", "3.33"]],
            [new RoundedMoney("100", 0, JPY), [1, 1, 1], ["34", "33", "33"]],
            [new RoundedMoney("101", 0, JPY), [1, 1, 1], ["34", "34", "33"]],
            [new RoundedMoney("100", 0, JPY), [1, 1], ["50", "50"]],
            [new RoundedMoney("101", 0, JPY), [1, 1], ["51", "50"]],
            [new RoundedMoney("5", 0, JPY), [3, 7], ["2", "3"]],
            [new RoundedMoney("5", 0, JPY), [7, 3], ["4", "1"]],
            [new RoundedMoney("5", 0, JPY), [7, 3, 0], ["4", "1", "0"]],
            [new RoundedMoney("-5", 0, JPY), [3, 7], ["-1", "-4"]],
            [new RoundedMoney("-5", 0, JPY), [7, 3], ["-3", "-2"]],
            [new RoundedMoney("5", 0, JPY), [0, 7, 3], ["0", "4", "1"]],
            [new RoundedMoney("5", 0, JPY), [7, 0, 3], ["4", "0", "1"]],
            [new RoundedMoney("5", 0, JPY), [0, 0, 1], ["0", "0", "5"]],
            [new RoundedMoney("5", 0, JPY), [0, 0, 100], ["0", "0", "5"]],
            [new RoundedMoney("5", 0, JPY), [0, 3, 7], ["0", "2", "3"]],
            [new RoundedMoney("5", 0, JPY), [3, 0, 7], ["2", "0", "3"]],
            [new RoundedMoney("0", 0, JPY), [0, 0, 1], ["0", "0", "0"]],
            [new RoundedMoney("0", 0, JPY), [1, 0, 0], ["0", "0", "0"]],
            [new RoundedMoney("0", 0, JPY), [2, 3, 4], ["0", "0", "0"]],
            [new RoundedMoney("200", 0, JPY), [1, 1, 1], ["67", "67", "66"]],
            [new RoundedMoney("2", 0, JPY), [1, 1, 1], ["1", "1", "0"]],
            [new RoundedMoney("2", 0, JPY), [2, 2, 2], ["1", "1", "0"]],
            [new RoundedMoney("1", 0, JPY), [1, 1], ["1", "0"]],
            [new RoundedMoney("1", 0, JPY), [1, 1, 1], ["1", "0", "0"]],
            [new RoundedMoney("1", 0, JPY), [1, 2], ["0", "1"]],
            [new RoundedMoney("1", 0, JPY), [2, 1], ["1", "0"]],
            [new RoundedMoney("1", 0, JPY), [0.33, 0.66], ["0", "1"]],
            [new RoundedMoney("499", 0, JPY), [1, 1, 1], ["167", "166", "166"]],
            [new RoundedMoney("500", 0, JPY), [1, 1, 1], ["167", "167", "166"]],
            [new RoundedMoney("501", 0, JPY), [1, 1, 1], ["167", "167", "167"]],
            [new RoundedMoney("999", 0, JPY), [1, 1, 1], ["333", "333", "333"]],
            [new RoundedMoney("1000", 0, JPY), [1, 1, 1], ["334", "333", "333"]],
        ];
    }

    @TestCases(RoundedMoneyTest.allocationNamedExamples)
    @Test("it allocates named amounts")
    public itAllocatesNamedAmount(money: RoundedMoney, ratios: { [name: string]: number }, results: { [name: string]: string }) {
        const allocated = money.allocateNamed(ratios);

        for (const [name, allocatedMoney] of Object.entries(allocated)) {
            const compareTo = new RoundedMoney(results[name], money.subunit, money.currency);
            Expect(allocatedMoney).toBe(compareTo);
        }
    }

    public static allocationNamedExamples() {
        const EUR = new Currency("EUR");
        const JPY = new Currency("JPY");

        return [
            [new RoundedMoney("101.00", 2, EUR), {"foo": 7, "bar": 3}, {"foo": "70.70", "bar": "30.30"}],
            [new RoundedMoney("101", 0, JPY), {"foo": 7, "bar": 3}, {"foo": "71", "bar": "30"}],
        ];
    }

    @TestCases(RoundedMoneyTest.allocationTargetExamples)
    @Test("It allocates amount to N targets")
    public itAllocatesAmountToNTargets(money: RoundedMoney, target: number, results: number[]) {
        const allocated = money.allocateTo(target);

        for (const [key, allocatedMoney] of allocated.entries()) {
            const compareTo = new RoundedMoney(results[key], money.subunit, money.currency);
            Expect(compareTo).toBe(allocatedMoney);
        }
    }

    public static allocationTargetExamples() {
        const EUR = new Currency("EUR");
        const JPY = new Currency("JPY");

        return [
            [new RoundedMoney("10.00", 2, EUR), 2, ["5.00", "5.00"]],
            [new RoundedMoney("0.10", 2, EUR), 2, ["0.05", "0.05"]],
            [new RoundedMoney("15.00", 2, EUR), 2, ["7.50", "7.50"]],
            [new RoundedMoney("0.15", 2, EUR), 2, ["0.08", "0.07"]],
            [new RoundedMoney("20.00", 2, EUR), 2, ["10.00", "10.00"]],
            [new RoundedMoney("0.20", 2, EUR), 2, ["0.10", "0.10"]],
            [new RoundedMoney("10.00", 2, EUR), 3, ["3.34", "3.33", "3.33"]],
            [new RoundedMoney("0.10", 2, EUR), 3, ["0.04", "0.03", "0.03"]],
            [new RoundedMoney("15.00", 2, EUR), 3, ["5.00", "5.00", "5.00"]],
            [new RoundedMoney("0.15", 2, EUR), 3, ["0.05", "0.05", "0.05"]],
            [new RoundedMoney("20.00", 2, EUR), 3, ["6.67", "6.67", "6.66"]],
            [new RoundedMoney("0.20", 2, EUR), 3, ["0.07", "0.07", "0.06"]],
            [new RoundedMoney("1000", 0, JPY), 2, ["500", "500"]],
            [new RoundedMoney("10", 0, JPY), 2, ["5", "5"]],
            [new RoundedMoney("1500", 0, JPY), 2, ["750", "750"]],
            [new RoundedMoney("15", 0, JPY), 2, ["8", "7"]],
            [new RoundedMoney("2000", 0, JPY), 2, ["1000", "1000"]],
            [new RoundedMoney("20", 0, JPY), 2, ["10", "10"]],
            [new RoundedMoney("1000", 0, JPY), 3, ["334", "333", "333"]],
            [new RoundedMoney("10", 0, JPY), 3, ["4", "3", "3"]],
            [new RoundedMoney("1500", 0, JPY), 3, ["500", "500", "500"]],
            [new RoundedMoney("15", 0, JPY), 3, ["5", "5", "5"]],
            [new RoundedMoney("2000", 0, JPY), 3, ["667", "667", "666"]],
            [new RoundedMoney("20", 0, JPY), 3, ["7", "7", "6"]],
        ];
    }

    @TestCases(RoundedMoneyTest.comparatorExamples)
    @Test("it has comparators")
    public itHasComparators(amount: numeric, isZero: boolean, isPositive: boolean, isNegative: boolean) {
        const money = new RoundedMoney(amount, 2, new Currency("AUD"));

        Expect(money.isZero).toBe(isZero);
        Expect(money.isPositive).toBe(isPositive);
        Expect(money.isNegative).toBe(isNegative);
    }

    public static comparatorExamples() {
        return [
            [1, false, true, false],
            ["0.01", false, true, false],
            [0, true, false, false],
            ["0.00", true, false, false],
            [-1, false, false, true],
            ["-1.50", false, false, true],
        ];
    }

    @TestCases(RoundedMoneyTest.absoluteExamples)
    @Test("it calculates the absolute amount")
    public itCalculatesTheAbsoluteAmount(amount: numeric, expected: string) {
        const currency = new Currency("EUR");
        const money = new RoundedMoney(amount, 2, currency);

        const absoluteMoney = money.absolute();
        Expect(absoluteMoney instanceof RoundedMoney).toBeTruthy();
        Expect(absoluteMoney).toBe(new RoundedMoney(expected, 2, currency));
        Expect(absoluteMoney.amount).toBe(expected);

        const absMoney = money.abs();
        Expect(absMoney).toBe(absoluteMoney);
    }

    public static absoluteExamples() {
        return [
            ["1", "1.00"],
            ["0.01", "0.01"],
            ["0", "0.00"],
            ["0.00", "0.00"],
            ["-1", "1.00"],
            ["-1.50", "1.50"],
        ];
    }

    @TestCases(RoundedMoneyTest.negativeExamples)
    @Test("it calculates the negative amount")
    public itCalculatesTheNegativeAmount(amount: numeric, expected: string) {
        const currency = new Currency("EUR");
        const money = new RoundedMoney(amount, 2, currency);

        const negativeMoney = money.negative();
        Expect(negativeMoney instanceof RoundedMoney).toBeTruthy();
        Expect(negativeMoney).toBe(new RoundedMoney(expected, 2, currency));
        Expect(negativeMoney.amount).toBe(expected);

        const negateMoney = money.negate();
        Expect(negateMoney).toBe(negativeMoney);

        const negatedMoney = money.negated();
        Expect(negatedMoney).toBe(negatedMoney);
    }

    public static negativeExamples() {
        return [
            ["1", "-1.00"],
            ["1.50", "-1.50"],
            ["0", "0.00"],
            ["-0", "0.00"], // negative zero is always normalized to zero
            ["0.00", "0.00"],
            ["-0.00", "0.00"], // negative zero is always normalized to zero
            ["-2", "2.00"],
            ["-3.45", "3.45"],
        ];
    }

    @TestCases(RoundedMoneyTest.percentageExamples)
    @Test("it calculates percentages")
    public itCalculatesPercentages(amount: string, subunit: number, percent: number, expected: string) {
        const currency = new Currency("EUR");
        const money = new RoundedMoney(amount, subunit, currency);
        const smallerMoney = money.percentage(percent);

        Expect(smallerMoney instanceof PreciseMoney).toBeTruthy();
        Expect(smallerMoney).toBe(new PreciseMoney(expected, currency));
        Expect(smallerMoney.amount).toBe(expected);
    }

    public static percentageExamples() {
        return [
            ["350.00", 2, 0, "0"],
            ["350.00", 2, 100, "350"],
            ["350.00", 2, 50, "175"],
            ["10.00", 2, 100, "10"],
            ["10.00", 2, 30, "3"],
            ["10.00", 2, 25, "2.5"],
            ["10.00", 2, 24, "2.4"],
            ["100.00", 2, 25, "25"],
            ["99.99", 2, 25, "24.9975"],
        ];
    }

    @TestCases(RoundedMoneyTest.subtractPercentageExamples)
    @Test("it subtracts a percentage")
    public itSubtractsAPercentage(amount: number, subunit: number, percent: number, expected:string) {
        const currency = new Currency("EUR");
        const money = new RoundedMoney(amount, subunit, currency);
        const smallerMoney = money.subtractPercentage(percent);

        Expect(smallerMoney instanceof PreciseMoney).toBeTruthy();
        Expect(smallerMoney).toBe(new PreciseMoney(expected, currency));
        Expect(smallerMoney.amount).toBe(expected);
    }

    public static subtractPercentageExamples() {
        return [
            ["350.00", 2, 0, "350"],
            ["350.00", 2, 100, "0"],
            ["350.00", 2, 50, "175"],
            ["10.00", 2, 100, "0"],
            ["10.00", 2, 30, "7"],
            ["10.00", 2, 25, "7.5"],
            ["10.00", 2, 24, "7.6"],
            ["100.00", 2, 25, "75"],
            ["99.99", 2, 25, "74.9925"],
        ];
    }

    @Test("it converts to JSON")
    public itConvertsToJson() {
        const intMoney = new RoundedMoney(100, 2, new Currency("AUD"));
        const intMoneyJsonString = JSON.stringify(intMoney);
        Expect(intMoneyJsonString).toBe('{"amount":"100.00","subunit":2,"currency":"AUD"}');
        const intMoneyJsonObj = intMoney.toJSON();
        Expect(intMoneyJsonObj).toEqual({"amount": "100.00", "subunit": 2, "currency": "AUD"});

        const decimalMoney = new RoundedMoney("123.45", 2, new Currency("USD"));
        const decimalMoneyJsonString = JSON.stringify(decimalMoney);
        Expect(decimalMoneyJsonString).toBe('{"amount":"123.45","subunit":2,"currency":"USD"}');
        const decimalMoneyJsonObj = decimalMoney.toJSON();
        Expect(decimalMoneyJsonObj).toEqual({"amount": "123.45", "subunit": 2, "currency": "USD"});

        const zeroSubunitMoney = new RoundedMoney("789", 0, new Currency("JPY"));
        const zeroSubunitMoneyJsonString = JSON.stringify(zeroSubunitMoney);
        Expect(zeroSubunitMoneyJsonString).toBe('{"amount":"789","subunit":0,"currency":"JPY"}');
        const zeroSubunitMoneyJsonObj = zeroSubunitMoney.toJSON();
        Expect(zeroSubunitMoneyJsonObj).toEqual({"amount": "789", "subunit": 0, "currency": "JPY"});
    }

    @Test("it converts to a string")
    public itConvertsToString() {
        const intMoney = new RoundedMoney(100, 2, new Currency("AUD"));
        const intMoneyStr = intMoney.toString();
        Expect(intMoneyStr).toBe("AUD 100.00");
        Expect(String(intMoney)).toBe(intMoneyStr);

        const decimalMoney = new RoundedMoney("123.45", 2, new Currency("USD"));
        const decimalMoneyStr = decimalMoney.toString();
        Expect(decimalMoneyStr).toBe("USD 123.45");
        Expect(String(decimalMoney)).toBe(decimalMoneyStr);

        const zeroSubunitMoney = new RoundedMoney("789", 0, new Currency("JPY"));
        const zeroSubunitMoneyStr = zeroSubunitMoney.toString();
        Expect(zeroSubunitMoneyStr).toBe("JPY 789");
        Expect(String(zeroSubunitMoney)).toBe(zeroSubunitMoneyStr);
    }

    @TestCases(RoundedMoneyTest.sumExamples)
    @Test("it calculates sum")
    public itCalculatesSum(values: RoundedMoney[], sum: RoundedMoney) {
        Expect(RoundedMoney.sum(...values)).toBe(sum);
    }

    public static sumExamples() {
        const EUR = new Currency("EUR");
        const RM2 = (value: string): RoundedMoney => {
            return new RoundedMoney(value, 2, EUR);
        };

        const JPY = new Currency("JPY");
        const RM0 = (value: string): RoundedMoney => {
            return new RoundedMoney(value, 0, JPY);
        };

        return [
            [[RM2("5.00"), RM2("10.00"), RM2("15.00")], RM2("30.00")],
            [[RM2("-5.00"), RM2("-10.00"), RM2("-15.00")], RM2("-30.00")],
            [[RM2("0.00")], RM2("0.00")],
            [[RM2("0.00"), RM2("0")], RM2("0.00")],
            [[RM2("-5.00"), RM2("0.00"), RM2("5.00")], RM2("0.00")],
            [[RM0("5"), RM0("10"), RM0("15")], RM0("30")],
            [[RM0("-5"), RM0("-10"), RM0("-15")], RM0("-30")],
            [[RM0("0")], RM0("0")],
            [[RM0("0"), RM0("0")], RM0("0")],
            [[RM0("-5"), RM0("0"), RM0("5")], RM0("0")],
        ];
    }

    @TestCases(RoundedMoneyTest.minExamples)
    @Test("it calculates min")
    public itCalculatesMin(values: RoundedMoney[], min: RoundedMoney) {
        Expect(RoundedMoney.min(...values)).toBe(min);
    }

    public static minExamples() {
        const EUR = new Currency("EUR");
        const RM2 = (value: string): RoundedMoney => {
            return new RoundedMoney(value, 2, EUR);
        };

        const JPY = new Currency("JPY");
        const RM0 = (value: string): RoundedMoney => {
            return new RoundedMoney(value, 0, JPY);
        };

        return [
            [[RM2("5.00"), RM2("10.00"), RM2("15.00")], RM2("5.00")],
            [[RM2("-5.00"), RM2("-10.00"), RM2("-15.00")], RM2("-15.00")],
            [[RM2("0.00")], RM2("0.00")],
            [[RM2("0.00"), RM2("0")], RM2("0.00")],
            [[RM2("-5.00"), RM2("0.00"), RM2("5.00")], RM2("-5.00")],
            [[RM0("5"), RM0("10"), RM0("15")], RM0("5")],
            [[RM0("-5"), RM0("-10"), RM0("-15")], RM0("-15")],
            [[RM0("0")], RM0("0")],
            [[RM0("0"), RM0("0")], RM0("0")],
            [[RM0("-5"), RM0("0"), RM0("5")], RM0("-5")],
        ];
    }

    @TestCases(RoundedMoneyTest.maxExamples)
    @Test("it calculates max")
    public itCalculatesMax(values: RoundedMoney[], max: RoundedMoney) {
        Expect(RoundedMoney.max(...values)).toBe(max);
    }

    public static maxExamples() {
        const EUR = new Currency("EUR");
        const RM2 = (value: string): RoundedMoney => {
            return new RoundedMoney(value, 2, EUR);
        };

        const JPY = new Currency("JPY");
        const RM0 = (value: string): RoundedMoney => {
            return new RoundedMoney(value, 0, JPY);
        };

        return [
            [[RM2("5.00"), RM2("10.00"), RM2("15.00")], RM2("15.00")],
            [[RM2("-5.00"), RM2("-10.00"), RM2("-15.00")], RM2("-5.00")],
            [[RM2("0.00")], RM2("0.00")],
            [[RM2("0.00"), RM2("0")], RM2("0.00")],
            [[RM2("-5.00"), RM2("0.00"), RM2("5.00")], RM2("5.00")],
            [[RM0("5"), RM0("10"), RM0("15")], RM0("15")],
            [[RM0("-5"), RM0("-10"), RM0("-15")], RM0("-5")],
            [[RM0("0")], RM0("0")],
            [[RM0("0"), RM0("0")], RM0("0")],
            [[RM0("-5"), RM0("0"), RM0("5")], RM0("5")],
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

    public static diffCurrencyRefusalExamples() {
        const currency = new Currency("EUR");
        const otherCurrency = new Currency("AUD");
        return [
            [
                new RoundedMoney(10, 2, otherCurrency),
            ],
            [
                new RoundedMoney(11, 2, otherCurrency),
                new RoundedMoney("12.00", 2, otherCurrency),
            ],
            [
                new RoundedMoney("13.5", 2, otherCurrency),
                new RoundedMoney("14.99", 2, otherCurrency),
                new RoundedMoney("16", 2, otherCurrency),
            ],
            [
                new RoundedMoney(20, 2, currency),
                new RoundedMoney(21, 2, otherCurrency),
            ],
            [
                new RoundedMoney(22, 2, otherCurrency),
                new RoundedMoney(23, 2, currency),
            ],
        ];
    }
}
