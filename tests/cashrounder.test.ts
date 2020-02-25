/// <reference path="../src/alsatian-ambient.d.ts" />
import { TestFixture, Test, TestCases, Expect } from "alsatian";

import CashRounder from "src/cashrounder";
import CustomCurrencyList from "src/currencylists/custom";
import CustomCashDenominationList from "src/cashdenominationlists/custom";
import Currency from "src/currency";
import PreciseMoney from "src/precisemoney";
import RoundedMoney from "src/roundedmoney";

@TestFixture("Cash Rounder")
export default class CashRounderTest {
    @TestCases(CashRounderTest.fiveCentRoundingExamples)
    @Test("it rounds precise money to the nearest five cents")
    public itRoundsToNearestFiveCents(amount: string, expected: string) {
        const currencies = new CustomCurrencyList({ AUD: 2 });
        const stepList = new CustomCashDenominationList({ AUD: 5 });
        const cashRounder = new CashRounder(currencies, stepList);

        const currency = new Currency("AUD");
        const pMoney = new PreciseMoney(amount, currency);

        const rMoney = cashRounder.round(pMoney);
        Expect(rMoney instanceof RoundedMoney).toBeTruthy();
        Expect(rMoney).toBe(new RoundedMoney(expected, 2, currency));
        Expect(rMoney.amount).toBe(expected);
    }

    @TestCases(CashRounderTest.fiveCentRoundingExamples)
    @Test("it adjusts rounded money to the nearest five cents")
    public itAdjustsToNearestFiveCents(amount: string, expected: string) {
        const currencies = new CustomCurrencyList({ AUD: 2 });
        const stepList = new CustomCashDenominationList({ AUD: 5 });
        const cashRounder = new CashRounder(currencies, stepList);

        const currency = new Currency("AUD");
        const rMoney = new RoundedMoney(amount, 2, currency);

        const rMoneyAdjusted = cashRounder.adjust(rMoney);
        Expect(rMoneyAdjusted instanceof RoundedMoney).toBeTruthy();
        Expect(rMoneyAdjusted).toBe(new RoundedMoney(expected, 2, currency));
        Expect(rMoneyAdjusted.amount).toBe(expected);
    }

