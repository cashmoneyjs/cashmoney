import { TestFixture, Test, Expect } from "alsatian";

import Money from "src/money";
import Currency from "src/currency";
import { USD } from "src/factory";

@TestFixture("Money Factory")
export default class MoneyFactoryTest {
    @Test("it creates money objects")
    public itCreatesMoneyObjects() {
        const manufacturedMoney = USD(20);
        Expect(manufacturedMoney instanceof Money).toBeTruthy();

        const naturalMoney = new Money(20, new Currency("USD"));
        Expect(manufacturedMoney).toBe(naturalMoney);
    }
}
