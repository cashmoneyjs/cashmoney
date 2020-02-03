import { Expect } from "alsatian";
import Money from "src/money";
import Currency from "src/currency";
import CurrencyPair from "src/currencypair";
import { MoneyMatcher, CurrencyMatcher, CurrencyPairMatcher } from "./alsatian-matchers";

Expect.extend(Money, MoneyMatcher);
Expect.extend(Currency, CurrencyMatcher);
Expect.extend(CurrencyPair, CurrencyPairMatcher);
