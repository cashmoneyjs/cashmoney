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

## Tests

To run the test suite, run ``yarn run test`` in the root of this repository.

## License

This library is made available under the MIT License (MIT). Please see the [license file](LICENSE) for more information.

## Acknowledgements

This library is a (mostly) direct port of [MoneyPHP](https://github.com/moneyphp/money). If you
ever need to work with monetary values in PHP, I highly recommend it.

By extension, this library is inspired by [Martin Fowler's Money pattern](https://martinfowler.com/eaaCatalog/money.html).
