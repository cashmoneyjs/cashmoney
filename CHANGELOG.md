# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.9.0] - 2020-03-03

This release should basically be considered a release candidate for ``1.0.0``. There are no changes
planned at this point.

### Changed

- A couple of interfaces have been moved to the general package ``@cashmoney/iso-currency-contracts``.
- A few error messages have been adjusted slightly.

## [0.8.2] - 2020-02-28

### Fixed

- The symbol money parser now actually works.

### Changed

- Some minor adjustments to error messages.
- Service classes are stricter about keeping their settings immutable.

## [0.8.1] - 2020-02-25

### Added

- A new "trim trailing zeroes" flag is now available in the Bitcoin money formatter.

## [0.8.0] - 2020-02-24

### Added

- Cash rounder class, for when you're handling cash with denominations greater than 1 subunit.
- Rounding method for ``RoundedMoney``, to allow even more rounding.

### Changed

- Typescript has been updated. Some dependencies already use Typescript 3.8 functionality, and in future CashMoney will too.

## [0.7.1] - 2020-02-20

- An "oops" fix for the new method in ``0.7.0``.

## [0.7.0] - 2020-02-20

### Added

- ``RoundedMoney`` gained a ``subtractPercentageAndRound`` method.

### Changed

- The ISO Currency List class has been updated to integrate with the ``@cashmoney/iso-currencies`` package.

## [0.6.1] - 2020-02-18

### Added

- A static factory method named ``fromArray`` has been added to both ``PreciseMoney`` and ``RoundedMoney``.
- ``RoundedMoney`` gained the following methods: ``multiply``, ``multiplyAndRound``, ``divide``, ``divideAndRound``, ``percentage``, ``subtractPercentage``.

### Changed

- Calling ``toJSON`` on ``CurrencyPair`` objects directly (as opposed to through ``JSON.stringify) will now return currency codes, not currency objects.
