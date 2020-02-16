/// <reference path="../src/alsatian-ambient.d.ts" />
import { TestFixture, Test, Expect } from "alsatian";

import RoundedMoney from "src/roundedmoney";
import Currency from "src/currency";
import { EUR, JPY } from "src/roundedfactory";

@TestFixture("Rounded Money Factory")
export default class RoundedMoneyFactoryTest {
    @Test("it creates rounded money objects")
    public itCreatesRoundedMoneyObjects() {
        const manufacturedEur = EUR(20.0);
        Expect(manufacturedEur instanceof RoundedMoney).toBeTruthy();
        const naturalEur = new RoundedMoney(20, 2, new Currency("EUR"));
        Expect(manufacturedEur).toBe(naturalEur);

        const manufacturedJpy = JPY(200);
        Expect(manufacturedJpy instanceof RoundedMoney).toBeTruthy();
        const naturalJpy = new RoundedMoney(200, 0, new Currency("JPY"));
        Expect(manufacturedJpy).toBe(naturalJpy);
    }
}
