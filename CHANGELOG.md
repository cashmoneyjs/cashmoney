# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.6.1] - 2020-02-18

### Added

- A static factory method named ``fromArray`` has been added to both ``PreciseMoney`` and ``RoundedMoney``.
- ``RoundedMoney`` gained the following methods: ``multiply``, ``multiplyAndRound``, ``divide``, ``divideAndRound``, ``percentage``, ``subtractPercentage``.

### Changed

- Calling ``toJSON`` on ``CurrencyPair`` objects directly (as opposed to through ``JSON.stringify) will now return currency codes, not currency objects.
