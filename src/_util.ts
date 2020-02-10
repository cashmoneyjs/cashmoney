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
};