    public static *fiveCentRoundingExamples() {
        const baseValues = [
            ["0.00", "0.00"],
            ["0.01", "0.00"],
            ["0.02", "0.00"],
            ["0.03", "0.05"],
            ["0.04", "0.05"],
            ["0.05", "0.05"],
            ["0.06", "0.05"],
            ["0.07", "0.05"],
            ["0.08", "0.10"],
            ["0.09", "0.10"],
            ["0.10", "0.10"],
            ["0.11", "0.10"],
            ["0.12", "0.10"],
            ["0.13", "0.15"],
            ["0.14", "0.15"],
            ["0.15", "0.15"],
            ["0.16", "0.15"],
            ["0.17", "0.15"],
            ["0.18", "0.20"],
            ["0.19", "0.20"],
            ["0.20", "0.20"],
            ["0.21", "0.20"],
            ["0.22", "0.20"],
            ["0.23", "0.25"],
            ["0.24", "0.25"],
            ["0.25", "0.25"],
            ["0.26", "0.25"],
            ["0.27", "0.25"],
            ["0.28", "0.30"],
            ["0.29", "0.30"],
            ["0.30", "0.30"],
            ["0.31", "0.30"],
            ["0.32", "0.30"],
            ["0.33", "0.35"],
            ["0.34", "0.35"],
            ["0.35", "0.35"],
            ["0.36", "0.35"],
            ["0.37", "0.35"],
            ["0.38", "0.40"],
            ["0.39", "0.40"],
            ["0.40", "0.40"],
            ["0.41", "0.40"],
            ["0.42", "0.40"],
            ["0.43", "0.45"],
            ["0.44", "0.45"],
            ["0.45", "0.45"],
            ["0.46", "0.45"],
            ["0.47", "0.45"],
            ["0.48", "0.50"],
            ["0.49", "0.50"],
            ["0.50", "0.50"],
            ["0.51", "0.50"],
            ["0.52", "0.50"],
            ["0.53", "0.55"],
            ["0.54", "0.55"],
            ["0.55", "0.55"],
            ["0.56", "0.55"],
            ["0.57", "0.55"],
            ["0.58", "0.60"],
            ["0.59", "0.60"],
            ["0.60", "0.60"],
            ["0.61", "0.60"],
            ["0.62", "0.60"],
            ["0.63", "0.65"],
            ["0.64", "0.65"],
            ["0.65", "0.65"],
            ["0.66", "0.65"],
            ["0.67", "0.65"],
            ["0.68", "0.70"],
            ["0.69", "0.70"],
            ["0.70", "0.70"],
            ["0.71", "0.70"],
            ["0.72", "0.70"],
            ["0.73", "0.75"],
            ["0.74", "0.75"],
            ["0.75", "0.75"],
            ["0.76", "0.75"],
            ["0.77", "0.75"],
            ["0.78", "0.80"],
            ["0.79", "0.80"],
            ["0.80", "0.80"],
            ["0.81", "0.80"],
            ["0.82", "0.80"],
            ["0.83", "0.85"],
            ["0.84", "0.85"],
            ["0.85", "0.85"],
            ["0.86", "0.85"],
            ["0.87", "0.85"],
            ["0.88", "0.90"],
            ["0.89", "0.90"],
            ["0.90", "0.90"],
            ["0.91", "0.90"],
            ["0.92", "0.90"],
            ["0.93", "0.95"],
            ["0.94", "0.95"],
            ["0.95", "0.95"],
            ["0.96", "0.95"],
            ["0.97", "0.95"],
            ["0.98", "1.00"],
            ["0.99", "1.00"],
        ];

        const incFunc = (value: string, newDollar: number): string => {
            const valueSplit = value.split(".");
            const dollarDigit = parseInt(valueSplit[0]);
            return String(dollarDigit + newDollar) + "." + valueSplit[1];
        };

        for (let x = 0; x < 100; x++) {
            for (let y = 0; y < baseValues.length; y++) {
                const [initial, expected] = baseValues[y];
                yield [incFunc(initial, x), incFunc(expected, x)];
            }
        }

        for (let x = 100; x < 1000; x += 100) {
            for (let y = 0; y < baseValues.length; y++) {
                const [initial, expected] = baseValues[y];
                yield [incFunc(initial, x - 1), incFunc(expected, x - 1)];
                yield [incFunc(initial, x), incFunc(expected, x)];
                yield [incFunc(initial, x + 1), incFunc(expected, x + 1)];
            }
        }

        for (let x = 1000; x <= 10000; x += 500) {
            for (let y = 0; y < baseValues.length; y++) {
                const [initial, expected] = baseValues[y];
                yield [incFunc(initial, x - 1), incFunc(expected, x - 1)];
                yield [incFunc(initial, x), incFunc(expected, x)];
                yield [incFunc(initial, x + 1), incFunc(expected, x + 1)];
            }
        }
    }

    @TestCases(CashRounderTest.tenCentRoundingExamples)
    @Test("it rounds precise money to the nearest ten cents")
    public itRoundsToNearestTenCents(amount: string, expected: string) {
        const currencies = new CustomCurrencyList({ NZD: 2 });
        const stepList = new CustomCashDenominationList({ NZD: 10 });
        const cashRounder = new CashRounder(currencies, stepList);

        const currency = new Currency("NZD");
        const pMoney = new PreciseMoney(amount, currency);

        const rMoney = cashRounder.round(pMoney);
        Expect(rMoney instanceof RoundedMoney).toBeTruthy();
        Expect(rMoney).toBe(new RoundedMoney(expected, 2, currency));
        Expect(rMoney.amount).toBe(expected);
    }

    @TestCases(CashRounderTest.tenCentRoundingExamples)
    @Test("it adjusts rounded money to the nearest ten cents")
    public itAdjustsToNearestTenCents(amount: string, expected: string) {
        const currencies = new CustomCurrencyList({ NZD: 2 });
        const stepList = new CustomCashDenominationList({ NZD: 10 });
        const cashRounder = new CashRounder(currencies, stepList);

        const currency = new Currency("NZD");
        const rMoney = new RoundedMoney(amount, 2, currency);

        const rMoneyAdjusted = cashRounder.adjust(rMoney);
        Expect(rMoneyAdjusted instanceof RoundedMoney).toBeTruthy();
        Expect(rMoneyAdjusted).toBe(new RoundedMoney(expected, 2, currency));
        Expect(rMoneyAdjusted.amount).toBe(expected);
    }

