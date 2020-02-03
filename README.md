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

- JSON Serialization
- Money formatting using built-in JS Intl functionality
- Money exchange (conversion rates must be supplied manually)

## Install

With yarn:

```bash
$ yarn add cashmoney
```

Or with npm:

```bash
$ npm add cashmoney
```

## Example usage

```typescript
import Money from "cashmoney/money";
import Currency from "cashmoney/currency";
import { AUD } from "cashmoney/factory";

const fiveAud = new Money(500, new Currency("AUD"));
const tenAud = fiveAud.add(fiveAud);

// Or alternatively
const fiveAudAlt = AUD(500);
const tenAudAlt = AUD(1000);

const [part1, part2, part3] = tenAud.allocate([1, 1, 1]);
assert(part1.equals(AUD(334)));
assert(part2.equals(AUD(333)));
assert(part3.equals(AUD(333)));
```

## Tests

To run the test suite, run ``yarn run test`` in the root of this repository.

## License

This library is made available under the MIT License (MIT). Please see the [license file](LICENSE) for more information.

## Acknowledgements

This library is a (mostly) direct port of [MoneyPHP](https://github.com/moneyphp/money). If you
ever need to work with monetary values in PHP, I highly recommend it.

By extension, this library is inspired by [Martin Fowler's Money pattern](https://martinfowler.com/eaaCatalog/money.html).
