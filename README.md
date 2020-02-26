# CashMoney

CashMoney assists you in the handling of monetary values to ensure you avoid awkward
rounding errors in your business logic.

This package started as a part of the [MoneyPHP](https://github.com/moneyphp/money) library,
but has since diverged to utilise some different concepts. Most importantly, CashMoney
differentiates between "precise money" and "rounded money".

> "If I had a dime for every time I've seen someone use FLOAT to store currency, I'd have $999.997634" -- [Bill Karwin](https://twitter.com/billkarwin/status/347561901460447232)

As mentioned by the MoneyPHP library, you shouldn't represent monetary values with
floating point numbers. Instead, a dedicated money object should be used instead.
This library uses a "big number" implementation (powered by [bignumber.js](https://mikemcl.github.io/bignumber.js/)
to truly support numbers of artbitrary precision.

## Features

- Precise money, to avoid rounding errors entirely
- Rounded money, for when you need to work with money in a similar manner to cash
- Money formatting using built-in JS Intl functionality
- Money exchange (conversion rates must be supplied manually)
- JSON serialization

## Install

With yarn:

```bash
$ yarn add @cashmoney/core
```

Or with npm:

```bash
$ npm add @cashmoney/core
```

## Example usage

### Money

There are two types of money: Precise and Rounded. Which one you want depends
on what you plan to do with the relevant amount(s).

#### Precise Money

Precise Money objects accept values of any precision, as strings or numbers.

```typescript
import {
    PreciseMoney,
    Currency,
    PreciseMoneyFactory,
} from "@cashmoney/core";
const { AUD } = PreciseMoneyFactory;

const currency = new Currency("AUD");
const fiveAud = new PreciseMoney(5, currency);
const tenAud = fiveAud.add(fiveAud);
const sevenPointFiveAud = new PreciseMoney("7.5", currency);

// Alternatively:
const fiveAudAlt = AUD(5);
const tenAudAlt = AUD(10);
const sevenPointFiveAudAlt = AUD(7.5);

assert(tenAud.subtract(fiveAud).equals(fiveAud));
assert(tenAud.subtract(new PreciseMoney("2.5", currency)).equals(sevenPointFiveAud);
```

#### Rounded Money

Rounded Money objects require that the expected precision of the currency is supplied.

```typescript
import {
    RoundedMoney,
    Currency,
    RoundedMoneyFactory,
} from "@cashmoney/core";

// AUD uses 2 decimal places
const fiveAud = new RoundedMoney("5.00", 2, new Currency("AUD"));
const tenAud = fiveAud.add(fiveAud);

const [part1, part2, part3] = tenAud.allocate([1, 1, 1]);
assert(part1.equals(AUD("3.34")));
assert(part2.equals(AUD("3.33")));
assert(part3.equals(AUD("3.33")));
```

If you use the factory functions, they supply the precision for you.

```typescript
import {
    RoundedMoney,
    Currency,
    RoundedMoneyFactory,
} from "@cashmoney/core";
const { AUD } = RoundedMoneyFactory;

const fiveAud = new RoundedMoney("1.23", 2, new Currency("AUD"));
const fiveAudAlt = AUD("1.23");
assert(fiveAud.equals(fiveAudAlt));
```

#### Converting between Precise and Rounded

You can convert a Precise Money object to a Rounded Money object, but there
is no automated translation going back the other way. This is supposed to be
indicative of the idea that once you've disposed of the precision provided by
the Precise Money class, you can never get it back.

The Precise Money class has a method for converting to Rounded Money objects. 

```typescript
import { PreciseMoney, RoundedMoney, Currency } from "@cashmoney/core";

const currency = new Currency("AUD");
const fivePreciseAud = new PreciseMoney(5, currency);
const fiveRoundedAud = fivePreciseAud.roundToDecimalPlaces(2);
const fiveRoundedAudAlt = new RoundedMoney(5, 2, currency);
assert(fiveRoundedAud.equals(fiveRoundedAudAlt));
```

However, this requires that you always know the precision of every currency
you're dealing with, everywhere that you want to do this in your code. That
doesn't scale very well, so there's a dedicated Money Rounder class you can
use to generalise this process. The Money Rounder requires a currency list,
which is discussed in the next section.

```typescript
import {
    PreciseMoneyFactory,
    RoundedMoneyFactory,
    CustomCurrencyList,
    MoneyRounder,
} from "@cashmoney/core";
const { AUD: PAUD } = PreciseMoneyFactory;
const { AUD: RAUD } = RoundedMoneyFactory;

const currencies = new CustomCurrencyList({ AUD: 2 });
const rounder = new MoneyRounder(currencies);

const pMoney = PAUD("1.50");
const pMoneyMultiplied = PAUD(1.25); // equals "1.875"
const rMoney = rounder.round(pMoney);
assert(rMoney.equals(RAUD("1.88")));
```

CashMoney defaults to [Banker's Rounding](https://en.wikipedia.org/wiki/Banker's_rounding),
which is actually "round half to even". You can change the rounding method
used for any given rounding.

```typescript
import { RoundingMode } from "@cashmoney/core";

const customRounder = new MoneyRounder(currencies, RoundingMode.ROUND_HALF_UP);
const rMoneyHalfUp = rounder.round(pMoneyMultiplied); // equals "1.88"
const rMoneyHalfDown = rounder.round(pMoneyMultiplied, RoundingMode.ROUND_HALF_DOWN); // equals "1.87"
```

Note that this is another departure from MoneyPHP, which simply defaults to
"round half up".

### Currency Lists

In CashMoney, You can construct currency objects at any time with any currency
code (as you've seen in the above examples). As a result, these currency objects
don't contain any information about the currency itself. Most importantly, this
means they can't tell you how many minor units a currency has (eg. AUD uses 2
minor units while JPY uses 0). Instead, this information is provided by *Currency
List* objects.

#### ISO Currency List

Most of the time, you're probably going to want to use the ISO Currency List.
This provides all the data you're going to need about pretty much every
currency you're going to work with in most applications.

```typescript
import { Currency, ISOCurrencyList } from "@cashmoney/core";

const AUD = new Currency("AUD");
const JPY = new CUrrency("JPY");
const isoCurrencyList = new ISOCurrencyList();

assert(isoCurrencyList.contains(AUD));
assert(isoCurrencyList.contains(JPY));
console.log(isoCurrencyList.nameFor(AUD)); // outputs 'Australian Dollar'
console.log(isoCurrencyList.subunitFor(AUD)); // outputs 2
console.log(isoCurrencyList.nameFor(JPY)); // outputs 'Yen'
console.log(isoCurrencyList.subunitFor(JPY)); // outputs 0
```

The ISO Currency List class doesn't pull its data out of thin air. Without
any additional configuration, instances of ``ISOCurrencyList`` won't return
any data at all. This is where the [CashMoney ISO Currencies](https://github.com/cashmoneyjs/iso-currencies)
package comes in.

```bash
$ yarn add @cashmoney/iso-currencies
```

```typescript
import { ISOCurrencyList } from "@cashmoney/core";
import * as currencies from "@cashmoney/iso-currencies/resources/current";

ISOCurrencyList.registerCurrencies(currencies);
```

If you only need a few currencies, you can import them individually in a
manner that should be friendly to tree-shaking.

```typescript
import { ISOCurrencyList } from "@cashmoney/core";
import { AUD, JPY } from "@cashmoney/iso-currencies/resources/current";

ISOCurrencyList.registerCurrency("AUD", AUD);
ISOCurrencyList.registerCurrency("JPY", JPY);
```

See the readme for the [CashMoney ISO Currencies](https://github.com/cashmoneyjs/iso-currencies)
package for more information about the data available in the package.

#### Custom Currency List

For various reasons it may not be practical to use the CashMoney ISO Currencies
package. If you still require the services of a currency list, you can construct
one manually with as few details as necessary. The next example should produce
the same results as the previous example.

```typescript
import { CustomCurrencyList } from "@cashmoney/core";

const currencyData = { AUD: 2, JPY: 2 };
const customCurrencyList = new CustomCurrencyList(currencyData);
```

#### Bitcoin Currency List

CashMoney supports Bitcoin too. The Bitcoin Currency List has hard-coded data
about Bitcoin only.

```typescript
import { Currency, BitcoinCurrencyList } from "@cashmoney/core";

const XBT = new Currency("XBT");
const EUR = new Currency("EUR");
const currencyList = new BitcoinCurrencyList();

assert(currencyList.contains(XBT));
assert(currencyList.contains(AUD) === false);
console.log(currencyList.nameFor(XBT)); // outputs 'Bitcoin'
console.log(currencyList.subunitFor(XBT)); // outputs 8
console.log(currencyList.nameFor(AUD)); // throws Error('AUD is not bitcoin and is not supported by this currency list.'
console.log(currencyList.subunitFor(AUD)); // throws Error('AUD is not bitcoin and is not supported by this currency list.'
```

#### Aggregate Currency List

What do you do when your application needs to support ISO Currencies, Bitcoin,
and potentially other currencies too? You use the Aggregate currency list. It's
accepted everywhere other currency lists are.

```typescript
import {
    AggregateCurrencyList,
    BitcoinCurrencyList,
    ISOCurrencyList,
} from "@cashmoney/core";

const currencyList = new AggregateCurrencyList(
    new BitcoinCurrencyList(),
    new ISOCurrencyList(),
    new CustomCurrencyList({ ZZZ: 42 }),
);
```

#### Create your own currency list

It's pretty easy to make your own currency list class that integrates cleanly with
the rest of CashMoney. The only important thing to remember is that ``nameFor()``
and ``subunitFor()`` must throw an ``Error`` for currencies that don't apply for
your custom list.

```typescript
import { Currency, CurrencyList } from "@cashmoney/core";

class MyAppCurrency implements CurrencyList {
    public contains(currency: Currnecy): boolean {
        return currency.code === "123";
    }

    public nameFor(currency: Currency): string {
        if (this.contains(currency) === false) {
            throw new Error("Cannot handle non-app currencies.");
        }

        return "123 Currency";
    }

    public subunitFor(currency: Currency): number {
        if (this.contains(currency) === false) {
            throw new Error("Cannot handle non-app currencies.");
        }

        return 42;
    }

    public *[Symbol.iterator](): Generator<Currency> {
        yield new Currency("123");
    }
}
```

The ``Symbol.iterator`` method can return any iterator - it doesn't have to
be a generator.

### Parsing

All parsers return instances of ``PreciseMoney``.

#### ISO Code parser

The ISO Code parser parses strings of the form ``"AUD 1.23"`` and ``"AUD 100"``.

```typescript
import { PreciseMoneyFactory, ISOCodeMoneyParser } from "@cashmoney/core";
const { AUD } = PreciseMoneyFactory;

const parser = new ISOCodeMoneyParser();

const fiveAud = parser.parse("AUD 5.00");
assert(fiveAud.equals(AUD(5)));

const fiftyAud = parser.parse("AUD 50");
assert(fiftyAud.equals(AUD(50)));
```

It can also handle strings formatted for different regions.

```typescript
const fiveAudAlt = parser.parse("5.00 AUD");
assert(fiveAudAlt.equals(AUD(5)));

const fiftyAudAlt = parser.parse("5,00 AUD");
assert(fiftyAudAlt.equals(AUD(50)));
```

If you supply it with a list of valid currencies, it will validate the currency code it finds.
An exception will be thrown if the currency code isn't in the list.

```typescript
import {
    ISOCodeMoneyParser,
    CustomCurrencyList,
    ISOCurrencyList,
} from "@cashmoney/core";

const customCurrencies = new CustomCurrencyList({ AUD: 2 });
const parser1 = new ISOCodeMoneyParser(currencies);
const twentyNzd = parser.parse("NZD 20"); // throws Error("Unknown currency code.")

const isoCurrencies = new ISOCurrencyList();
const parser2 = new ISOCodeMoneyParser(isoCurrencies);
const twentyZzz = parser.parse("ZZZ 20"); // throws Error("Unknown currency code.")
```

#### Symbol parser

The Symbol parser parses strings with symbol identifiers. You need to specify what each symbol
means manually. Symbols cannot be longer than three characters in length.

```typescript
import { Currency, SymbolMoneyParser } from "@cashmoney/core";

const symbolMapping = { "$": "AUD", "US$": "USD", "€": "EUR" };
const parser = new SymbolMoneyParser(symbolMapping);

const AUD = new Currency("AUD");
const USD = new Currency("USD");

const audAmount = parser.parse("$5.00");
assert(audAmount.currency.equals(AUD));

const usdAmount = parser.parse("US$5.00");
assert(usdAmount.currency.equals(USD));
```

Similarly to the ISO Code parser, the Symbol parser can recognise strings formatted for
different regions.

```typescript
const audAmountAlt = parser.parse("5.00 $");
assert(audAmountAlt.currency.equals(AUD));

const usdAmountAlt = parser.parse("5,00 US$");
assert(usdAmountAlt.currency.equals(USD));

const EUR = new Currency("EUR");
const eurAmount = parser.parse("10,00 €");
assert(eurAmount.currency.equals(EUR));
```

#### Create your own money parser

What if you store values of your application's currency in a special format?

```typescript
import { PreciseMoney, Currency, MoneyParser } from "@cashmoney/core";

class MyAppMoneyParser implements MoneyParser {
    public parse(input: string): PreciseMoney {
        if (input.startsWith("XXX") === false || input.endsWith("XXX") === false) {
            throw new Error(`Cannot parse '${input} to money.`);
        }

        const amount = input.slice(3, -3);
        const currency = new Currency("123");
        return new PreciseMoney(amount, currency);
    }
}
```

Just remember to throw an ``Error`` for inputs you can't successfully parse.

Maybe all you want to do is provide some additional type safety for your own
custom currency symbol. In this case, you can just subclass ``SymbolMoneyParser``
like so.

```typescript
import { SymbolMoneyParser } from "@cashmoney/core";

class MyAppSymbolMoneyParser extends SymbolMoneyParser {
    public constructor() {
        const mapping = { "%#&": "123" };
        super(mapping);
    }
}
```

### Formatting

You can only format Rounded Money objects. This is by design, as it avoids complications
with formatters needing to work out how many subunits a particular currency has.

#### Intl formatter

Most of the time you're probably going to want to use the Intl money formatter. This uses
the built-in internationalisation APIs provided by up-to-date JS runtimes.

```typescript
import { RoundedMoneyFactory, IntlMoneyFormatter } from "@cashmoney/core";
const { AUD, EUR, JPY, USD } = RoundedMoneyFactory;

const fiveAud = AUD("5.00");
const fiveEur = EUR("5.00");
const fiveJpy = JPY("5");
const fiveUsd = USD("5.00");

const auFormatter = new IntlMoneyFormatter({ locales: "en-AU", style: "currency" });
auFormatter.format(fiveAud); // '$5.00'
auFormatter.format(fiveEur); // 'EUR 5.00'
auFormatter.format(fiveJpy); // 'JPY 5'
auFormatter.format(fiveUsd); // 'USD 5.00'

const euFormatter = new IntlMoneyFormatter({ locales: "es-ES", style: "currency" });
euFormatter.format(fiveAud); // '5,00 AUD'
euFormatter.format(fiveEur); // '5,00 €'
euFormatter.format(fiveJpy); // '5 JPY'
euFormatter.format(fiveUsd); // '5,00 US$'

const jpFormatter = new IntlMoneyFormatter({ locales: "jp-JP", style: "currency" });
jpFormatter.format(fiveAud); // '$5.00'
jpFormatter.format(fiveEur); // 'EUR 5.00'
jpFormatter.format(fiveJpy); // 'JPY 5'
jpFormatter.format(fiveUsd); // 'USD 5.00'

const usFormatter = new IntlMoneyFormatter({ locales: "en-US", style: "currency" });
usFormatter.format(fiveAud); // 'A$5.00'
usFormatter.format(fiveEur); // '€5.00'
usFormatter.format(fiveJpy); // '¥5'
usFormatter.format(fiveUsd); // '$5.00'
```

You should be careful with this, however. The JS Intl number formatter will only
deal with numbers, not strings containing numbers. This means the value of the
money object must first be cast to a float before formatting, which has the potential
to cause a loss of precision.

#### Decimal formatter

The Decimal formatter simply outputs the raw value of a Rounded Money object.

```typescript
import { RoundedMoneyFactory, DecimalMoneyFormatter } from "@cashmoney/core";

const fiveAud = RoundedMoneyFactory.AUD(5);
const formatter = new DecimalMoneyFormatter();
console.log(formatter.format(fiveAud)) // outputs '5.00'
```

This works solely with strings, which means there's no risk of losing precision for
very large numbers.

#### Bitcoin formatter

There's a dedicated Bitcoin formatter. It will only format bitcoin.

```typescript
import { RoundedMoneyFactory, BitcoinMoneyFormatter } from "@cashmoney/core";

const formatter = new BitcoinMoneyFormatter();

const fiveBtc = RoundedMoneyFactory.XBT(5);
console.log(formatter.format(fiveBtc)); // outputs 'É5.00000000'

const fiveGbp = RoundedMoneyFactory.GBP(5);
formatter.format(fiveGbp); // throws Error("Bitcoin Formatter can only format Bitcoin currency.")
```

If you want to omit trailing zeroes, pass a boolean flag when constructing the formatter class.

```typescript
const trimmingFormatter = new BitcoinMoneyFactory(true);

console.log(formatter.format(fiveBtc)); // outputs 'É5'

const moreBtc = RoundedMoneyFactory.XBT(5.5);
console.log(formatter.format(moreBtc)); // outputs 'É5.5'
```

#### Aggregate formatter

The aggregate formatter lets you specify which formatter should be used for each
currency code, with an optional fallback formatter if nothing else matches.

```typescript
import {
    RoundedMoneyFactory,
    AggregateMoneyFormatter,
    IntlMoneyFormatter,
    BitcoinMoneyFormatter,
} from "@cashmoney/core";

const formatter = new AggregateMoneyFormatter({
    'XBT': new BitcoinMoneyFormatter(),
    '*': new IntlMoneyFormatter({ locales: 'en-AU', style: 'currency' }),
});

const fiveAud = RoundedMoneyFactory.AUD(5);
const fiveBtc = RoundedMoneyFactory.XBT(5);

console.log(formatter.format(fiveAud)); // outputs '$5.00'
console.log(formatter.format(fiveBtc)); // outputs 'É5.00000000'
```

#### Create your own money formatter

What if you need special formatting for your application's special currency?

```typescript
import { RoundedMoney, MoneyFormatter } from "@cashmoney/core";

class MyAppMoneyFormatter implements MoneyFormatter {
    public format(money: RoundedMoney): string {
        if (money.currency.code !== "123") {
            throw new Error("MyApp Formatter can only format MyApp currency.");
        }

        return "APP" + money.amount;
    }
}
```

### Cash Rounding

In many currencies, the smallest cash denomination is not the same as the smallest
possible unit of currency. Many countries ditched the 1 cent and 2 cent coins
many years ago, leaving 5 cent coins as the smallest unit of cash. Some countries
have now ditched the 5 cent coin too.

CashMoney has a dedicated tool to help you with this - the cash rounder.

```typescript
import {
    PreciseMoney,
    Currency,
    CashRounder,
    ISOCurrencyList,
    CustomCashDenominationList,
} from "@cashmoney/core";

const currencyList = new ISOCurrencyList();
const denominationList = new CustomCashDenominationList({ AUD: 5, NZD: 10 });
const cashRounder = new CashRounder(currencyList, denominationList);

const aud = new Currency("AUD");
const pMoney = new PreciseMoney("1.23", aud);

const pMoneyRounded = cashRounder.round(pMoney);
assert(pMoneyRounded.equals(new PreciseMoney("1.25", aud)));
```

The cash rounder can also round instances of ``RoundedMoney``, with a slightly
different method.

```typescript
import { RoundedMoney } from "@cashmoney/core";

const rMoney = new RoundedMoney("3.21", 2, aud);

const rMoneyAdjusted = cashRounder.adjust(rMoney);
assert(rMoneyAdjusted.equals(new RoundedMoney("3.20", 2, aud)));
```

The default rounding mode for the cash rounder is "round half to even", like
the other rounding operations in CashMoney. However, this can result in what
may appear to be inconsistent behaviour with rounding values of 5 cents when
dealing with currencies such as ``NZD``, whose smallest unit of cash is 10
cents. To get around this, you can override the default rounding mode.

```typescript
import { RoundingMode } from "@cashmoney/core";

const nzdCashRounder = new CashRounder(
    currencyList,
    denominationList,
    RoundingMode.ROUND_HALF_UP,
);

const nzd = new Currency("NZD");
const rMoneyNzd = new RoundedMoney("1.45", 2, nzd);

const rMoneyNzdAdjustedUp = nzdCashRounder.adjust(rMoneyNzd);
assert(rMoneyNzdAdjustedUp.equals(new RoundedMoney("1.50", 2, nzd)));

const rMoneyNzdAdjustedDown = nzdCashRounder.adjust(rMoneyNzd, RoundingMode.ROUND_HALF_DOWN);
assert(rMoneyNzdAdjustedDown.equals(new RoundedMoney("1.40", 2, nzd)));
```

### Cash Denomination lists

The cash rounder relies on being supplied a cash denomination list that can
tell it what the cash rounding step is. At the moment, there is no precise
list for all currencies that you can use.

#### Custom Cash Denomination list

This should be self-explanatory.

```typescript
import { Currency, CustomCashDenominationList } from "@cashmoney/core";

const denominationList = new CustomCashDenominationList({ USD: 1, AUD: 5 });
const usd = new Currency("USD");
const aud = new Currency("AUD");

assert(denominationList.stepFor(usd) === 1);
assert(denominationList.stepFor(aud) === 5);
```

#### Aggregate Cash Denomination list

This operates in a similar manner to the aggregate currency list, allowing you
to combine multiple sources of data in an easy fashion.

```typescript
import {
    Currency,
    AggregateCashDenominationList,
    CustomCashDenominationList,
} from "@cashmoney/core";

const denominationList = new AggregateCashDenominationList(
    new CustomCashDenominationList({ NZD: 10 }),
);
const nzd = new Currency("NZD");

assert(denominationList.stepFor(nzd) === 10);
```

#### Create your own cash denomination list

Similarly to other service classes in CashMoney, it's very easy to create your own
cash denomination list.

```typescript
import { Currency, CashDenominationList } from "@cashmoney/core";

class MyAppCashDenominationList implements CashDenominationList {
    public contains(currency: Currency): boolean {
        return currency.code === "123";
    }

    public stepFor(currency: Currency): number {
        if (this.contains(currency) === false) {
            throw new Error(`Cannot handle non-app currencies.`);
        }

        return 3;
    }
}
```

Be sure to throw an ``Error`` for currencies your list doesn't support.

## Tests

To run the test suite, run ``yarn run test`` in the root of the repository.

## License

This library is made available under the MIT License (MIT). Please see the [license file](LICENSE.txt)
for more information.

## Acknowledgements

This library started as a direct port of [MoneyPHP](https://github.com/moneyphp/money). If you
ever need to work with monetary values in PHP, I highly recommend it.

By extension, this library is inspired by [Martin Fowler's Money pattern](https://martinfowler.com/eaaCatalog/money.html).

This library was later transformed into what it is today, with the distinction between
"precise" and "rounded" money objects, as a direct inspiration from this blog post
by Mathias Verraes:

http://verraes.net/2016/02/type-safety-and-money/
