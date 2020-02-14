import SymbolMoneyParser from "./symbol";
import { SYMBOL as BITCOIN_SYMBOL, CODE as BITCOIN_CODE } from "../currencylists/bitcoin";

export default class BitcoinMoneyParser extends SymbolMoneyParser {
    public constructor() {
        const mapping = { [BITCOIN_SYMBOL]: BITCOIN_CODE };
        super(mapping);
    }
}
