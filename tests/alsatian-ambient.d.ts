import Money from "src/money";
import { MoneyMatcher } from "./alsatian";

declare module "alsatian/dist/core/expect/expect.i" {
    export interface IExpect {
        (actualValue: Money): MoneyMatcher;
    }
}
