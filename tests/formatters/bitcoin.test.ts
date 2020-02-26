import { TestFixture, Test, TestCases, Expect } from "alsatian";

import BitcoinMoneyFormatter from "src/formatters/bitcoin";
import RoundedMoney from "src/roundedmoney";
import Currency from "src/currency";

@TestFixture("Bitcoin Money Formatter")
export default class BitcoinMoneyFormatterTest {
    @TestCases(BitcoinMoneyFormatterTest.moneyExamples)
    @Test("it formats bitcoin money")
    public itFormatsMoney(amount: string, expected: string) {
        const currency = new Currency("XBT");
        const money = new RoundedMoney(amount, 8, currency);

        const formatter = new BitcoinMoneyFormatter();

        const actual = formatter.format(money);
        Expect(actual).toBe(expected);
    }

    public static *moneyExamples() {
        const examples = [
            ['50.05', '50.05000000'],
            ['1', '1.00000000'],
            ['0.41', '0.41000000'],
            ['0.05', '0.05000000'],
            ['0.35', '0.35000000'],
            ['1.357', '1.35700000'],
            ['61.351', '61.35100000'],
            ['-61.351', '-61.35100000'],
            ['5', '5.00000000'],
            ['50', '50.00000000'],
            ['500', '500.00000000'],
            ['-5055', '-5055.00000000'],
            ['0.03', '0.03000000'],
            ['0.5', '0.50000000'],
            ['0.50', '0.50000000'],
            ['0.00000001', '0.00000001'],
            ['0.1234567', '0.12345670'],
            ['0.12345678', '0.12345678'],
            ['-0.00000001', '-0.00000001'],
            ['-0.1234567', '-0.12345670'],
            ['-0.12345678', '-0.12345678'],
            ['3.64387', '3.64387000'],
            ['-3.64387', '-3.64387000'],
            ['5.00', '5.00000000'],
            ['-50.55', '-50.55000000'],
            ['500500.5', '500500.50000000'],
        ];

        for (const [amount, expected] of examples) {
            yield [amount, "\xC9\x83" + expected];
        }
    }

    @TestCases(BitcoinMoneyFormatterTest.stripTrailingZeroesExamples)
    @Test("it strips trailing zeroes during formatting")
    public itStripsTrailingZeroes(amount: string, expected: string) {
        const currency = new Currency("XBT");
        const money = new RoundedMoney(amount, 8, currency);

        const formatter = new BitcoinMoneyFormatter(true);

        const actual = formatter.format(money);
        Expect(actual).toBe(expected);
    }

    public static *stripTrailingZeroesExamples() {
        const examples = [
            ['50.05', '50.05'],
            ['1', '1'],
            ['1.00', '1'],
            ['0.41', '0.41'],
            ['0.05', '0.05'],
            ['0.35', '0.35'],
            ['1.357', '1.357'],
            ['61.351', '61.351'],
            ['-61.351', '-61.351'],
            ['5', '5'],
            ['50', '50'],
            ['500', '500'],
            ['-5055', '-5055'],
            ['0.03', '0.03'],
            ['0.5', '0.5'],
            ['0.50', '0.5'],
            ['0.00000001', '0.00000001'],
            ['0.1234567', '0.1234567'],
            ['0.12345678', '0.12345678'],
            ['-0.00000001', '-0.00000001'],
            ['-0.1234567', '-0.1234567'],
            ['-0.12345678', '-0.12345678'],
            ['3.64387', '3.64387'],
            ['-3.64387', '-3.64387'],
            ['5.00', '5'],
            ['-50.55', '-50.55'],
            ['500500.5', '500500.5'],
        ];

        for (const [amount, expected] of examples) {
            yield [amount, "\xC9\x83" + expected];
        }
    }

    @Test("it rejects money of non-bitcoin currencies")
    public itRejectsNonBitcoinMoney() {
        const aud = new Currency("AUD");
        const jpy = new Currency("JPY");

        const rMoney1 = new RoundedMoney("1.23", 2, aud);
        const rMoney2 = new RoundedMoney("123", 0, jpy);

        const formatter = new BitcoinMoneyFormatter();

        const throwFn = (rMoney: RoundedMoney) => formatter.format(rMoney);

        Expect(throwFn.bind(this, rMoney1)).toThrowError(Error, "Bitcoin Formatter can only format Bitcoin currency.");
        Expect(throwFn.bind(this, rMoney2)).toThrowError(Error, "Bitcoin Formatter can only format Bitcoin currency.");
    }
}
