/// <reference path="../src/alsatian-ambient.d.ts" />
import { TestFixture, Test, TestCases, Expect } from "alsatian";

import MoneyRounder from "src/rounder";
import CustomCurrencyList from "src/currencylists/custom";
import Currency from "src/currency";
import PreciseMoney from "src/precisemoney";
import RoundedMoney from "src/roundedmoney";
import { RoundingMode } from "@cashmoney/number";

@TestFixture("Money Rounder")
export default class MoneyRounderTest {
    @TestCases(MoneyRounderTest.defaultRoundingExamples)
    @Test("it rounds money using the default rounding mode")
    public itRoundsUsingDefaultMode(amount: string, expected: string) {
        const currencies = new CustomCurrencyList({ AUD: 2 });
        const rounder = new MoneyRounder(currencies);

        const currency = new Currency("AUD");
        const pMoney = new PreciseMoney(amount, currency);

        const rMoney = rounder.round(pMoney);
        Expect(rMoney instanceof RoundedMoney).toBeTruthy();
        Expect(rMoney).toBe(new RoundedMoney(expected, 2, currency));
        Expect(rMoney.amount).toBe(expected);
    }

    public static defaultRoundingExamples() {
        return [
            ["0.00", "0.00"],
            ["1.00", "1.00"],
            ["1.4", "1.40"],
            ["1.875", "1.88"],
            ["123.454", "123.45"],
            ["123.455", "123.46"],
            ["123.456", "123.46"],
            ["123.464", "123.46"],
            ["123.465", "123.46"],
            ["123.466", "123.47"],
        ];
    }

    @TestCases(MoneyRounderTest.roundHalfUpExamples)
    @Test("it rounds money using 'round half up' as a different default")
    public itRoundsMoneyUsingRoundHalfUpDefault(amount: string, expected: string) {
        const currencies = new CustomCurrencyList({ AUD: 2 });
        const rounder = new MoneyRounder(currencies, RoundingMode.ROUND_HALF_UP);

        const currency = new Currency("AUD");
        const pMoney = new PreciseMoney(amount, currency);

        const rMoney = rounder.round(pMoney);
        Expect(rMoney instanceof RoundedMoney).toBeTruthy();
        Expect(rMoney).toBe(new RoundedMoney(expected, 2, currency));
        Expect(rMoney.amount).toBe(expected);
    }

    public static roundHalfUpExamples() {
        return [
            ["0.00", "0.00"],
            ["1.00", "1.00"],
            ["1.4", "1.40"],
            ["1.875", "1.88"],
            ["123.454", "123.45"],
            ["123.455", "123.46"],
            ["123.456", "123.46"],
            ["123.464", "123.46"],
            ["123.465", "123.47"],
            ["123.466", "123.47"],
        ];
    }

    @TestCases(MoneyRounderTest.roundHalfDownExamples)
    @Test("it rounds money using 'round half down' as a different default")
    public itRoundsMoneyUsingRoundHalfDownDefault(amount: string, expected: string) {
        const currencies = new CustomCurrencyList({ AUD: 2 });
        const rounder = new MoneyRounder(currencies, RoundingMode.ROUND_HALF_DOWN);

        const currency = new Currency("AUD");
        const pMoney = new PreciseMoney(amount, currency);

        const rMoney = rounder.round(pMoney);
        Expect(rMoney instanceof RoundedMoney).toBeTruthy();
        Expect(rMoney).toBe(new RoundedMoney(expected, 2, currency));
        Expect(rMoney.amount).toBe(expected);
    }

    public static roundHalfDownExamples() {
        return [
            ["0.00", "0.00"],
            ["1.00", "1.00"],
            ["1.4", "1.40"],
            ["1.875", "1.87"],
            ["123.454", "123.45"],
            ["123.455", "123.45"],
            ["123.456", "123.46"],
            ["123.464", "123.46"],
            ["123.465", "123.46"],
            ["123.466", "123.47"],
        ];
    }

    @TestCases(MoneyRounderTest.roundCustomExamples)
    @Test("it allows overriding the default rounding mode on a case-by-case basis")
    public itAllowsOverridingDefaultRoundingMode(amount: string, roundingMode: RoundingMode, expected: string) {
        const currencies = new CustomCurrencyList({ AUD: 2 });
        const rounder = new MoneyRounder(currencies);

        const currency = new Currency("AUD");
        const pMoney = new PreciseMoney(amount, currency);

        const rMoney = rounder.round(pMoney, roundingMode);
        Expect(rMoney instanceof RoundedMoney).toBeTruthy();
        Expect(rMoney).toBe(new RoundedMoney(expected, 2, currency));
        Expect(rMoney.amount).toBe(expected);
    }

    public static *roundCustomExamples() {
        const examples = ["0.00", "1.00", "1.4", "1.875", "123.454", "123.455", "123.456", "123.464", "123.465", "123.466"];
        const halfDownExamples = ["0.00", "1.00", "1.40", "1.87", "123.45", "123.45", "123.46", "123.46", "123.46", "123.47"];
        const halfUpExamples = ["0.00", "1.00", "1.40", "1.88", "123.45", "123.46", "123.46", "123.46", "123.47", "123.47"];
        const halfEvenExamples = ["0.00", "1.00", "1.40", "1.88", "123.45", "123.46", "123.46", "123.46", "123.46", "123.47"];
        const halfOddExamples = ["0.00", "1.00", "1.40", "1.87", "123.45", "123.45", "123.46", "123.46", "123.47", "123.47"];
        const truncateExamples = ["0.00", "1.00", "1.40", "1.87", "123.45", "123.45", "123.45", "123.46", "123.46", "123.46"];

        const yielder = function*(mode: RoundingMode, values: ReadonlyArray<string>): Generator<[string, RoundingMode, string]> {
            for (const [key, value] of values.entries()) {
                yield [examples[key], mode, value];
            }
        };

        yield* yielder(RoundingMode.ROUND_HALF_DOWN, halfDownExamples);
        yield* yielder(RoundingMode.ROUND_HALF_UP, halfUpExamples);
        yield* yielder(RoundingMode.ROUND_HALF_EVEN, halfEvenExamples);
        yield* yielder(RoundingMode.ROUND_HALF_ODD, halfOddExamples);
        yield* yielder(RoundingMode.ROUND_TRUNCATE, truncateExamples);
    }
}
