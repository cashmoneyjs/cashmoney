# CashMoney

This package is a port of the [MoneyPHP](https://github.com/moneyphp/money) library
to JavaScript.

> "If I had a dime for every time I've seen someone use FLOAT to store currency, I'd have $999.997634" -- [Bill Karwin](https://twitter.com/billkarwin/status/347561901460447232)

As mentioned by the MoneyPHP library, you shouldn't represent monetary values with
floating point numbers. Instead, a dedicated money object should be used instead.
Similarly to MoneyPHP, this library uses strings internally so as to truly support
numbers of arbitrary precision.

This port doesn't yet include everything found in the MoneyPHP library. For example,
support for various exchanges and formatters is not yet available. However, the core
functionality is all available.

## Features

- JSON serialization
- Money formatting using built-in JS Intl functionality
- Money exchange (conversion rates must be supplied manually)

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

```typescript
import { Money, Currency, MoneyFactory } from "@cashmoney/core";
const { AUD } = MoneyFactory;

const fiveAud = new Money(500, new Currency("AUD"));
const tenAud = fiveAud.add(fiveAud);

// Alternatively:
const fiveAudAlt = AUD(500);
const tenAudAlt = AUD(1000);

const [part1, part2, part3] = tenAud.allocate([1, 1, 1]);
assert(part1.equals(AUD(334)));
assert(part2.equals(AUD(333)));
assert(part3.equals(AUD(333)));
```

### Parsing

```typescript
import { Currency, CustomCurrencyList, DecimalMoneyParser } from "@cashmoney/core";

const currencies = new CustomCurrencyList({ AUD: 2 });
const parser = new DecimalMoneyParser(currencies);

const AUD = new Currency("AUD");
const fiveAud = parser.parse("5.00", AUD);
console.log(JSON.stringify(fiveAud)); // outputs '{"amount":"500","currency":"AUD"}'
```

### Formatting

```typescript
import { MoneyFactory, CustomCurrencyList, IntlMoneyFormatter } from "@cashmoney/core";
const { AUD, EUR, USD } = MoneyFactory;

const currencies = new CustomCurrencyList({ AUD: 2, EUR: 2, USD: 2 });
const fiveAud = AUD(500);
const fiveEur = EUR(500);
const fiveUsd = USD(500);

const auFormatter = new IntlMoneyFormatter(currencies, { locales: "en-AU", style: "currency" });
console.log(auFormatter.format(fiveAud)); // outputs '$5.00'
console.log(auFormatter.format(fiveEur)); // outputs 'EUR 5.00'
console.log(auFormatter.format(fiveUsd)); // outputs 'USD 5.00'

const euFormatter = new IntlMoneyFormatter(currencies, { locales: "es-ES", style: "currency" });
console.log(euFormatter.format(fiveAud)); // outputs '5,00 AUD'
console.log(euFormatter.format(fiveEur)); // outputs '5,00 €'
console.log(euFormatter.format(fiveUsd)); // outputs '5,00 US$'

const usFormatter = new IntlMoneyFormatter(currencies, { locales: "en-US", style: "currency" });
console.log(usFormatter.format(fiveAud)); // outputs 'A$5.00'
console.log(usFormatter.format(fiveEur)); // outputs '€5.00'
console.log(usFormatter.format(fiveUsd)); // outputs '$5.00'
```

## Tests

To run the test suite, run ``yarn run test`` in the root of the repository.

## License

This library is made available under the MIT License (MIT). Please see the [license file](LICENSE.txt)
for more information.

## Acknowledgements

This library is a (mostly) direct port of [MoneyPHP](https://github.com/moneyphp/money). If you
ever need to work with monetary values in PHP, I highly recommend it.

By extension, this library is inspired by [Martin Fowler's Money pattern](https://martinfowler.com/eaaCatalog/money.html).
