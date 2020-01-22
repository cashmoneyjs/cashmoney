import { Expect } from "alsatian";
import Money from "src/money";
import { MoneyMatcher } from "./alsatian-matchers";

Expect.extend(Money, MoneyMatcher);
