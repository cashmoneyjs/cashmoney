import PreciseMoney from "./precisemoney";
import RoundedMoney from "./roundedmoney";
import Currency from "./currency";
import CurrencyPair from "./currencypair";
import { PreciseMoneyMatcher, RoundedMoneyMatcher, CurrencyMatcher, CurrencyPairMatcher } from "./alsatian-matchers";

declare module "alsatian/dist/core/expect/expect.i" {
    export interface IExpect {
        (actualValue: PreciseMoney): PreciseMoneyMatcher;
        (actualValue: RoundedMoney): RoundedMoneyMatcher;
        (actualValue: Currency): CurrencyMatcher;
        (actualValue: CurrencyPair): CurrencyPairMatcher;
    }
}
