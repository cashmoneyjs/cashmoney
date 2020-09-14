// IMPORTANT:
// This file is autogenerated by generate-money-factories.ts
// DO NOT modify directly as your changes will be overwritten

import type { numeric } from "@cashmoney/number";
import RoundedMoney from "./roundedmoney";
import Currency from "./currency";

function moneyFactory(amount: numeric, subunit: number, currencyCode: string): RoundedMoney {
    return new RoundedMoney(amount, subunit, new Currency(currencyCode));
}

export const AED = (amount: number) => moneyFactory(amount, 2, 'AED'); // UAE Dirham
export const AFN = (amount: number) => moneyFactory(amount, 2, 'AFN'); // Afghani
export const ALL = (amount: number) => moneyFactory(amount, 2, 'ALL'); // Lek
export const AMD = (amount: number) => moneyFactory(amount, 2, 'AMD'); // Armenian Dram
export const ANG = (amount: number) => moneyFactory(amount, 2, 'ANG'); // Netherlands Antillean Guilder
export const AOA = (amount: number) => moneyFactory(amount, 2, 'AOA'); // Kwanza
export const ARS = (amount: number) => moneyFactory(amount, 2, 'ARS'); // Argentine Peso
export const AUD = (amount: number) => moneyFactory(amount, 2, 'AUD'); // Australian Dollar
export const AWG = (amount: number) => moneyFactory(amount, 2, 'AWG'); // Aruban Florin
export const AZN = (amount: number) => moneyFactory(amount, 2, 'AZN'); // Azerbaijan Manat
export const BAM = (amount: number) => moneyFactory(amount, 2, 'BAM'); // Convertible Mark
export const BBD = (amount: number) => moneyFactory(amount, 2, 'BBD'); // Barbados Dollar
export const BDT = (amount: number) => moneyFactory(amount, 2, 'BDT'); // Taka
export const BGN = (amount: number) => moneyFactory(amount, 2, 'BGN'); // Bulgarian Lev
export const BHD = (amount: number) => moneyFactory(amount, 3, 'BHD'); // Bahraini Dinar
export const BIF = (amount: number) => moneyFactory(amount, 0, 'BIF'); // Burundi Franc
export const BMD = (amount: number) => moneyFactory(amount, 2, 'BMD'); // Bermudian Dollar
export const BND = (amount: number) => moneyFactory(amount, 2, 'BND'); // Brunei Dollar
export const BOB = (amount: number) => moneyFactory(amount, 2, 'BOB'); // Boliviano
export const BOV = (amount: number) => moneyFactory(amount, 2, 'BOV'); // Mvdol
export const BRL = (amount: number) => moneyFactory(amount, 2, 'BRL'); // Brazilian Real
export const BSD = (amount: number) => moneyFactory(amount, 2, 'BSD'); // Bahamian Dollar
export const BTN = (amount: number) => moneyFactory(amount, 2, 'BTN'); // Ngultrum
export const BWP = (amount: number) => moneyFactory(amount, 2, 'BWP'); // Pula
export const BYN = (amount: number) => moneyFactory(amount, 2, 'BYN'); // Belarusian Ruble
export const BZD = (amount: number) => moneyFactory(amount, 2, 'BZD'); // Belize Dollar
export const CAD = (amount: number) => moneyFactory(amount, 2, 'CAD'); // Canadian Dollar
export const CDF = (amount: number) => moneyFactory(amount, 2, 'CDF'); // Congolese Franc
export const CHE = (amount: number) => moneyFactory(amount, 2, 'CHE'); // WIR Euro
export const CHF = (amount: number) => moneyFactory(amount, 2, 'CHF'); // Swiss Franc
export const CHW = (amount: number) => moneyFactory(amount, 2, 'CHW'); // WIR Franc
export const CLF = (amount: number) => moneyFactory(amount, 4, 'CLF'); // Unidad de Fomento
export const CLP = (amount: number) => moneyFactory(amount, 0, 'CLP'); // Chilean Peso
export const CNY = (amount: number) => moneyFactory(amount, 2, 'CNY'); // Yuan Renminbi
export const COP = (amount: number) => moneyFactory(amount, 2, 'COP'); // Colombian Peso
export const COU = (amount: number) => moneyFactory(amount, 2, 'COU'); // Unidad de Valor Real
export const CRC = (amount: number) => moneyFactory(amount, 2, 'CRC'); // Costa Rican Colon
export const CUC = (amount: number) => moneyFactory(amount, 2, 'CUC'); // Peso Convertible
export const CUP = (amount: number) => moneyFactory(amount, 2, 'CUP'); // Cuban Peso
export const CVE = (amount: number) => moneyFactory(amount, 2, 'CVE'); // Cabo Verde Escudo
export const CZK = (amount: number) => moneyFactory(amount, 2, 'CZK'); // Czech Koruna
export const DJF = (amount: number) => moneyFactory(amount, 0, 'DJF'); // Djibouti Franc
export const DKK = (amount: number) => moneyFactory(amount, 2, 'DKK'); // Danish Krone
export const DOP = (amount: number) => moneyFactory(amount, 2, 'DOP'); // Dominican Peso
export const DZD = (amount: number) => moneyFactory(amount, 2, 'DZD'); // Algerian Dinar
export const EGP = (amount: number) => moneyFactory(amount, 2, 'EGP'); // Egyptian Pound
export const ERN = (amount: number) => moneyFactory(amount, 2, 'ERN'); // Nakfa
export const ETB = (amount: number) => moneyFactory(amount, 2, 'ETB'); // Ethiopian Birr
export const EUR = (amount: number) => moneyFactory(amount, 2, 'EUR'); // Euro
export const FJD = (amount: number) => moneyFactory(amount, 2, 'FJD'); // Fiji Dollar
export const FKP = (amount: number) => moneyFactory(amount, 2, 'FKP'); // Falkland Islands Pound
export const GBP = (amount: number) => moneyFactory(amount, 2, 'GBP'); // Pound Sterling
export const GEL = (amount: number) => moneyFactory(amount, 2, 'GEL'); // Lari
export const GHS = (amount: number) => moneyFactory(amount, 2, 'GHS'); // Ghana Cedi
export const GIP = (amount: number) => moneyFactory(amount, 2, 'GIP'); // Gibraltar Pound
export const GMD = (amount: number) => moneyFactory(amount, 2, 'GMD'); // Dalasi
export const GNF = (amount: number) => moneyFactory(amount, 0, 'GNF'); // Guinean Franc
export const GTQ = (amount: number) => moneyFactory(amount, 2, 'GTQ'); // Quetzal
export const GYD = (amount: number) => moneyFactory(amount, 2, 'GYD'); // Guyana Dollar
export const HKD = (amount: number) => moneyFactory(amount, 2, 'HKD'); // Hong Kong Dollar
export const HNL = (amount: number) => moneyFactory(amount, 2, 'HNL'); // Lempira
export const HRK = (amount: number) => moneyFactory(amount, 2, 'HRK'); // Kuna
export const HTG = (amount: number) => moneyFactory(amount, 2, 'HTG'); // Gourde
export const HUF = (amount: number) => moneyFactory(amount, 2, 'HUF'); // Forint
export const IDR = (amount: number) => moneyFactory(amount, 2, 'IDR'); // Rupiah
export const ILS = (amount: number) => moneyFactory(amount, 2, 'ILS'); // New Israeli Sheqel
export const INR = (amount: number) => moneyFactory(amount, 2, 'INR'); // Indian Rupee
export const IQD = (amount: number) => moneyFactory(amount, 3, 'IQD'); // Iraqi Dinar
export const IRR = (amount: number) => moneyFactory(amount, 2, 'IRR'); // Iranian Rial
export const ISK = (amount: number) => moneyFactory(amount, 0, 'ISK'); // Iceland Krona
export const JMD = (amount: number) => moneyFactory(amount, 2, 'JMD'); // Jamaican Dollar
export const JOD = (amount: number) => moneyFactory(amount, 3, 'JOD'); // Jordanian Dinar
export const JPY = (amount: number) => moneyFactory(amount, 0, 'JPY'); // Yen
export const KES = (amount: number) => moneyFactory(amount, 2, 'KES'); // Kenyan Shilling
export const KGS = (amount: number) => moneyFactory(amount, 2, 'KGS'); // Som
export const KHR = (amount: number) => moneyFactory(amount, 2, 'KHR'); // Riel
export const KMF = (amount: number) => moneyFactory(amount, 0, 'KMF'); // Comorian Franc
export const KPW = (amount: number) => moneyFactory(amount, 2, 'KPW'); // North Korean Won
export const KRW = (amount: number) => moneyFactory(amount, 0, 'KRW'); // Won
export const KWD = (amount: number) => moneyFactory(amount, 3, 'KWD'); // Kuwaiti Dinar
export const KYD = (amount: number) => moneyFactory(amount, 2, 'KYD'); // Cayman Islands Dollar
export const KZT = (amount: number) => moneyFactory(amount, 2, 'KZT'); // Tenge
export const LAK = (amount: number) => moneyFactory(amount, 2, 'LAK'); // Lao Kip
export const LBP = (amount: number) => moneyFactory(amount, 2, 'LBP'); // Lebanese Pound
export const LKR = (amount: number) => moneyFactory(amount, 2, 'LKR'); // Sri Lanka Rupee
export const LRD = (amount: number) => moneyFactory(amount, 2, 'LRD'); // Liberian Dollar
export const LSL = (amount: number) => moneyFactory(amount, 2, 'LSL'); // Loti
export const LYD = (amount: number) => moneyFactory(amount, 3, 'LYD'); // Libyan Dinar
export const MAD = (amount: number) => moneyFactory(amount, 2, 'MAD'); // Moroccan Dirham
export const MDL = (amount: number) => moneyFactory(amount, 2, 'MDL'); // Moldovan Leu
export const MGA = (amount: number) => moneyFactory(amount, 2, 'MGA'); // Malagasy Ariary
export const MKD = (amount: number) => moneyFactory(amount, 2, 'MKD'); // Denar
export const MMK = (amount: number) => moneyFactory(amount, 2, 'MMK'); // Kyat
export const MNT = (amount: number) => moneyFactory(amount, 2, 'MNT'); // Tugrik
export const MOP = (amount: number) => moneyFactory(amount, 2, 'MOP'); // Pataca
export const MRU = (amount: number) => moneyFactory(amount, 2, 'MRU'); // Ouguiya
export const MUR = (amount: number) => moneyFactory(amount, 2, 'MUR'); // Mauritius Rupee
export const MVR = (amount: number) => moneyFactory(amount, 2, 'MVR'); // Rufiyaa
export const MWK = (amount: number) => moneyFactory(amount, 2, 'MWK'); // Malawi Kwacha
export const MXN = (amount: number) => moneyFactory(amount, 2, 'MXN'); // Mexican Peso
export const MXV = (amount: number) => moneyFactory(amount, 2, 'MXV'); // Mexican Unidad de Inversion (UDI)
export const MYR = (amount: number) => moneyFactory(amount, 2, 'MYR'); // Malaysian Ringgit
export const MZN = (amount: number) => moneyFactory(amount, 2, 'MZN'); // Mozambique Metical
export const NAD = (amount: number) => moneyFactory(amount, 2, 'NAD'); // Namibia Dollar
export const NGN = (amount: number) => moneyFactory(amount, 2, 'NGN'); // Naira
export const NIO = (amount: number) => moneyFactory(amount, 2, 'NIO'); // Cordoba Oro
export const NOK = (amount: number) => moneyFactory(amount, 2, 'NOK'); // Norwegian Krone
export const NPR = (amount: number) => moneyFactory(amount, 2, 'NPR'); // Nepalese Rupee
export const NZD = (amount: number) => moneyFactory(amount, 2, 'NZD'); // New Zealand Dollar
export const OMR = (amount: number) => moneyFactory(amount, 3, 'OMR'); // Rial Omani
export const PAB = (amount: number) => moneyFactory(amount, 2, 'PAB'); // Balboa
export const PEN = (amount: number) => moneyFactory(amount, 2, 'PEN'); // Sol
export const PGK = (amount: number) => moneyFactory(amount, 2, 'PGK'); // Kina
export const PHP = (amount: number) => moneyFactory(amount, 2, 'PHP'); // Philippine Peso
export const PKR = (amount: number) => moneyFactory(amount, 2, 'PKR'); // Pakistan Rupee
export const PLN = (amount: number) => moneyFactory(amount, 2, 'PLN'); // Zloty
export const PYG = (amount: number) => moneyFactory(amount, 0, 'PYG'); // Guarani
export const QAR = (amount: number) => moneyFactory(amount, 2, 'QAR'); // Qatari Rial
export const RON = (amount: number) => moneyFactory(amount, 2, 'RON'); // Romanian Leu
export const RSD = (amount: number) => moneyFactory(amount, 2, 'RSD'); // Serbian Dinar
export const RUB = (amount: number) => moneyFactory(amount, 2, 'RUB'); // Russian Ruble
export const RWF = (amount: number) => moneyFactory(amount, 0, 'RWF'); // Rwanda Franc
export const SAR = (amount: number) => moneyFactory(amount, 2, 'SAR'); // Saudi Riyal
export const SBD = (amount: number) => moneyFactory(amount, 2, 'SBD'); // Solomon Islands Dollar
export const SCR = (amount: number) => moneyFactory(amount, 2, 'SCR'); // Seychelles Rupee
export const SDG = (amount: number) => moneyFactory(amount, 2, 'SDG'); // Sudanese Pound
export const SEK = (amount: number) => moneyFactory(amount, 2, 'SEK'); // Swedish Krona
export const SGD = (amount: number) => moneyFactory(amount, 2, 'SGD'); // Singapore Dollar
export const SHP = (amount: number) => moneyFactory(amount, 2, 'SHP'); // Saint Helena Pound
export const SLL = (amount: number) => moneyFactory(amount, 2, 'SLL'); // Leone
export const SOS = (amount: number) => moneyFactory(amount, 2, 'SOS'); // Somali Shilling
export const SRD = (amount: number) => moneyFactory(amount, 2, 'SRD'); // Surinam Dollar
export const SSP = (amount: number) => moneyFactory(amount, 2, 'SSP'); // South Sudanese Pound
export const STN = (amount: number) => moneyFactory(amount, 2, 'STN'); // Dobra
export const SVC = (amount: number) => moneyFactory(amount, 2, 'SVC'); // El Salvador Colon
export const SYP = (amount: number) => moneyFactory(amount, 2, 'SYP'); // Syrian Pound
export const SZL = (amount: number) => moneyFactory(amount, 2, 'SZL'); // Lilangeni
export const THB = (amount: number) => moneyFactory(amount, 2, 'THB'); // Baht
export const TJS = (amount: number) => moneyFactory(amount, 2, 'TJS'); // Somoni
export const TMT = (amount: number) => moneyFactory(amount, 2, 'TMT'); // Turkmenistan New Manat
export const TND = (amount: number) => moneyFactory(amount, 3, 'TND'); // Tunisian Dinar
export const TOP = (amount: number) => moneyFactory(amount, 2, 'TOP'); // Pa’anga
export const TRY = (amount: number) => moneyFactory(amount, 2, 'TRY'); // Turkish Lira
export const TTD = (amount: number) => moneyFactory(amount, 2, 'TTD'); // Trinidad and Tobago Dollar
export const TWD = (amount: number) => moneyFactory(amount, 2, 'TWD'); // New Taiwan Dollar
export const TZS = (amount: number) => moneyFactory(amount, 2, 'TZS'); // Tanzanian Shilling
export const UAH = (amount: number) => moneyFactory(amount, 2, 'UAH'); // Hryvnia
export const UGX = (amount: number) => moneyFactory(amount, 0, 'UGX'); // Uganda Shilling
export const USD = (amount: number) => moneyFactory(amount, 2, 'USD'); // US Dollar
export const USN = (amount: number) => moneyFactory(amount, 2, 'USN'); // US Dollar (Next day)
export const UYI = (amount: number) => moneyFactory(amount, 0, 'UYI'); // Uruguay Peso en Unidades Indexadas (UI)
export const UYU = (amount: number) => moneyFactory(amount, 2, 'UYU'); // Peso Uruguayo
export const UYW = (amount: number) => moneyFactory(amount, 4, 'UYW'); // Unidad Previsional
export const UZS = (amount: number) => moneyFactory(amount, 2, 'UZS'); // Uzbekistan Sum
export const VES = (amount: number) => moneyFactory(amount, 2, 'VES'); // Bolívar Soberano
export const VND = (amount: number) => moneyFactory(amount, 0, 'VND'); // Dong
export const VUV = (amount: number) => moneyFactory(amount, 0, 'VUV'); // Vatu
export const WST = (amount: number) => moneyFactory(amount, 2, 'WST'); // Tala
export const XAF = (amount: number) => moneyFactory(amount, 0, 'XAF'); // CFA Franc BEAC
export const XAG = (amount: number) => moneyFactory(amount, 0, 'XAG'); // Silver
export const XAU = (amount: number) => moneyFactory(amount, 0, 'XAU'); // Gold
export const XBA = (amount: number) => moneyFactory(amount, 0, 'XBA'); // Bond Markets Unit European Composite Unit (EURCO)
export const XBB = (amount: number) => moneyFactory(amount, 0, 'XBB'); // Bond Markets Unit European Monetary Unit (E.M.U.-6)
export const XBC = (amount: number) => moneyFactory(amount, 0, 'XBC'); // Bond Markets Unit European Unit of Account 9 (E.U.A.-9)
export const XBD = (amount: number) => moneyFactory(amount, 0, 'XBD'); // Bond Markets Unit European Unit of Account 17 (E.U.A.-17)
export const XBT = (amount: number) => moneyFactory(amount, 8, 'XBT'); // Bitcoin
export const XCD = (amount: number) => moneyFactory(amount, 2, 'XCD'); // East Caribbean Dollar
export const XDR = (amount: number) => moneyFactory(amount, 0, 'XDR'); // SDR (Special Drawing Right)
export const XOF = (amount: number) => moneyFactory(amount, 0, 'XOF'); // CFA Franc BCEAO
export const XPD = (amount: number) => moneyFactory(amount, 0, 'XPD'); // Palladium
export const XPF = (amount: number) => moneyFactory(amount, 0, 'XPF'); // CFP Franc
export const XPT = (amount: number) => moneyFactory(amount, 0, 'XPT'); // Platinum
export const XSU = (amount: number) => moneyFactory(amount, 0, 'XSU'); // Sucre
export const XTS = (amount: number) => moneyFactory(amount, 0, 'XTS'); // Codes specifically reserved for testing purposes
export const XUA = (amount: number) => moneyFactory(amount, 0, 'XUA'); // ADB Unit of Account
export const XXX = (amount: number) => moneyFactory(amount, 0, 'XXX'); // The codes assigned for transactions where no currency is involved
export const YER = (amount: number) => moneyFactory(amount, 2, 'YER'); // Yemeni Rial
export const ZAR = (amount: number) => moneyFactory(amount, 2, 'ZAR'); // Rand
export const ZMW = (amount: number) => moneyFactory(amount, 2, 'ZMW'); // Zambian Kwacha
export const ZWL = (amount: number) => moneyFactory(amount, 2, 'ZWL'); // Zimbabwe Dollar
