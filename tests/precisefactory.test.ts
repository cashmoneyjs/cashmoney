import { TestFixture, Test, Expect } from "alsatian";

import PreciseMoney from "src/precisemoney";
import Currency from "src/currency";
import { USD } from "src/precisefactory";

@TestFixture("Precise Money Factory")
export default class PreciseMoneyFactoryTest {
    @Test("it creates precise money objects")
    public itCreatesPreciseMoneyObjects() {
        const manufacturedMoney = USD(20);
        Expect(manufacturedMoney instanceof PreciseMoney).toBeTruthy();

        const naturalMoney = new PreciseMoney(20, new Currency("USD"));
        Expect(manufacturedMoney).toBe(naturalMoney);
    }
}
