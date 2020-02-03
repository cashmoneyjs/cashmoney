import Money from "src/money";
import Currency from "src/currency";
import CurrencyPair from "src/currencypair";
import { MoneyMatcher, CurrencyMatcher, CurrencyPairMatcher } from "./alsatian-matchers";

declare module "alsatian/dist/core/expect/expect.i" {
    export interface IExpect {
        (actualValue: Money): MoneyMatcher;
        (actualValue: Currency): CurrencyMatcher;
        (actualValue: CurrencyPair): CurrencyPairMatcher;
    }
}
