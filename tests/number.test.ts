import { TestFixture, Test, TestCases, Expect } from "alsatian";

import Num from "src/_number";

@TestFixture("Number")
export default class NumberTest {
    @TestCases(NumberTest.numberExamples)
    @Test("it has attributes")
    public itHasAttributes(num: string, decimal: boolean, half: boolean, currentEven: boolean, negative: boolean, integerPart: string, fractionalPart: string) {
        const numObj = Num.fromString(num);

        Expect(numObj.isDecimal).toBe(decimal);
        Expect(numObj.isHalf).toBe(half);
        Expect(numObj.isCurrentEven).toBe(currentEven);
        Expect(numObj.isNegative).toBe(negative);
        Expect(numObj.integerPart).toBe(integerPart);
        Expect(numObj.fractionalPart).toBe(fractionalPart);
        Expect(numObj.getIntegerRoundingMultiplier()).toBe(negative ? -1 : 1);
    }

    @TestCases(NumberTest.invalidNumberExamples)
    @Test("it fails parsing invalid numbers")
    public itFailsParsingInvalidNumbers(num: string) {
        const throwFn = () => Num.fromString(num);

        Expect(throwFn).toThrow(); 
    }

    @TestCases(NumberTest.base10Examples)
    @Test("base10")
    public base10(numStr: string, baseNum: number, expected: string) {
        const numObj = Num.fromString(numStr);

        Expect(String(numObj.base10(baseNum))).toBe(expected);
    }

    @TestCases(NumberTest.numericExamples)
    @Test("it creates a number from a numeric value")
    public itCreatesANumberFromANumericValue(num: number) {
        const numObj = Num.fromNumber(num);
        Expect(numObj instanceof Num).toBeTruthy();
    }

    public static numberExamples() {
        const maxIntStr = String(Number.MAX_SAFE_INTEGER);
        const minIntStr = String(Number.MIN_SAFE_INTEGER);

        return [
            ['0', false, false, true, false, '0', ''],
            ['0.00', false, false, true, false, '0', ''],
            ['0.5', true, true, true, false, '0', '5'],
            ['0.500', true, true, true, false, '0', '5'],
            ['-0', false, false, true, true, '-0', ''],
            ['-0.5', true, true, true, true, '-0', '5'],
            ['3', false, false, false, false, '3', ''],
            ['3.00', false, false, false, false, '3', ''],
            ['3.5', true, true, false, false, '3', '5'],
            ['3.500', true, true, false, false, '3', '5'],
            ['-3', false, false, false, true, '-3', ''],
            ['-3.5', true, true, false, true, '-3', '5'],
            ['10', false, false, true, false, '10', ''],
            ['10.00', false, false, true, false, '10', ''],
            ['10.5', true, true, true, false, '10', '5'],
            ['10.500', true, true, true, false, '10', '5'],
            ['10.9', true, false, true, false, '10', '9'],
            ['-10', false, false, true, true, '-10', ''],
            ['-0', false, false, true, true, '-0', ''],
            ['-10.5', true, true, true, true, '-10', '5'],
            ['-.5', true, true, true, true, '-0', '5'],
            ['.5', true, true, true, false, '0', '5'],
            [maxIntStr, false, false, false, false, maxIntStr, ''],
            [minIntStr, false, false, false, true, minIntStr, ''],
            [
                maxIntStr + maxIntStr + maxIntStr,
                false,
                false,
                false,
                false,
                maxIntStr + maxIntStr + maxIntStr,
                '',
            ],
            [
                minIntStr + maxIntStr + maxIntStr,
                false,
                false,
                false,
                true,
                minIntStr + maxIntStr + maxIntStr,
                '',
            ],
            [
                maxIntStr.substr(0, maxIntStr.length - 1) + "0".repeat(maxIntStr.length - 1) + maxIntStr,
                false,
                false,
                false,
                false,
                maxIntStr.substr(0, maxIntStr.length - 1) + "0".repeat(maxIntStr.length - 1) + maxIntStr,
                '',
            ],
        ];
    }

    public static invalidNumberExamples() {
        return [
            [''],
            ['000'],
            ['005'],
            ['123456789012345678-123456'],
            ['---123'],
            ['123456789012345678+13456'],
            ['-123456789012345678.-13456'],
            ['+123456789'],
            ['+123456789012345678.+13456'],
        ];
    }

    public static base10Examples() {
        return [
            ['0', 10, '0'],
            ['5', 1, '0.5'],
            ['50', 2, '0.5'],
            ['50', 3, '0.05'],
            ['0.5', 2, '0.005'],
            ['500', 2, '5'],
            ['500', 0, '500'],
            ['500', -2, '50000'],
            ['0.5', -2, '50'],
            ['0.5', -3, '500'],
            ['-5', 3, '-0.005'],
            ['-5', -3, '-5000'],
            ['-0.05', -3, '-50'],
            ['-0.5', -3, '-500'],
        ];
    }

    public static numericExamples() {
        return [
            [1],
            [-1],
            [1.0],
            [-1.0],
            ['1'],
            ['-1'],
            ['1.0'],
            ['-1.0'],
        ];
    }
}
