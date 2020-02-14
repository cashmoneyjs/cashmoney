import { Expect } from "alsatian";
import PreciseMoney from "src/precisemoney";
import RoundedMoney from "src/roundedmoney";
import Currency from "src/currency";
import CurrencyPair from "src/currencypair";
import { PreciseMoneyMatcher, RoundedMoneyMatcher, CurrencyMatcher, CurrencyPairMatcher } from "src/alsatian-matchers";

import { Num } from "@cashmoney/number";
import { NumMatcher } from "@cashmoney/number/dist/alsatian-matchers";

Expect.extend(PreciseMoney, PreciseMoneyMatcher);
Expect.extend(RoundedMoney, RoundedMoneyMatcher);
Expect.extend(Currency, CurrencyMatcher);
Expect.extend(CurrencyPair, CurrencyPairMatcher);

Expect.extend(Num, NumMatcher);
