export default class Currency {
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

    public toString(): string {
        return this.code;
    }

    public toJSON(): string {
        return this.code;
    }
}
