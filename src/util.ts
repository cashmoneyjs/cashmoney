export function stringSplice(str: string, index: number, count: number, add: string = "") {
    return str.slice(0, index) + add + str.slice(index + count);
};

export function stringPhpSubstr(str: string, start: number, length?: number): string {
    if (str.length === 0 && start === 0) {
        if (length !== undefined && length < 0) {
            throw new Error("Invalid combination of parameters.");
        }
        return "";
    }

	let end = str.length;

    if (start < 0) {
        start += end;
    }

    if (typeof length !== 'undefined') {
        if (length < 0) {
            end = length + end;
        } else {
            end = length + start;
        }
    }

    // PHP returns false if start does not fall within the string.
    // PHP returns false if the calculated end comes before the calculated start.
    // PHP returns an empty string if start and end are the same.
    // Otherwise, PHP returns the portion of the string from start to end.
    if (start >= str.length || start < 0 || start > end) {
        throw new Error("Invalid combination of parameters.");
    }

    return str.slice(start, end);
};

/**
 * This function is used for code that expects to be able to
 * concatenate 'false' with strings. In PHP, this works fine,
 * as the 'false' gets cast to an empty string automatically.
 */
export function stringPhpSubstrBroke(str: string, start: number, length?: number): string {
    let result: string;

    try {
        result = stringPhpSubstr(str, start, length);
    } catch (e) {
        result = "";
    }

    return result;
}

export function arraySum(arr: number[]): number {
    let sum = 0;

    for (const num of arr) {
        sum += num;
    }

    return sum;
};

export function arrayKeysWithSearch<T>(arr: T[], search: T, strict: boolean = false): number[] {
    const arrKeys = [];

    for (const [key, val] of arr.entries()) {
        const check = strict === true ? val === search : val == search;
        if (check === true) {
            arrKeys.push(key);
        }
    }

    return arrKeys;
};

export function mapKeysWithSearch<T>(map: Map<number, T>, search: T, strict: boolean = false): number[] {
    const mapKeys = [];

    for (const [key, val] of map.entries()) {
        const check = strict === true ? val === search : val == search;
        if (check === true) {
            mapKeys.push(key);
        }
    }

    return mapKeys;
};

interface GenericObj<T> {
    [key: string]: T;
}

export function objectKeysWithSearch<T>(obj: GenericObj<T>, search: T, strict: boolean = false): Array<keyof GenericObj<T>> {
    const objKeys = [];

    for (const [key, val] of Object.entries(obj)) {
        const check = strict === true ? val === search : val == search;
        if (check === true) {
            objKeys.push(key);
        }
    }

    return objKeys;
};
