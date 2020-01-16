import { CurrencyList } from "./currencylist";

export class Currency {
    public readonly code: string;

    public constructor(code: string) {
        if (code.length === 0) {
            throw new Error("Currency code should not be empty string");
        }

        this.code = code;
    }

    public equals(other: Currency): boolean {
        return this.code === other.code;
    }

    public isAvailableWithin(currencyList: CurrencyList): boolean {
        return currencyList.contains(this);
    }

    public toString(): string {
        return this.code;
    }

    public toJSON(): string {
        return this.code;
    }
}