    public static *tenCentRoundingExamples() {
        const baseValues = [
            ["0.00", "0.00"],
            ["0.01", "0.00"],
            ["0.02", "0.00"],
            ["0.03", "0.00"],
            ["0.04", "0.00"],
            ["0.05", "0.00"],
            ["0.06", "0.10"],
            ["0.07", "0.10"],
            ["0.08", "0.10"],
            ["0.09", "0.10"],
            ["0.10", "0.10"],
            ["0.11", "0.10"],
            ["0.12", "0.10"],
            ["0.13", "0.10"],
            ["0.14", "0.10"],
            ["0.15", "0.20"],
            ["0.16", "0.20"],
            ["0.17", "0.20"],
            ["0.18", "0.20"],
            ["0.19", "0.20"],
            ["0.20", "0.20"],
            ["0.21", "0.20"],
            ["0.22", "0.20"],
            ["0.23", "0.20"],
            ["0.24", "0.20"],
            ["0.25", "0.20"],
            ["0.26", "0.30"],
            ["0.27", "0.30"],
            ["0.28", "0.30"],
            ["0.29", "0.30"],
            ["0.30", "0.30"],
            ["0.31", "0.30"],
            ["0.32", "0.30"],
            ["0.33", "0.30"],
            ["0.34", "0.30"],
            ["0.35", "0.40"],
            ["0.36", "0.40"],
            ["0.37", "0.40"],
            ["0.38", "0.40"],
            ["0.39", "0.40"],
            ["0.40", "0.40"],
            ["0.41", "0.40"],
            ["0.42", "0.40"],
            ["0.43", "0.40"],
            ["0.44", "0.40"],
            ["0.45", "0.40"],
            ["0.46", "0.50"],
            ["0.47", "0.50"],
            ["0.48", "0.50"],
            ["0.49", "0.50"],
            ["0.50", "0.50"],
            ["0.51", "0.50"],
            ["0.52", "0.50"],
            ["0.53", "0.50"],
            ["0.54", "0.50"],
            ["0.55", "0.60"],
            ["0.56", "0.60"],
            ["0.57", "0.60"],
            ["0.58", "0.60"],
            ["0.59", "0.60"],
            ["0.60", "0.60"],
            ["0.61", "0.60"],
            ["0.62", "0.60"],
            ["0.63", "0.60"],
            ["0.64", "0.60"],
            ["0.65", "0.60"],
            ["0.66", "0.70"],
            ["0.67", "0.70"],
            ["0.68", "0.70"],
            ["0.69", "0.70"],
            ["0.70", "0.70"],
            ["0.71", "0.70"],
            ["0.72", "0.70"],
            ["0.73", "0.70"],
            ["0.74", "0.70"],
            ["0.75", "0.80"],
            ["0.76", "0.80"],
            ["0.77", "0.80"],
            ["0.78", "0.80"],
            ["0.79", "0.80"],
            ["0.80", "0.80"],
            ["0.81", "0.80"],
            ["0.82", "0.80"],
            ["0.83", "0.80"],
            ["0.84", "0.80"],
            ["0.85", "0.80"],
            ["0.86", "0.90"],
            ["0.87", "0.90"],
            ["0.88", "0.90"],
            ["0.89", "0.90"],
            ["0.90", "0.90"],
            ["0.91", "0.90"],
            ["0.92", "0.90"],
            ["0.93", "0.90"],
            ["0.94", "0.90"],
            ["0.95", "1.00"],
            ["0.96", "1.00"],
            ["0.97", "1.00"],
            ["0.98", "1.00"],
            ["0.99", "1.00"],
        ];

        const incFunc = (value: string, newDollar: number): string => {
            const valueSplit = value.split(".");
            const dollarDigit = parseInt(valueSplit[0]);
            return String(dollarDigit + newDollar) + "." + valueSplit[1];
        };

        for (let x = 0; x < 100; x++) {
            for (let y = 0; y < baseValues.length; y++) {
                const [initial, expected] = baseValues[y];
                yield [incFunc(initial, x), incFunc(expected, x)];
            }
        }

        for (let x = 100; x < 1000; x += 100) {
            for (let y = 0; y < baseValues.length; y++) {
                const [initial, expected] = baseValues[y];
                yield [incFunc(initial, x - 1), incFunc(expected, x - 1)];
                yield [incFunc(initial, x), incFunc(expected, x)];
                yield [incFunc(initial, x + 1), incFunc(expected, x + 1)];
            }
        }

        for (let x = 1000; x <= 10000; x += 500) {
            for (let y = 0; y < baseValues.length; y++) {
                const [initial, expected] = baseValues[y];
                yield [incFunc(initial, x - 1), incFunc(expected, x - 1)];
                yield [incFunc(initial, x), incFunc(expected, x)];
                yield [incFunc(initial, x + 1), incFunc(expected, x + 1)];
            }
        }
    }
}
