export enum RoundingMode {
    ROUND_HALF_UP = 1,
    ROUND_HALF_DOWN = 2,
    ROUND_HALF_EVEN = 3,
    ROUND_HALF_ODD = 4,
    ROUND_UP = 5,
    ROUND_DOWN = 6,
    ROUND_HALF_POSITIVE_INFINITY = 7,
    ROUND_HALF_NEGATIVE_INFINITY = 8,
};

export const roundingModeNames = Object.keys(RoundingMode).filter((key: string | number): boolean => {
    return typeof RoundingMode[key] === "number";
}) as ReadonlyArray<keyof RoundingMode>;

export const roundingModes = roundingModeNames.map((key: keyof RoundingMode): number => {
    return RoundingMode[key];
}) as ReadonlyArray<number>;
