import type PreciseMoney from "./precisemoney";
import type RoundedMoney from "./roundedmoney";
import type Currency from "./currency";
import type CurrencyPair from "./currencypair";
import type {
    PreciseMoneyMatcher,
    RoundedMoneyMatcher,
    CurrencyMatcher,
    CurrencyPairMatcher,
} from "./alsatian-matchers";

declare module "alsatian/dist/core/expect/expect.i" {
    export interface IExpect {
        (actualValue: PreciseMoney): PreciseMoneyMatcher;
        (actualValue: RoundedMoney): RoundedMoneyMatcher;
        (actualValue: Currency): CurrencyMatcher;
        (actualValue: CurrencyPair): CurrencyPairMatcher;
    }
}
